import type { PrismaClient } from '@prisma/client';

import {
  buildPricingCatalog,
  defaultPriceRateSeedRows,
  type PricingCatalog,
} from '~/lib/pricing-catalog';
import {
  PRICING_SETTING_DEFS,
  buildPricingSettings,
  type PricingSettings,
} from '~/lib/pricing-settings';

let ensurePromise: Promise<void> | null = null;

export function ensurePricingCatalog(db: PrismaClient) {
  ensurePromise ??= seedPricingCatalog(db).finally(() => {
    ensurePromise = null;
  });
  return ensurePromise;
}

async function seedPricingCatalog(db: PrismaClient) {
  const seedRates = defaultPriceRateSeedRows();
  const [rates, settings] = await Promise.all([
    db.priceRate.findMany({
      select: { service: true, optionKey: true, variantKey: true },
    }),
    db.priceSetting.findMany({
      select: { key: true, group: true, label: true, unit: true, sortOrder: true, textValue: true },
    }),
  ]);

  const rateKeys = new Set(rates.map((rate) => `${rate.service}\0${rate.optionKey}\0${rate.variantKey}`));
  const missingRates = seedRates.filter(
    (row) => !rateKeys.has(`${row.service}\0${row.optionKey}\0${row.variantKey}`)
  );
  const settingByKey = new Map(settings.map((setting) => [setting.key, setting]));
  const missingSettings = PRICING_SETTING_DEFS.filter((def) => !settingByKey.has(def.key));
  const staleSettings = PRICING_SETTING_DEFS.filter((def) => {
    const row = settingByKey.get(def.key);
    if (!row) return false;
    return (
      row.group !== def.group ||
      row.label !== def.label ||
      row.unit !== def.unit ||
      row.sortOrder !== def.sortOrder
    );
  });
  const emptyTextSettings = PRICING_SETTING_DEFS.filter((def) => {
    if (def.kind !== 'text' || !def.defaultText) return false;
    const row = settingByKey.get(def.key);
    return Boolean(row && !row.textValue?.trim());
  });

  if (
    !missingRates.length &&
    !missingSettings.length &&
    !staleSettings.length &&
    !emptyTextSettings.length
  ) {
    return;
  }

  await db.$transaction([
    ...(missingRates.length
      ? [
          db.priceRate.createMany({
            data: missingRates.map((row) => ({
              service: row.service,
              optionKey: row.optionKey,
              variantKey: row.variantKey,
              rate: row.rate,
              sortOrder: row.sortOrder ?? 0,
            })),
            skipDuplicates: true,
          }),
        ]
      : []),
    ...(missingSettings.length
      ? [
          db.priceSetting.createMany({
            data: missingSettings.map((def) => ({
              key: def.key,
              group: def.group,
              label: def.label,
              unit: def.unit,
              value: def.defaultValue,
              textValue: def.kind === 'text' ? (def.defaultText ?? null) : null,
              sortOrder: def.sortOrder,
            })),
            skipDuplicates: true,
          }),
        ]
      : []),
    ...staleSettings.map((def) =>
      db.priceSetting.update({
        where: { key: def.key },
        data: {
          group: def.group,
          label: def.label,
          unit: def.unit,
          sortOrder: def.sortOrder,
        },
      })
    ),
    ...emptyTextSettings.map((def) =>
      db.priceSetting.updateMany({
        where: {
          key: def.key,
          OR: [{ textValue: null }, { textValue: '' }],
        },
        data: { textValue: def.defaultText },
      })
    ),
  ]);
}

export async function getPricingSettings(db: PrismaClient): Promise<PricingSettings> {
  await ensurePricingCatalog(db);
  const rows = await db.priceSetting.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return buildPricingSettings(rows);
}

export async function getPricingCatalog(db: PrismaClient): Promise<PricingCatalog> {
  await ensurePricingCatalog(db);
  const [rows, settingRows] = await Promise.all([
    db.priceRate.findMany({
      orderBy: [{ service: 'asc' }, { sortOrder: 'asc' }],
    }),
    db.priceSetting.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
  ]);
  return buildPricingCatalog(rows, buildPricingSettings(settingRows));
}
