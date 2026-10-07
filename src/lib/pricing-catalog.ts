import {
  DTF_SHIRT_PRICES,
  DTF_TRANSFER_TIERS,
  SIGNAGE_FRAME_RATES,
  SINTRA_RATES,
  STICKER_RATE_MATRIX,
  SUBLIMATION_RATES,
  TARPAULIN_RATE_MATRIX,
  type DtfTransferTier,
} from '~/app/service-guide/_lib/pricing';
import {
  DEFAULT_PRICING_SETTINGS,
  type PricingSettings,
} from '~/lib/pricing-settings';

export type RateMatrix = Record<string, Record<string, number>>;
export type FlatRateMap = Record<string, number>;

export type PricingServiceKey =
  | 'TARPAULIN'
  | 'STICKERS'
  | 'DTF_SHIRT'
  | 'DTF_TRANSFER'
  | 'SUBLIMATION'
  | 'SIGNAGE_FRAME'
  | 'SIGNAGE_SINTRA';

export type PricingCatalog = {
  tarpaulin: RateMatrix;
  stickers: RateMatrix;
  dtfShirt: FlatRateMap;
  dtfTransfer: DtfTransferTier[];
  sublimation: FlatRateMap;
  signageFrame: RateMatrix;
  signageSintra: RateMatrix;
  settings: PricingSettings;
};

export type PriceRateRow = {
  service: PricingServiceKey;
  optionKey: string;
  variantKey: string;
  rate: number;
  sortOrder?: number;
};

/** Flat price lists are stored with this single variant key. */
export const FLAT_RATE_VARIANT = 'Base';

export const DEFAULT_PRICING_CATALOG: PricingCatalog = {
  tarpaulin: TARPAULIN_RATE_MATRIX,
  stickers: STICKER_RATE_MATRIX,
  dtfShirt: DTF_SHIRT_PRICES,
  dtfTransfer: DTF_TRANSFER_TIERS,
  sublimation: SUBLIMATION_RATES,
  settings: DEFAULT_PRICING_SETTINGS,
  signageFrame: SIGNAGE_FRAME_RATES,
  signageSintra: SINTRA_RATES,
};

export function matrixToRows(service: PricingServiceKey, matrix: RateMatrix): PriceRateRow[] {
  const rows: PriceRateRow[] = [];
  let sortOrder = 0;

  for (const [optionKey, variants] of Object.entries(matrix)) {
    for (const [variantKey, rate] of Object.entries(variants)) {
      rows.push({ service, optionKey, variantKey, rate, sortOrder });
      sortOrder += 1;
    }
  }

  return rows;
}

export function flatMapToRows(service: PricingServiceKey, rates: FlatRateMap): PriceRateRow[] {
  return Object.entries(rates).map(([optionKey, rate], index) => ({
    service,
    optionKey,
    variantKey: FLAT_RATE_VARIANT,
    rate,
    sortOrder: index,
  }));
}

export function dtfTransferTiersToRows(tiers: DtfTransferTier[]): PriceRateRow[] {
  return tiers.map((tier, index) => ({
    service: 'DTF_TRANSFER' as const,
    optionKey: String(tier.minMeters),
    variantKey: tier.label,
    rate: tier.rate,
    sortOrder: index,
  }));
}

export function rowsToMatrix(
  rows: Array<{ optionKey: string; variantKey: string; rate: number; sortOrder?: number }>
): RateMatrix {
  const sorted = [...rows].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const matrix: RateMatrix = {};

  for (const row of sorted) {
    matrix[row.optionKey] ??= {};
    matrix[row.optionKey]![row.variantKey] = row.rate;
  }

  return matrix;
}

export function rowsToFlatMap(
  rows: Array<{ optionKey: string; rate: number; sortOrder?: number }>
): FlatRateMap {
  const sorted = [...rows].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const map: FlatRateMap = {};
  for (const row of sorted) {
    map[row.optionKey] = row.rate;
  }
  return map;
}

export function rowsToDtfTransferTiers(
  rows: Array<{ optionKey: string; variantKey: string; rate: number; sortOrder?: number }>
): DtfTransferTier[] {
  return [...rows]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((row) => ({
      minMeters: Number(row.optionKey),
      label: row.variantKey,
      rate: row.rate,
    }))
    .filter((tier) => Number.isFinite(tier.minMeters) && tier.minMeters > 0);
}

export function buildPricingCatalog(
  rows: Array<{
    service: PricingServiceKey;
    optionKey: string;
    variantKey: string;
    rate: number;
    sortOrder?: number;
  }>,
  settings: PricingSettings = DEFAULT_PRICING_SETTINGS
): PricingCatalog {
  const tarpaulinRows = rows.filter((row) => row.service === 'TARPAULIN');
  const stickerRows = rows.filter((row) => row.service === 'STICKERS');
  const dtfShirtRows = rows.filter((row) => row.service === 'DTF_SHIRT');
  const dtfTransferRows = rows.filter((row) => row.service === 'DTF_TRANSFER');
  const sublimationRows = rows.filter((row) => row.service === 'SUBLIMATION');
  const signageFrameRows = rows.filter((row) => row.service === 'SIGNAGE_FRAME');
  const signageSintraRows = rows.filter((row) => row.service === 'SIGNAGE_SINTRA');

  return {
    tarpaulin: tarpaulinRows.length
      ? rowsToMatrix(tarpaulinRows)
      : DEFAULT_PRICING_CATALOG.tarpaulin,
    stickers: stickerRows.length
      ? rowsToMatrix(stickerRows)
      : DEFAULT_PRICING_CATALOG.stickers,
    dtfShirt: dtfShirtRows.length
      ? rowsToFlatMap(dtfShirtRows)
      : DEFAULT_PRICING_CATALOG.dtfShirt,
    dtfTransfer: dtfTransferRows.length
      ? rowsToDtfTransferTiers(dtfTransferRows)
      : DEFAULT_PRICING_CATALOG.dtfTransfer,
    sublimation: sublimationRows.length
      ? rowsToFlatMap(sublimationRows)
      : DEFAULT_PRICING_CATALOG.sublimation,
    signageFrame: signageFrameRows.length
      ? rowsToMatrix(signageFrameRows)
      : DEFAULT_PRICING_CATALOG.signageFrame,
    signageSintra: signageSintraRows.length
      ? rowsToMatrix(signageSintraRows)
      : DEFAULT_PRICING_CATALOG.signageSintra,
    settings,
  };
}

export function defaultPriceRateSeedRows(): PriceRateRow[] {
  return [
    ...matrixToRows('TARPAULIN', TARPAULIN_RATE_MATRIX),
    ...matrixToRows('STICKERS', STICKER_RATE_MATRIX),
    ...flatMapToRows('DTF_SHIRT', DTF_SHIRT_PRICES),
    ...dtfTransferTiersToRows(DTF_TRANSFER_TIERS),
    ...flatMapToRows('SUBLIMATION', SUBLIMATION_RATES),
    ...matrixToRows('SIGNAGE_FRAME', SIGNAGE_FRAME_RATES),
    ...matrixToRows('SIGNAGE_SINTRA', SINTRA_RATES),
  ];
}
