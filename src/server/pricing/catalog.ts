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

export async function ensurePricingCatalog(db: PrismaClient) {
  const rows = defaultPriceRateSeedRows();

  for (const row of rows) {
    await db.priceRate.upsert({
      where: {
        service_optionKey_variantKey: {
          service: row.service,
          optionKey: row.optionKey,
          variantKey: row.variantKey,
        },
      },
      update: {},
      create: {
        service: row.service,
        optionKey: row.optionKey,
        variantKey: row.variantKey,
        rate: row.rate,
        sortOrder: row.sortOrder ?? 0,
      },
    });
  }

  for (const def of PRICING_SETTING_DEFS) {
    await db.priceSetting.upsert({
      where: { key: def.key },
      update: {
        group: def.group,
        label: def.label,
        unit: def.unit,
        sortOrder: def.sortOrder,
      },
      create: {
        key: def.key,
        group: def.group,
        label: def.label,
        unit: def.unit,
        value: def.defaultValue,
        textValue: def.kind === 'text' ? (def.defaultText ?? null) : null,
        sortOrder: def.sortOrder,
      },
    });

    // Backfill benefit/text defaults when rows were created before textValue existed.
    if (def.kind === 'text' && def.defaultText) {
      await db.priceSetting.updateMany({
        where: {
          key: def.key,
          OR: [{ textValue: null }, { textValue: '' }],
        },
        data: { textValue: def.defaultText },
      });
    }
  }
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
