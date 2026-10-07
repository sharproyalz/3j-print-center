import { volumeDiscountPercent } from '~/lib/pricing-settings';

export const SERVICES = [
  { id: 'DTF Printing', label: 'DTF SERVICES', number: '01' },
  { id: 'Full Sublimation', label: 'Full Sublimation', number: '02' },
  { id: 'Tarpaulin', label: 'Tarpaulin', number: '03' },
  { id: 'Stickers', label: 'Stickers', number: '04' },
  { id: 'Signage', label: 'Signage', number: '05' },
] as const;

export type ServiceId = (typeof SERVICES)[number]['id'];

export type FlatRateMap = Record<string, number>;
export type RateMatrix = Record<string, Record<string, number>>;

export const DTF_SHIRT_PRICES: Record<string, number> = {
  A6: 50,
  A5: 75,
  A4: 100,
  A3: 180,
};

export type DtfTransferTier = {
  minMeters: number;
  label: string;
  rate: number;
};

/** Meters at or above this need manual / special volume pricing. */
/** @deprecated Prefer pricing settings `dtfTransferSpecialMinMeters`. */
export const DTF_TRANSFER_SPECIAL_MIN = 1000;

export const DTF_TRANSFER_TIERS: DtfTransferTier[] = [
  { minMeters: 1, label: '1–9 meters', rate: 180 },
  { minMeters: 10, label: '10–49 meters', rate: 150 },
  { minMeters: 50, label: '50–99 meters', rate: 130 },
  { minMeters: 100, label: '100–499 meters', rate: 120 },
  { minMeters: 500, label: '500–999 meters', rate: 110 },
];

export function dtfTransferRatePerMeter(
  meters: number,
  tiers: DtfTransferTier[] = DTF_TRANSFER_TIERS,
  specialMinMeters = DTF_TRANSFER_SPECIAL_MIN
) {
  if (meters >= specialMinMeters) return null; // special volume pricing
  const sorted = [...tiers].sort((a, b) => b.minMeters - a.minMeters);
  const match = sorted.find((tier) => meters >= tier.minMeters);
  return match?.rate ?? null;
}

export const SUBLIMATION_RATES: Record<string, number> = {
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

export const TARPAULIN_RATE_MATRIX: Record<string, Record<string, number>> = {
  '10 oz Tarpaulin': { 'Eco-Solvent': 20 },
  '12 oz Tarpaulin': { 'Eco-Solvent': 25 },
  '13 oz Tarpaulin': { 'Eco-Solvent': 27, Solvent: 30, 'UV Print': 80 },
  '18 oz Blackout Tarp': { 'Eco-Solvent': 50, Solvent: 60, 'UV Print': 125 },
  'Printed Panaflex 18 oz': { 'Eco-Solvent': 90, Solvent: 100, 'UV Print': 150 },
};

export const STICKER_RATE_MATRIX: Record<string, Record<string, number>> = {
  'White Vinyl Sticker': { 'Non-Laminated': 0.8, Laminated: 1.0 },
  'Clear / Transparent Sticker': { 'Non-Laminated': 0.8, Laminated: 1.0 },
  'Printed 3M Sticker — Branded': { 'Non-Laminated': 4.5, Laminated: 5.5 },
};

/** Flattened frame/sign rates for admin editing (₱ / sq.ft). */
export const SIGNAGE_FRAME_RATES: RateMatrix = {
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

export const SINTRA_RATES: RateMatrix = {
  '3mm': { 'Front Only': 1.1, 'Back to Back': 1.85 },
  '5mm': { 'Front Only': 1.35, 'Back to Back': 2.35 },
};

export function getSignageFrameRate(
  rates: RateMatrix,
  type: string,
  faceMaterial: string,
  printingMethod: string,
  blackoutMethod: string
) {
  const group = rates[type];
  if (!group) return undefined;

  if (type === 'Blackout Tarp Signage — With Frame') {
    return group[blackoutMethod];
  }

  if (faceMaterial === 'Cut-out Sticker — Laminated') {
    return group['Cut-out Sticker — Laminated'];
  }

  if (faceMaterial === 'Printed Panaflex') {
    return group[`Printed Panaflex · ${printingMethod}`];
  }

  return undefined;
}

export function formatPeso(amount: number, fractionDigits = 0) {
  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function toInches(value: number, unit: string) {
  if (unit === 'Inches') return value;
  if (unit === 'Feet') return value * 12;
  if (unit === 'Centimeters') return value / 2.54;
  if (unit === 'Meters') return value * 39.3701;
  return value;
}

export function toFeet(value: number, unit: string) {
  if (unit === 'Feet') return value;
  if (unit === 'Inches') return value / 12;
  if (unit === 'Centimeters') return value / 30.48;
  if (unit === 'Meters') return value * 3.28084;
  return value;
}

export type DtfShirtEstimate = {
  valid: boolean;
  message?: string;
  totalPlacements: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  shoulderAmount: number;
  finalTotal: number;
  status: string;
  summary: string;
};

export function calculateDtfShirt(input: {
  printSide: string;
  frontSize: string;
  backSize: string;
  quantity: number;
  shoulderName: boolean;
  rates?: FlatRateMap;
  shoulderNameFee?: number;
  volumeTier1MinPlacements?: number;
  volumeTier1Percent?: number;
  volumeTier2MinPlacements?: number;
  volumeTier2Percent?: number;
  volumeTier3MinPlacements?: number;
  volumeTier3Percent?: number;
}): DtfShirtEstimate {
  const {
    printSide,
    frontSize,
    backSize,
    quantity,
    shoulderName,
    rates = DTF_SHIRT_PRICES,
    shoulderNameFee = 25,
    volumeTier1MinPlacements = 10,
    volumeTier1Percent = 20,
    volumeTier2MinPlacements = 20,
    volumeTier2Percent = 25,
    volumeTier3MinPlacements = 50,
    volumeTier3Percent = 30,
  } = input;
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return {
      valid: false,
      message: 'Enter a valid shirt quantity.',
      totalPlacements: 0,
      subtotal: 0,
      discountPercentage: 0,
      discountAmount: 0,
      shoulderAmount: 0,
      finalTotal: 0,
      status: 'Manual Quotation Required',
      summary: 'Complete DTF shirt details for an estimate.',
    };
  }

  const sizes =
    printSide === 'Both'
      ? [frontSize, backSize]
      : [printSide === 'Front' ? frontSize : backSize];

  if (sizes.includes('Custom Size') || sizes.some((size) => !rates[size])) {
    return {
      valid: false,
      message: 'Custom size requires manual quotation.',
      totalPlacements: sizes.length * quantity,
      subtotal: 0,
      discountPercentage: 0,
      discountAmount: 0,
      shoulderAmount: shoulderName ? shoulderNameFee * quantity : 0,
      finalTotal: 0,
      status: 'Manual Quotation Required',
      summary: `Shirt Quantity: ${quantity} · Front Print Size: ${frontSize || '—'} · Back Print Size: ${backSize || '—'} · Automatic estimate unavailable; manual quotation required for Custom Size.`,
    };
  }

  const totalPlacements = sizes.length * quantity;
  const subtotal = sizes.reduce((sum, size) => sum + rates[size]!, 0) * quantity;
  const discountPercentage = volumeDiscountPercent(totalPlacements, [
    { min: volumeTier1MinPlacements, percent: volumeTier1Percent },
    { min: volumeTier2MinPlacements, percent: volumeTier2Percent },
    { min: volumeTier3MinPlacements, percent: volumeTier3Percent },
  ]);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const shoulderAmount = shoulderName ? shoulderNameFee * quantity : 0;
  const finalTotal = subtotal - discountAmount + shoulderAmount;

  return {
    valid: true,
    totalPlacements,
    subtotal,
    discountPercentage,
    discountAmount,
    shoulderAmount,
    finalTotal,
    status: 'automatic estimate',
    summary: `Shirt Quantity: ${quantity} · Front Print Size: ${frontSize || '—'} · Back Print Size: ${backSize || '—'} · Total Standard Print Placements: ${totalPlacements} · Standard Print Subtotal: ${formatPeso(subtotal)} · Volume Discount Percentage: ${discountPercentage}% · Discount Amount: ${formatPeso(discountAmount)} · Shoulder Name Add-on Amount: ${formatPeso(shoulderAmount)} · Final Estimated Total: ${formatPeso(finalTotal)}`,
  };
}

export function calculateDtfTransfer(
  meters: number,
  tiers: DtfTransferTier[] = DTF_TRANSFER_TIERS,
  specialMinMeters = DTF_TRANSFER_SPECIAL_MIN
) {
  if (!Number.isInteger(meters) || meters <= 0) {
    return {
      valid: false as const,
      summary: 'Enter meters for an automatic estimate.',
      rate: 0,
      total: 0,
      special: false,
    };
  }
  const rate = dtfTransferRatePerMeter(meters, tiers, specialMinMeters);
  if (rate == null) {
    return {
      valid: false as const,
      summary: 'Please contact Three J Print Center for special volume pricing.',
      rate: 0,
      total: 0,
      special: true,
    };
  }
  return {
    valid: true as const,
    summary: `Number of Meters: ${meters} · Rate Per Meter: PHP ${rate} · Estimated Total: PHP ${meters * rate}`,
    rate,
    total: meters * rate,
    special: false,
  };
}

export function calculateSublimation(input: {
  productType: string;
  quantity: number;
  oversized: number;
  fabricWeight: string;
  designNeeded: string;
  sameDesign: string;
  uniqueLayouts: number;
  rates?: FlatRateMap;
  fabric200GsmAddon?: number;
  layoutFeePerDesign?: number;
  oversizedAddon?: number;
  qtyTier10?: number;
  qtyTier20?: number;
  qtyTier50?: number;
  discountAt50Percent?: number;
  benefitBelow10?: string;
  benefitFrom10?: string;
  benefitFrom20?: string;
}) {
  const {
    productType,
    quantity,
    oversized,
    fabricWeight,
    designNeeded,
    sameDesign,
    uniqueLayouts,
    rates = SUBLIMATION_RATES,
    fabric200GsmAddon = 20,
    layoutFeePerDesign = 500,
    oversizedAddon = 100,
    qtyTier10 = 10,
    qtyTier20 = 20,
    qtyTier50 = 50,
    discountAt50Percent = 10,
    benefitBelow10 = 'No free product; no free banner',
    benefitFrom10 = 'FREE 1 T-Shirt or Sando',
    benefitFrom20 =
      'FREE Banner — size subject to Three J Print Center confirmation; FREE 1 Polo or Shirt',
  } = input;

  if (!Number.isInteger(quantity) || quantity < 6) {
    return {
      valid: false as const,
      message: 'Minimum order for Full Sublimation is 6 pieces.',
      summary: 'Complete Full Sublimation details for an estimate.',
    };
  }
  if (!Number.isInteger(oversized) || oversized < 0 || oversized > quantity) {
    return {
      valid: false as const,
      message: 'Estimated 4XL–6XL quantity cannot exceed the total order quantity.',
      summary: 'Complete Full Sublimation details for an estimate.',
    };
  }

  const unitPrice = rates[productType];
  if (!unitPrice) {
    return {
      valid: false as const,
      message: 'Select a product type.',
      summary: 'Complete Full Sublimation details for an estimate.',
    };
  }

  const layoutFeeApplies = designNeeded === 'Yes' && quantity < qtyTier10;

  if (
    layoutFeeApplies &&
    sameDesign === 'No' &&
    (!Number.isInteger(uniqueLayouts) || uniqueLayouts < 1 || uniqueLayouts > quantity)
  ) {
    return {
      valid: false as const,
      message: 'Number of unique designs cannot exceed the total order quantity.',
      summary: 'Complete Full Sublimation details for an estimate.',
    };
  }

  const base = unitPrice * quantity;
  const fabricAddon = fabricWeight === '200 GSM' ? fabric200GsmAddon * quantity : 0;
  const discountPercent = quantity >= qtyTier50 ? discountAt50Percent : 0;
  const discountAmount = (base * discountPercent) / 100;
  const unique = layoutFeeApplies
    ? sameDesign === 'Yes'
      ? 1
      : Number(uniqueLayouts) || 0
    : 0;
  const layoutFee = unique * layoutFeePerDesign;
  const oversizedAddonAmount = oversized * oversizedAddon;
  const tier =
    quantity >= qtyTier50
      ? `${qtyTier50}+ pieces`
      : quantity >= qtyTier20
        ? `${qtyTier20}–${qtyTier50 - 1} pieces`
        : quantity >= qtyTier10
          ? `${qtyTier10}–${qtyTier20 - 1} pieces`
          : `6–${qtyTier10 - 1} pieces`;
  const benefits =
    quantity >= qtyTier20
      ? benefitFrom20
      : quantity >= qtyTier10
        ? benefitFrom10
        : benefitBelow10;
  const total = base - discountAmount + fabricAddon + oversizedAddonAmount + layoutFee;

  return {
    valid: true as const,
    unitPrice,
    base,
    fabricAddon,
    oversized,
    oversizedAddon: oversizedAddonAmount,
    discountPercent,
    discountAmount,
    unique,
    layoutFee,
    tier,
    benefits,
    total,
    summary: `Product Type: ${productType} · Quantity: ${quantity} · Base Price Per Piece/Set: ${formatPeso(unitPrice)} · Base Product Subtotal: ${formatPeso(base)} · Fabric Add-on: ${formatPeso(fabricAddon)} · 4XL–6XL Quantity: ${oversized} · Oversize Add-on: ${formatPeso(oversizedAddonAmount)} · Layout Fee: ${formatPeso(layoutFee)} · Quantity Tier: ${tier} · Discount: ${discountPercent}% (${formatPeso(discountAmount)}) · Benefits: ${benefits} · Final Estimated Total: ${formatPeso(total)}`,
  };
}

export function calculateTarpaulin(input: {
  width: number;
  height: number;
  quantity: number;
  media: string;
  method: string;
  layoutNeeded: string;
  sameDesign: string;
  uniqueLayouts: number;
  eyeletOption: string;
  edgeFinishing: string;
  rates?: RateMatrix;
  minimumPrintingCharge?: number;
  layoutFeePerLayout?: number;
  volumeTier1MinSqFt?: number;
  volumeTier1Percent?: number;
  volumeTier2MinSqFt?: number;
  volumeTier2Percent?: number;
  volumeTier3MinSqFt?: number;
  volumeTier3Percent?: number;
}) {
  const {
    width,
    height,
    quantity,
    media,
    method,
    layoutNeeded,
    sameDesign,
    uniqueLayouts,
    eyeletOption,
    edgeFinishing,
    rates = TARPAULIN_RATE_MATRIX,
    minimumPrintingCharge = 150,
    layoutFeePerLayout = 150,
    volumeTier1MinSqFt = 50,
    volumeTier1Percent = 5,
    volumeTier2MinSqFt = 100,
    volumeTier2Percent = 10,
    volumeTier3MinSqFt = 200,
    volumeTier3Percent = 15,
  } = input;

  const rate = rates[media]?.[method];
  if (
    !rate ||
    !(width > 0) ||
    !(height > 0) ||
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    return {
      valid: false as const,
      summary:
        'Width (ft): — · Height (ft): — · Quantity: — · Square Feet Per Piece: — · Total Square Feet: — · Base Printing Subtotal (minimum-adjusted, pre-discount): — · Volume Discount: 0% · Discount Amount: — · Same Design for All Pieces: — · Number of Unique Layouts: — · Total Layout Fee: — · Eyelet Option: — · Edge Finishing: — · Final Estimated Total: —',
    };
  }

  if (
    layoutNeeded === 'Yes' &&
    sameDesign === 'No' &&
    (!Number.isInteger(uniqueLayouts) || uniqueLayouts < 1 || uniqueLayouts > quantity)
  ) {
    return {
      valid: false as const,
      summary:
        'Width (ft): — · Height (ft): — · Quantity: — · Square Feet Per Piece: — · Total Square Feet: — · Base Printing Subtotal (minimum-adjusted, pre-discount): — · Volume Discount: 0% · Discount Amount: — · Same Design for All Pieces: — · Number of Unique Layouts: — · Total Layout Fee: — · Eyelet Option: — · Edge Finishing: — · Final Estimated Total: —',
    };
  }

  const squareFeetPerPiece = width * height;
  const totalSquareFeet = squareFeetPerPiece * quantity;
  const rawBasePrintingSubtotal = totalSquareFeet * rate;
  const printingAmount = Math.max(rawBasePrintingSubtotal, minimumPrintingCharge);
  const volumeDiscountPercentage = volumeDiscountPercent(totalSquareFeet, [
    { min: volumeTier1MinSqFt, percent: volumeTier1Percent },
    { min: volumeTier2MinSqFt, percent: volumeTier2Percent },
    { min: volumeTier3MinSqFt, percent: volumeTier3Percent },
  ]);
  const discountAmount = (printingAmount * volumeDiscountPercentage) / 100;
  const unique =
    layoutNeeded === 'Yes' ? (sameDesign === 'Yes' ? 1 : Number(uniqueLayouts) || 0) : 0;
  const layoutFee = unique * layoutFeePerLayout;
  const finalTotal = printingAmount - discountAmount + layoutFee;

  return {
    valid: true as const,
    printingRate: rate,
    minimumPrintingCharge,
    squareFeetPerPiece,
    totalSquareFeet,
    rawBasePrintingSubtotal,
    printingAmount,
    volumeDiscountPercentage,
    discountAmount,
    uniqueLayouts: unique,
    layoutFee,
    eyeletFee: 0,
    edgeFinishingFee: 0,
    finalTotal,
    summary: `Width (ft): ${width} · Height (ft): ${height} · Quantity: ${quantity} · Square Feet Per Piece: ${squareFeetPerPiece} · Total Square Feet: ${totalSquareFeet} · Base Printing Subtotal (minimum-adjusted, pre-discount): ${formatPeso(printingAmount)} · Volume Discount: ${volumeDiscountPercentage}% · Discount Amount: ${formatPeso(discountAmount)} · Same Design for All Pieces: ${sameDesign || '—'} · Number of Unique Layouts: ${unique || '—'} · Total Layout Fee: ${formatPeso(layoutFee)} · Eyelet Option: ${eyeletOption || '—'} (₱0) · Edge Finishing: ${edgeFinishing || '—'} (₱0) · Final Estimated Total: ${formatPeso(finalTotal)}`,
  };
}

export function calculateSticker(input: {
  type: string;
  lamination: string;
  unit: string;
  width: number;
  height: number;
  quantity: number;
  rates?: RateMatrix;
  minimumJobCharge?: number;
}) {
  const {
    type,
    lamination,
    unit,
    width,
    height,
    quantity,
    rates = STICKER_RATE_MATRIX,
    minimumJobCharge = 300,
  } = input;
  const selectedRate = rates[type]?.[lamination];
  const valid =
    selectedRate !== undefined &&
    width > 0 &&
    height > 0 &&
    Number.isInteger(quantity) &&
    quantity > 0 &&
    ['Inches', 'Centimeters', 'Feet'].includes(unit);

  if (!valid || selectedRate == null) {
    return {
      valid: false as const,
      summary: 'Complete Sticker details for an estimate.',
    };
  }

  const factor = unit === 'Centimeters' ? 1 / 2.54 : unit === 'Feet' ? 12 : 1;
  const squareInchesPerPiece = width * factor * height * factor;
  const totalSquareInches = squareInchesPerPiece * quantity;
  const rawStickerPrice = totalSquareInches * selectedRate;
  const finalStickerPrice = Math.max(rawStickerPrice, minimumJobCharge);
  const minimumApplied = rawStickerPrice < minimumJobCharge;

  return {
    valid: true as const,
    type,
    lamination,
    unit,
    width,
    height,
    quantity,
    selectedRate,
    squareInchesPerPiece,
    totalSquareInches,
    rawStickerPrice,
    minimumApplied,
    finalStickerPrice,
    summary: `Sticker Type: ${type} · Lamination: ${lamination} · Rate per sq.in.: ${formatPeso(selectedRate, 2)} · Measurement Unit: ${unit} · Width: ${width} · Height: ${height} · Quantity: ${quantity} · Square Inches Per Piece: ${squareInchesPerPiece.toFixed(2)} · Total Square Inches: ${totalSquareInches.toFixed(2)} · Raw Sticker Price: ${formatPeso(rawStickerPrice, 2)} · Minimum Charge Applied: ${minimumApplied ? 'Yes' : 'No'}${minimumApplied ? ` · Minimum Job Charge: ${formatPeso(minimumJobCharge)}` : ''} · Final Estimated Price: ${formatPeso(finalStickerPrice, 2)}`,
  };
}

export function calculateSignage(input: {
  type: string;
  unit: string;
  width: number;
  height: number;
  quantity: number;
  faceMaterial: string;
  printingMethod: string;
  blackoutMethod: string;
  thickness: string;
  printSide: string;
  lamination: string;
  cutStyle: string;
  display: string;
  frameRates?: RateMatrix;
  sintraRates?: RateMatrix;
  sintraLaminationPerSqIn?: number;
  sintraStandPerSqIn?: number;
}) {
  const {
    type,
    unit,
    width,
    height,
    quantity,
    faceMaterial,
    printingMethod,
    blackoutMethod,
    thickness,
    printSide,
    lamination,
    cutStyle,
    display,
    frameRates = SIGNAGE_FRAME_RATES,
    sintraRates = SINTRA_RATES,
    sintraLaminationPerSqIn = 0.15,
    sintraStandPerSqIn = 0.25,
  } = input;

  const validDimensions =
    !!type &&
    !!unit &&
    width > 0 &&
    height > 0 &&
    Number.isInteger(quantity) &&
    quantity > 0;

  if (!validDimensions) {
    return {
      valid: false as const,
      summary: 'Complete Signage details for an estimate.',
    };
  }

  if (type === 'Sticker on Sintra Board') {
    const baseRate = sintraRates[thickness]?.[printSide];
    if (!baseRate) {
      return {
        valid: false as const,
        summary: 'Complete Sintra Board details for an estimate.',
      };
    }
    const totalSquareInches = toInches(width, unit) * toInches(height, unit) * quantity;
    const laminationAddOn =
      lamination === 'Laminated' ? totalSquareInches * sintraLaminationPerSqIn : 0;
    const standAddOn =
      display === 'With Sintra Stand / Standee' ? totalSquareInches * sintraStandPerSqIn : 0;
    const finalPrice = totalSquareInches * baseRate + laminationAddOn + standAddOn;

    return {
      valid: true as const,
      kind: 'sintra' as const,
      type,
      unit,
      width,
      height,
      quantity,
      totalSquareInches,
      baseRate,
      laminationAddOn,
      standAddOn,
      finalPrice,
      thickness,
      printSide,
      lamination,
      cutStyle,
      display,
      summary: `Signage Type: ${type} · Sintra Thickness: ${thickness} · Print Side: ${printSide} · Base Rate per sq.in: ${formatPeso(baseRate, 2)} · Width: ${width} ${unit} · Height: ${height} ${unit} · Quantity: ${quantity} · Total Square Inches: ${totalSquareInches.toFixed(2)}${laminationAddOn ? ` · Lamination Add-on: ${formatPeso(laminationAddOn, 2)}` : ''}${standAddOn ? ` · Sintra Stand / Standee Add-on: ${formatPeso(standAddOn, 2)}` : ''} · Estimated Price: ${formatPeso(finalPrice, 2)}`,
    };
  }

  const isPanaflex = type === 'Panaflex — Non-Lighted' || type === 'Panaflex — Lighted';
  const selectedRate = getSignageFrameRate(
    frameRates,
    type,
    faceMaterial,
    printingMethod,
    blackoutMethod
  );

  if (!selectedRate) {
    return {
      valid: false as const,
      summary: 'Complete Signage details for an estimate.',
    };
  }

  const totalSquareFeet = toFeet(width, unit) * toFeet(height, unit) * quantity;
  const finalPrice = totalSquareFeet * selectedRate;
  const methodLabel = isPanaflex
    ? faceMaterial === 'Printed Panaflex'
      ? printingMethod
      : ''
    : blackoutMethod;

  return {
    valid: true as const,
    kind: 'panaflex' as const,
    type,
    unit,
    width,
    height,
    quantity,
    totalSquareFeet,
    selectedRate,
    finalPrice,
    faceMaterial: isPanaflex ? faceMaterial : '',
    method: methodLabel,
    summary: `Signage Type: ${type}${isPanaflex ? ` · Face Material / Output Type: ${faceMaterial}` : ''}${methodLabel ? ` · Printing Method: ${methodLabel}` : ''} · Rate per sq.ft: ${formatPeso(selectedRate)} · Width: ${width} ${unit} · Height: ${height} ${unit} · Quantity: ${quantity} · Total Square Feet: ${totalSquareFeet.toFixed(2)} · Final Estimated Price: ${formatPeso(finalPrice, 2)}`,
  };
}

export const BUSINESS = {
  address: 'NIA Road, Bucandala 3, Imus City, Cavite',
  phoneDisplay: '09157143388',
  phoneTel: '+639157143388',
  facebookLabel: 'Three J Print Center',
  facebookUrl: 'https://www.facebook.com/threej.printcenter',
  website: 'www.3jprintcenter.com',
  proprietor: 'Johnathan M. Española',
};
