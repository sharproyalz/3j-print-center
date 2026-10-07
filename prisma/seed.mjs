import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const db = new PrismaClient();

const email = (process.env.SEED_ADMIN_EMAIL || 'admin@3jprintcenter.local').toLowerCase();
const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
const name = process.env.SEED_ADMIN_NAME || 'Local Admin';

const FLAT_RATE_VARIANT = 'Base';

const TARPAULIN_RATES = {
  '10 oz Tarpaulin': { 'Eco-Solvent': 20 },
  '12 oz Tarpaulin': { 'Eco-Solvent': 25 },
  '13 oz Tarpaulin': { 'Eco-Solvent': 27, Solvent: 30, 'UV Print': 80 },
  '18 oz Blackout Tarp': { 'Eco-Solvent': 50, Solvent: 60, 'UV Print': 125 },
  'Printed Panaflex 18 oz': { 'Eco-Solvent': 90, Solvent: 100, 'UV Print': 150 },
};

const STICKER_RATES = {
  'White Vinyl Sticker': { 'Non-Laminated': 0.8, Laminated: 1.0 },
  'Clear / Transparent Sticker': { 'Non-Laminated': 0.8, Laminated: 1.0 },
  'Printed 3M Sticker — Branded': { 'Non-Laminated': 4.5, Laminated: 5.5 },
};

const DTF_SHIRT_RATES = {
  A6: 50,
  A5: 75,
  A4: 100,
  A3: 180,
};

const DTF_TRANSFER_TIERS = [
  { minMeters: 1, label: '1–9 meters', rate: 180 },
  { minMeters: 10, label: '10–49 meters', rate: 150 },
  { minMeters: 50, label: '50–99 meters', rate: 130 },
  { minMeters: 100, label: '100–499 meters', rate: 120 },
  { minMeters: 500, label: '500–999 meters', rate: 110 },
];

const SUBLIMATION_RATES = {
  'Jersey Shirt — Regular Cut': 500,
  'Jersey Shirt — NBA Cut': 550,
  'Jersey Set — Regular Cut': 750,
  'Jersey Set — NBA Cut': 800,
  'Polo — Knitted Collar': 520,
  'Polo — Fabric Collar': 500,
  'T-Shirt — Round Neck': 400,
  'T-Shirt — V-Neck': 400,
  'Long Sleeve': 480,
  'Chinese Collar': 500,
  'Hoodie Long Sleeve': 600,
};

const SIGNAGE_FRAME_RATES = {
  'Panaflex — Non-Lighted': {
    'Cut-out Sticker — Laminated': 550,
    'Printed Panaflex · Eco-Solvent': 600,
    'Printed Panaflex · Solvent': 650,
    'Printed Panaflex · UV Print': 750,
  },
  'Panaflex — Lighted': {
    'Cut-out Sticker — Laminated': 750,
    'Printed Panaflex · Eco-Solvent': 700,
    'Printed Panaflex · Solvent': 750,
    'Printed Panaflex · UV Print': 850,
  },
  'Blackout Tarp Signage — With Frame': {
    'Eco-Solvent': 450,
    Solvent: 500,
    'UV Print': 700,
  },
};

const SINTRA_RATES = {
  '3mm': { 'Front Only': 1.1, 'Back to Back': 1.85 },
  '5mm': { 'Front Only': 1.35, 'Back to Back': 2.35 },
};

function matrixToRows(service, matrix) {
  const rows = [];
  let sortOrder = 0;
  for (const [optionKey, variants] of Object.entries(matrix)) {
    for (const [variantKey, rate] of Object.entries(variants)) {
      rows.push({ service, optionKey, variantKey, rate, sortOrder });
      sortOrder += 1;
    }
  }
  return rows;
}

function flatMapToRows(service, rates) {
  return Object.entries(rates).map(([optionKey, rate], index) => ({
    service,
    optionKey,
    variantKey: FLAT_RATE_VARIANT,
    rate,
    sortOrder: index,
  }));
}

function dtfTransferTiersToRows(tiers) {
  return tiers.map((tier, index) => ({
    service: 'DTF_TRANSFER',
    optionKey: String(tier.minMeters),
    variantKey: tier.label,
    rate: tier.rate,
    sortOrder: index,
  }));
}

const PRICE_SETTINGS = [
  {
    key: 'dtf.shoulderNameFee',
    group: 'DTF Shirt',
    label: 'Shoulder name add-on',
    unit: '₱ / piece',
    value: 25,
    sortOrder: 1,
  },
  {
    key: 'dtf.transferSpecialMinMeters',
    group: 'DTF Transfer',
    label: 'Special volume pricing from (meters)',
    unit: 'meters',
    value: 1000,
    sortOrder: 2,
  },
  {
    key: 'sublimation.fabric200GsmAddon',
    group: 'Sublimation',
    label: '200 GSM fabric add-on',
    unit: '₱ / piece',
    value: 20,
    sortOrder: 3,
  },
  {
    key: 'sublimation.layoutFeePerDesign',
    group: 'Sublimation',
    label: 'Layout fee per unique design',
    unit: '₱ / design',
    value: 500,
    sortOrder: 4,
  },
  {
    key: 'sublimation.oversizedAddon',
    group: 'Sublimation',
    label: '4XL–6XL add-on',
    unit: '₱ / piece',
    value: 100,
    sortOrder: 5,
  },
  {
    key: 'tarpaulin.minimumPrintingCharge',
    group: 'Tarpaulin',
    label: 'Minimum printing charge',
    unit: '₱ / job',
    value: 150,
    sortOrder: 6,
  },
  {
    key: 'tarpaulin.layoutFeePerLayout',
    group: 'Tarpaulin',
    label: 'Layout fee per unique layout',
    unit: '₱ / layout',
    value: 150,
    sortOrder: 7,
  },
  {
    key: 'stickers.minimumJobCharge',
    group: 'Stickers',
    label: 'Minimum job charge',
    unit: '₱ / job',
    value: 300,
    sortOrder: 8,
  },
  {
    key: 'signage.sintraLaminationPerSqIn',
    group: 'Sintra',
    label: 'Lamination add-on',
    unit: '₱ / sq.in',
    value: 0.15,
    sortOrder: 9,
  },
  {
    key: 'signage.sintraStandPerSqIn',
    group: 'Sintra',
    label: 'Stand / standee add-on',
    unit: '₱ / sq.in',
    value: 0.25,
    sortOrder: 10,
  },
  {
    key: 'tarpaulin.volume.tier1MinSqFt',
    group: 'Volume · Tarpaulin',
    label: 'Tier 1 from (sq.ft)',
    unit: 'sq.ft',
    value: 50,
    sortOrder: 20,
  },
  {
    key: 'tarpaulin.volume.tier1Percent',
    group: 'Volume · Tarpaulin',
    label: 'Tier 1 discount',
    unit: '%',
    value: 5,
    sortOrder: 21,
  },
  {
    key: 'tarpaulin.volume.tier2MinSqFt',
    group: 'Volume · Tarpaulin',
    label: 'Tier 2 from (sq.ft)',
    unit: 'sq.ft',
    value: 100,
    sortOrder: 22,
  },
  {
    key: 'tarpaulin.volume.tier2Percent',
    group: 'Volume · Tarpaulin',
    label: 'Tier 2 discount',
    unit: '%',
    value: 10,
    sortOrder: 23,
  },
  {
    key: 'tarpaulin.volume.tier3MinSqFt',
    group: 'Volume · Tarpaulin',
    label: 'Tier 3 from (sq.ft)',
    unit: 'sq.ft',
    value: 200,
    sortOrder: 24,
  },
  {
    key: 'tarpaulin.volume.tier3Percent',
    group: 'Volume · Tarpaulin',
    label: 'Tier 3 discount',
    unit: '%',
    value: 15,
    sortOrder: 25,
  },
  {
    key: 'dtfShirt.volume.tier1MinPlacements',
    group: 'Volume · DTF Shirt',
    label: 'Tier 1 from (placements)',
    unit: 'placements',
    value: 10,
    sortOrder: 30,
  },
  {
    key: 'dtfShirt.volume.tier1Percent',
    group: 'Volume · DTF Shirt',
    label: 'Tier 1 discount',
    unit: '%',
    value: 20,
    sortOrder: 31,
  },
  {
    key: 'dtfShirt.volume.tier2MinPlacements',
    group: 'Volume · DTF Shirt',
    label: 'Tier 2 from (placements)',
    unit: 'placements',
    value: 20,
    sortOrder: 32,
  },
  {
    key: 'dtfShirt.volume.tier2Percent',
    group: 'Volume · DTF Shirt',
    label: 'Tier 2 discount',
    unit: '%',
    value: 25,
    sortOrder: 33,
  },
  {
    key: 'dtfShirt.volume.tier3MinPlacements',
    group: 'Volume · DTF Shirt',
    label: 'Tier 3 from (placements)',
    unit: 'placements',
    value: 50,
    sortOrder: 34,
  },
  {
    key: 'dtfShirt.volume.tier3Percent',
    group: 'Volume · DTF Shirt',
    label: 'Tier 3 discount',
    unit: '%',
    value: 30,
    sortOrder: 35,
  },
  {
    key: 'sublimation.volume.qtyTier10',
    group: 'Volume · Sublimation',
    label: 'Mid tier from (pieces)',
    unit: 'pieces',
    value: 10,
    sortOrder: 40,
  },
  {
    key: 'sublimation.volume.qtyTier20',
    group: 'Volume · Sublimation',
    label: 'High tier from (pieces)',
    unit: 'pieces',
    value: 20,
    sortOrder: 41,
  },
  {
    key: 'sublimation.volume.qtyTier50',
    group: 'Volume · Sublimation',
    label: 'Discount tier from (pieces)',
    unit: 'pieces',
    value: 50,
    sortOrder: 42,
  },
  {
    key: 'sublimation.volume.discountAt50Percent',
    group: 'Volume · Sublimation',
    label: 'Discount at discount tier',
    unit: '%',
    value: 10,
    sortOrder: 43,
  },
  {
    key: 'sublimation.volume.benefitBelow10',
    group: 'Volume · Sublimation',
    label: 'Benefit below mid tier',
    unit: 'text',
    value: 0,
    textValue: 'No free product; no free banner',
    sortOrder: 44,
  },
  {
    key: 'sublimation.volume.benefitFrom10',
    group: 'Volume · Sublimation',
    label: 'Benefit from mid tier',
    unit: 'text',
    value: 0,
    textValue: 'FREE 1 T-Shirt or Sando',
    sortOrder: 45,
  },
  {
    key: 'sublimation.volume.benefitFrom20',
    group: 'Volume · Sublimation',
    label: 'Benefit from high tier',
    unit: 'text',
    value: 0,
    textValue:
      'FREE Banner — size subject to Three J Print Center confirmation; FREE 1 Polo or Shirt',
    sortOrder: 46,
  },
];

async function seedPricing() {
  const rows = [
    ...matrixToRows('TARPAULIN', TARPAULIN_RATES),
    ...matrixToRows('STICKERS', STICKER_RATES),
    ...flatMapToRows('DTF_SHIRT', DTF_SHIRT_RATES),
    ...dtfTransferTiersToRows(DTF_TRANSFER_TIERS),
    ...flatMapToRows('SUBLIMATION', SUBLIMATION_RATES),
    ...matrixToRows('SIGNAGE_FRAME', SIGNAGE_FRAME_RATES),
    ...matrixToRows('SIGNAGE_SINTRA', SINTRA_RATES),
  ];

  for (const row of rows) {
    await db.priceRate.upsert({
      where: {
        service_optionKey_variantKey: {
          service: row.service,
          optionKey: row.optionKey,
          variantKey: row.variantKey,
        },
      },
      update: {
        sortOrder: row.sortOrder,
      },
      create: row,
    });
  }

  for (const setting of PRICE_SETTINGS) {
    const { textValue, ...rest } = setting;
    await db.priceSetting.upsert({
      where: { key: setting.key },
      update: {
        group: setting.group,
        label: setting.label,
        unit: setting.unit,
        sortOrder: setting.sortOrder,
      },
      create: {
        ...rest,
        textValue: textValue ?? null,
      },
    });
  }

  console.log(
    `Pricing catalog ready (${rows.length} rates, ${PRICE_SETTINGS.length} settings).`
  );
}

async function main() {
  const hashedPassword = await hash(password, 12);

  const user = await db.user.upsert({
    where: { email },
    update: {
      name,
      hashedPassword,
      role: 'SUPERADMIN',
    },
    create: {
      email,
      name,
      hashedPassword,
      role: 'SUPERADMIN',
      emailVerified: new Date(),
    },
  });

  await seedPricing();

  console.log('Admin user ready for local login:');
  console.log(`  email:    ${user.email}`);
  console.log(`  password: ${password}`);
  console.log(`  role:     ${user.role}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
