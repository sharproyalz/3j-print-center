export type PricingSettings = {
  dtfShoulderNameFee: number;
  dtfTransferSpecialMinMeters: number;
  sublimationFabric200GsmAddon: number;
  sublimationLayoutFeePerDesign: number;
  sublimationOversizedAddon: number;
  tarpaulinMinimumPrintingCharge: number;
  tarpaulinLayoutFeePerLayout: number;
  stickersMinimumJobCharge: number;
  signageSintraLaminationPerSqIn: number;
  signageSintraStandPerSqIn: number;
  // Volume · Tarpaulin
  tarpaulinVolumeTier1MinSqFt: number;
  tarpaulinVolumeTier1Percent: number;
  tarpaulinVolumeTier2MinSqFt: number;
  tarpaulinVolumeTier2Percent: number;
  tarpaulinVolumeTier3MinSqFt: number;
  tarpaulinVolumeTier3Percent: number;
  // Volume · DTF Shirt
  dtfShirtVolumeTier1MinPlacements: number;
  dtfShirtVolumeTier1Percent: number;
  dtfShirtVolumeTier2MinPlacements: number;
  dtfShirtVolumeTier2Percent: number;
  dtfShirtVolumeTier3MinPlacements: number;
  dtfShirtVolumeTier3Percent: number;
  // Volume · Sublimation
  sublimationQtyTier10: number;
  sublimationQtyTier20: number;
  sublimationQtyTier50: number;
  sublimationDiscountAt50Percent: number;
  sublimationBenefitBelow10: string;
  sublimationBenefitFrom10: string;
  sublimationBenefitFrom20: string;
};

export type PricingSettingTab = 'addons' | 'volume';
export type PricingSettingKind = 'number' | 'text';
export type PricingSettingClusterRole = 'from' | 'discount' | 'benefit';

export type PricingSettingDef = {
  key: string;
  group: string;
  label: string;
  unit: string;
  settingKey: keyof PricingSettings;
  tab: PricingSettingTab;
  kind: PricingSettingKind;
  defaultValue: number;
  defaultText?: string;
  sortOrder: number;
  /** Groups related volume fields onto one admin row (e.g. Tier 1 from + discount). */
  cluster?: string;
  clusterRole?: PricingSettingClusterRole;
};

export const PRICING_SETTING_DEFS: PricingSettingDef[] = [
  {
    key: 'dtf.shoulderNameFee',
    group: 'DTF Shirt',
    label: 'Shoulder name add-on',
    unit: '₱ / piece',
    settingKey: 'dtfShoulderNameFee',
    tab: 'addons',
    kind: 'number',
    defaultValue: 25,
    sortOrder: 1,
  },
  {
    key: 'dtf.transferSpecialMinMeters',
    group: 'DTF Transfer',
    label: 'Special volume pricing from (meters)',
    unit: 'meters',
    settingKey: 'dtfTransferSpecialMinMeters',
    tab: 'addons',
    kind: 'number',
    defaultValue: 1000,
    sortOrder: 2,
  },
  {
    key: 'sublimation.fabric200GsmAddon',
    group: 'Sublimation',
    label: '200 GSM fabric add-on',
    unit: '₱ / piece',
    settingKey: 'sublimationFabric200GsmAddon',
    tab: 'addons',
    kind: 'number',
    defaultValue: 20,
    sortOrder: 3,
  },
  {
    key: 'sublimation.layoutFeePerDesign',
    group: 'Sublimation',
    label: 'Layout fee per unique design',
    unit: '₱ / design',
    settingKey: 'sublimationLayoutFeePerDesign',
    tab: 'addons',
    kind: 'number',
    defaultValue: 500,
    sortOrder: 4,
  },
  {
    key: 'sublimation.oversizedAddon',
    group: 'Sublimation',
    label: '4XL–6XL add-on',
    unit: '₱ / piece',
    settingKey: 'sublimationOversizedAddon',
    tab: 'addons',
    kind: 'number',
    defaultValue: 100,
    sortOrder: 5,
  },
  {
    key: 'tarpaulin.minimumPrintingCharge',
    group: 'Tarpaulin',
    label: 'Minimum printing charge',
    unit: '₱ / job',
    settingKey: 'tarpaulinMinimumPrintingCharge',
    tab: 'addons',
    kind: 'number',
    defaultValue: 150,
    sortOrder: 6,
  },
  {
    key: 'tarpaulin.layoutFeePerLayout',
    group: 'Tarpaulin',
    label: 'Layout fee per unique layout',
    unit: '₱ / layout',
    settingKey: 'tarpaulinLayoutFeePerLayout',
    tab: 'addons',
    kind: 'number',
    defaultValue: 150,
    sortOrder: 7,
  },
  {
    key: 'stickers.minimumJobCharge',
    group: 'Stickers',
    label: 'Minimum job charge',
    unit: '₱ / job',
    settingKey: 'stickersMinimumJobCharge',
    tab: 'addons',
    kind: 'number',
    defaultValue: 300,
    sortOrder: 8,
  },
  {
    key: 'signage.sintraLaminationPerSqIn',
    group: 'Sintra',
    label: 'Lamination add-on',
    unit: '₱ / sq.in',
    settingKey: 'signageSintraLaminationPerSqIn',
    tab: 'addons',
    kind: 'number',
    defaultValue: 0.15,
    sortOrder: 9,
  },
  {
    key: 'signage.sintraStandPerSqIn',
    group: 'Sintra',
    label: 'Stand / standee add-on',
    unit: '₱ / sq.in',
    settingKey: 'signageSintraStandPerSqIn',
    tab: 'addons',
    kind: 'number',
    defaultValue: 0.25,
    sortOrder: 10,
  },
  // Volume · Tarpaulin
  {
    key: 'tarpaulin.volume.tier1MinSqFt',
    group: 'Volume · Tarpaulin',
    label: 'Tier 1 from (sq.ft)',
    unit: 'sq.ft',
    settingKey: 'tarpaulinVolumeTier1MinSqFt',
    tab: 'volume',
    kind: 'number',
    defaultValue: 50,
    sortOrder: 20,
    cluster: 'Tier 1',
    clusterRole: 'from',
  },
  {
    key: 'tarpaulin.volume.tier1Percent',
    group: 'Volume · Tarpaulin',
    label: 'Tier 1 discount',
    unit: '%',
    settingKey: 'tarpaulinVolumeTier1Percent',
    tab: 'volume',
    kind: 'number',
    defaultValue: 5,
    sortOrder: 21,
    cluster: 'Tier 1',
    clusterRole: 'discount',
  },
  {
    key: 'tarpaulin.volume.tier2MinSqFt',
    group: 'Volume · Tarpaulin',
    label: 'Tier 2 from (sq.ft)',
    unit: 'sq.ft',
    settingKey: 'tarpaulinVolumeTier2MinSqFt',
    tab: 'volume',
    kind: 'number',
    defaultValue: 100,
    sortOrder: 22,
    cluster: 'Tier 2',
    clusterRole: 'from',
  },
  {
    key: 'tarpaulin.volume.tier2Percent',
    group: 'Volume · Tarpaulin',
    label: 'Tier 2 discount',
    unit: '%',
    settingKey: 'tarpaulinVolumeTier2Percent',
    tab: 'volume',
    kind: 'number',
    defaultValue: 10,
    sortOrder: 23,
    cluster: 'Tier 2',
    clusterRole: 'discount',
  },
  {
    key: 'tarpaulin.volume.tier3MinSqFt',
    group: 'Volume · Tarpaulin',
    label: 'Tier 3 from (sq.ft)',
    unit: 'sq.ft',
    settingKey: 'tarpaulinVolumeTier3MinSqFt',
    tab: 'volume',
    kind: 'number',
    defaultValue: 200,
    sortOrder: 24,
    cluster: 'Tier 3',
    clusterRole: 'from',
  },
  {
    key: 'tarpaulin.volume.tier3Percent',
    group: 'Volume · Tarpaulin',
    label: 'Tier 3 discount',
    unit: '%',
    settingKey: 'tarpaulinVolumeTier3Percent',
    tab: 'volume',
    kind: 'number',
    defaultValue: 15,
    sortOrder: 25,
    cluster: 'Tier 3',
    clusterRole: 'discount',
  },
  // Volume · DTF Shirt
  {
    key: 'dtfShirt.volume.tier1MinPlacements',
    group: 'Volume · DTF Shirt',
    label: 'Tier 1 from (placements)',
    unit: 'placements',
    settingKey: 'dtfShirtVolumeTier1MinPlacements',
    tab: 'volume',
    kind: 'number',
    defaultValue: 10,
    sortOrder: 30,
    cluster: 'Tier 1',
    clusterRole: 'from',
  },
  {
    key: 'dtfShirt.volume.tier1Percent',
    group: 'Volume · DTF Shirt',
    label: 'Tier 1 discount',
    unit: '%',
    settingKey: 'dtfShirtVolumeTier1Percent',
    tab: 'volume',
    kind: 'number',
    defaultValue: 20,
    sortOrder: 31,
    cluster: 'Tier 1',
    clusterRole: 'discount',
  },
  {
    key: 'dtfShirt.volume.tier2MinPlacements',
    group: 'Volume · DTF Shirt',
    label: 'Tier 2 from (placements)',
    unit: 'placements',
    settingKey: 'dtfShirtVolumeTier2MinPlacements',
    tab: 'volume',
    kind: 'number',
    defaultValue: 20,
    sortOrder: 32,
    cluster: 'Tier 2',
    clusterRole: 'from',
  },
  {
    key: 'dtfShirt.volume.tier2Percent',
    group: 'Volume · DTF Shirt',
    label: 'Tier 2 discount',
    unit: '%',
    settingKey: 'dtfShirtVolumeTier2Percent',
    tab: 'volume',
    kind: 'number',
    defaultValue: 25,
    sortOrder: 33,
    cluster: 'Tier 2',
    clusterRole: 'discount',
  },
  {
    key: 'dtfShirt.volume.tier3MinPlacements',
    group: 'Volume · DTF Shirt',
    label: 'Tier 3 from (placements)',
    unit: 'placements',
    settingKey: 'dtfShirtVolumeTier3MinPlacements',
    tab: 'volume',
    kind: 'number',
    defaultValue: 50,
    sortOrder: 34,
    cluster: 'Tier 3',
    clusterRole: 'from',
  },
  {
    key: 'dtfShirt.volume.tier3Percent',
    group: 'Volume · DTF Shirt',
    label: 'Tier 3 discount',
    unit: '%',
    settingKey: 'dtfShirtVolumeTier3Percent',
    tab: 'volume',
    kind: 'number',
    defaultValue: 30,
    sortOrder: 35,
    cluster: 'Tier 3',
    clusterRole: 'discount',
  },
  // Volume · Sublimation
  {
    key: 'sublimation.volume.benefitBelow10',
    group: 'Volume · Sublimation',
    label: 'Benefit below mid tier',
    unit: 'text',
    settingKey: 'sublimationBenefitBelow10',
    tab: 'volume',
    kind: 'text',
    defaultValue: 0,
    defaultText: 'No free product; no free banner',
    sortOrder: 40,
    cluster: 'Below mid tier',
    clusterRole: 'benefit',
  },
  {
    key: 'sublimation.volume.qtyTier10',
    group: 'Volume · Sublimation',
    label: 'Mid tier from (pieces)',
    unit: 'pieces',
    settingKey: 'sublimationQtyTier10',
    tab: 'volume',
    kind: 'number',
    defaultValue: 10,
    sortOrder: 41,
    cluster: 'Mid tier',
    clusterRole: 'from',
  },
  {
    key: 'sublimation.volume.benefitFrom10',
    group: 'Volume · Sublimation',
    label: 'Benefit from mid tier',
    unit: 'text',
    settingKey: 'sublimationBenefitFrom10',
    tab: 'volume',
    kind: 'text',
    defaultValue: 0,
    defaultText: 'FREE 1 T-Shirt or Sando',
    sortOrder: 42,
    cluster: 'Mid tier',
    clusterRole: 'benefit',
  },
  {
    key: 'sublimation.volume.qtyTier20',
    group: 'Volume · Sublimation',
    label: 'High tier from (pieces)',
    unit: 'pieces',
    settingKey: 'sublimationQtyTier20',
    tab: 'volume',
    kind: 'number',
    defaultValue: 20,
    sortOrder: 43,
    cluster: 'High tier',
    clusterRole: 'from',
  },
  {
    key: 'sublimation.volume.benefitFrom20',
    group: 'Volume · Sublimation',
    label: 'Benefit from high tier',
    unit: 'text',
    settingKey: 'sublimationBenefitFrom20',
    tab: 'volume',
    kind: 'text',
    defaultValue: 0,
    defaultText:
      'FREE Banner — size subject to Three J Print Center confirmation; FREE 1 Polo or Shirt',
    sortOrder: 44,
    cluster: 'High tier',
    clusterRole: 'benefit',
  },
  {
    key: 'sublimation.volume.qtyTier50',
    group: 'Volume · Sublimation',
    label: 'Discount tier from (pieces)',
    unit: 'pieces',
    settingKey: 'sublimationQtyTier50',
    tab: 'volume',
    kind: 'number',
    defaultValue: 50,
    sortOrder: 45,
    cluster: 'Discount tier',
    clusterRole: 'from',
  },
  {
    key: 'sublimation.volume.discountAt50Percent',
    group: 'Volume · Sublimation',
    label: 'Discount at discount tier',
    unit: '%',
    settingKey: 'sublimationDiscountAt50Percent',
    tab: 'volume',
    kind: 'number',
    defaultValue: 10,
    sortOrder: 46,
    cluster: 'Discount tier',
    clusterRole: 'discount',
  },
];

export const PRICING_SETTING_DEF_BY_KEY = new Map(
  PRICING_SETTING_DEFS.map((def) => [def.key, def])
);

export const DEFAULT_PRICING_SETTINGS: PricingSettings = PRICING_SETTING_DEFS.reduce(
  (acc, def) => {
    if (def.kind === 'text') {
      (acc as Record<string, string | number>)[def.settingKey] = def.defaultText ?? '';
    } else {
      (acc as Record<string, string | number>)[def.settingKey] = def.defaultValue;
    }
    return acc;
  },
  {} as PricingSettings
);

export function buildPricingSettings(
  rows: Array<{ key: string; value: number; textValue?: string | null }>
): PricingSettings {
  const byKey = new Map(rows.map((row) => [row.key, row]));
  const settings = { ...DEFAULT_PRICING_SETTINGS };

  for (const def of PRICING_SETTING_DEFS) {
    const row = byKey.get(def.key);
    if (!row) continue;

    if (def.kind === 'text') {
      if (typeof row.textValue === 'string' && row.textValue.trim()) {
        (settings as Record<string, string | number>)[def.settingKey] = row.textValue;
      }
      continue;
    }

    if (typeof row.value === 'number' && Number.isFinite(row.value)) {
      (settings as Record<string, string | number>)[def.settingKey] = row.value;
    }
  }

  return settings;
}

export function volumeDiscountPercent(
  amount: number,
  tiers: Array<{ min: number; percent: number }>
): number {
  const sorted = [...tiers]
    .filter((tier) => Number.isFinite(tier.min) && tier.min > 0)
    .sort((a, b) => b.min - a.min);
  const match = sorted.find((tier) => amount >= tier.min);
  if (!match || !Number.isFinite(match.percent) || match.percent < 0) return 0;
  return match.percent;
}
