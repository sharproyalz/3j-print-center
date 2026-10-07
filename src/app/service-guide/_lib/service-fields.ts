import {
  DTF_TRANSFER_SPECIAL_MIN,
  STICKER_RATE_MATRIX,
  TARPAULIN_RATE_MATRIX,
  type FlatRateMap,
  type RateMatrix,
  type ServiceId,
} from '~/app/service-guide/_lib/pricing';

export type ServiceRateOptions = {
  tarpaulin?: RateMatrix;
  stickers?: RateMatrix;
  dtfShirt?: FlatRateMap;
  sublimation?: FlatRateMap;
  signageFrame?: RateMatrix;
  signageSintra?: RateMatrix;
  dtfTransferSpecialMinMeters?: number;
  sublimationLayoutFeeBelowQty?: number;
};

export type ServiceFieldKey =
  | 'dtfServiceType'
  | 'dtfTransferMeters'
  | 'dtfTransferArtworkReady'
  | 'dtfPrintSide'
  | 'dtfFrontPrintSize'
  | 'dtfBackPrintSize'
  | 'dtfCustomWidth'
  | 'dtfCustomHeight'
  | 'dtfQuantity'
  | 'dtfCustomerProvidesShirt'
  | 'dtfArtworkReady'
  | 'sublimationProductType'
  | 'sublimationQuantity'
  | 'sublimationOversized'
  | 'sublimationFabricWeight'
  | 'sublimationPersonalization'
  | 'sublimationDesignNeeded'
  | 'sublimationSameDesign'
  | 'sublimationUniqueLayouts'
  | 'sublimationRush'
  | 'tarpaulinWidth'
  | 'tarpaulinHeight'
  | 'tarpaulinMedia'
  | 'tarpaulinMethod'
  | 'tarpaulinQuantity'
  | 'tarpaulinLayoutNeeded'
  | 'tarpaulinSameDesign'
  | 'tarpaulinUniqueLayouts'
  | 'tarpaulinEyeletsFinishing'
  | 'tarpaulinEyeletOption'
  | 'tarpaulinEdgeFinishing'
  | 'stickerType'
  | 'stickerCutOutput'
  | 'stickerLamination'
  | 'stickerApplication'
  | 'stickerUnit'
  | 'stickersWidth'
  | 'stickersHeight'
  | 'stickersQuantity'
  | 'signageType'
  | 'signageFace'
  | 'signageFulfillment'
  | 'signageUnit'
  | 'signageWidth'
  | 'signageHeight'
  | 'signageQuantity'
  | 'sintraThickness'
  | 'sintraPrintSide'
  | 'sintraLamination'
  | 'sintraCutStyle'
  | 'sintraDisplayOption'
  | 'panaflexFaceMaterial'
  | 'panaflexPrintingMethod'
  | 'blackoutPrintingMethod'
  | 'signageInstallationLocation'
  | 'signageMountingType'
  | 'signagePowerSource'
  | 'signageSiteDetails';

export type ServiceFieldErrors = Partial<Record<ServiceFieldKey, string>>;

export type ServiceFormInput = Record<ServiceFieldKey, string>;

const REQUIRED = 'This field is required.';
const POSITIVE_NUMBER = 'Enter a number greater than 0.';
const POSITIVE_INTEGER = 'Enter a whole number greater than 0.';

function isFilled(value: string) {
  return value.trim() !== '';
}

function asNumber(value: string) {
  return Number(value);
}

function isPositiveNumber(value: string) {
  const n = asNumber(value);
  return isFilled(value) && Number.isFinite(n) && n > 0;
}

function isPositiveInteger(value: string) {
  const n = asNumber(value);
  return isFilled(value) && Number.isInteger(n) && n > 0;
}

function isNonNegativeInteger(value: string) {
  const n = asNumber(value);
  return isFilled(value) && Number.isInteger(n) && n >= 0;
}

function requireFilled(errors: ServiceFieldErrors, key: ServiceFieldKey, value: string, message = REQUIRED) {
  if (!isFilled(value)) errors[key] = message;
}

function validateDtf(
  form: ServiceFormInput,
  specialMinMeters = DTF_TRANSFER_SPECIAL_MIN
): ServiceFieldErrors {
  const errors: ServiceFieldErrors = {};
  requireFilled(errors, 'dtfServiceType', form.dtfServiceType, 'Choose a DTF service type.');

  if (!form.dtfServiceType) return errors;

  if (form.dtfServiceType === 'DTF Transfer Printing — Per Meter') {
    if (!isPositiveInteger(form.dtfTransferMeters)) {
      errors.dtfTransferMeters = POSITIVE_INTEGER;
    } else if (asNumber(form.dtfTransferMeters) >= specialMinMeters) {
      errors.dtfTransferMeters = `Please contact Three J Print Center for special volume pricing (${specialMinMeters}+ meters).`;
    }
    requireFilled(errors, 'dtfTransferArtworkReady', form.dtfTransferArtworkReady, 'Choose whether artwork is ready.');
    return errors;
  }

  requireFilled(errors, 'dtfPrintSide', form.dtfPrintSide, 'Choose a print side.');
  const showFront = ['Front', 'Both'].includes(form.dtfPrintSide);
  const showBack = ['Back', 'Both'].includes(form.dtfPrintSide);

  if (showFront) {
    requireFilled(errors, 'dtfFrontPrintSize', form.dtfFrontPrintSize, 'Choose a front print size.');
  }
  if (showBack) {
    requireFilled(errors, 'dtfBackPrintSize', form.dtfBackPrintSize, 'Choose a back print size.');
  }

  const showCustomSize =
    (showFront && form.dtfFrontPrintSize === 'Custom Size') ||
    (showBack && form.dtfBackPrintSize === 'Custom Size');

  if (showCustomSize) {
    if (!isPositiveNumber(form.dtfCustomWidth)) errors.dtfCustomWidth = POSITIVE_NUMBER;
    if (!isPositiveNumber(form.dtfCustomHeight)) errors.dtfCustomHeight = POSITIVE_NUMBER;
  }

  if (!isPositiveInteger(form.dtfQuantity)) errors.dtfQuantity = POSITIVE_INTEGER;
  requireFilled(
    errors,
    'dtfCustomerProvidesShirt',
    form.dtfCustomerProvidesShirt,
    'Choose whether you will provide the shirt.'
  );
  requireFilled(errors, 'dtfArtworkReady', form.dtfArtworkReady, 'Choose whether artwork is ready.');

  return errors;
}

function validateSublimation(
  form: ServiceFormInput,
  layoutFeeBelowQty = 10
): ServiceFieldErrors {
  const errors: ServiceFieldErrors = {};
  requireFilled(errors, 'sublimationProductType', form.sublimationProductType, 'Choose a product type.');

  const quantity = asNumber(form.sublimationQuantity);
  if (!isPositiveInteger(form.sublimationQuantity)) {
    errors.sublimationQuantity = POSITIVE_INTEGER;
  } else if (quantity < 6) {
    errors.sublimationQuantity = 'Minimum order for Full Sublimation is 6 pieces.';
  }

  if (!isNonNegativeInteger(form.sublimationOversized)) {
    errors.sublimationOversized = 'Enter 0 or a whole number.';
  } else if (
    isPositiveInteger(form.sublimationQuantity) &&
    asNumber(form.sublimationOversized) > quantity
  ) {
    errors.sublimationOversized = 'Cannot exceed the total order quantity.';
  }

  requireFilled(errors, 'sublimationFabricWeight', form.sublimationFabricWeight, 'Choose a fabric weight.');
  requireFilled(
    errors,
    'sublimationPersonalization',
    form.sublimationPersonalization,
    'Choose whether personalization is needed.'
  );
  requireFilled(
    errors,
    'sublimationDesignNeeded',
    form.sublimationDesignNeeded,
    'Choose whether design/layout help is needed.'
  );

  const showLayout =
    form.sublimationDesignNeeded === 'Yes' &&
    isPositiveInteger(form.sublimationQuantity) &&
    quantity < layoutFeeBelowQty;

  if (showLayout) {
    requireFilled(
      errors,
      'sublimationSameDesign',
      form.sublimationSameDesign,
      'Choose whether all pieces share the same design.'
    );
    if (form.sublimationSameDesign === 'No') {
      if (!isPositiveInteger(form.sublimationUniqueLayouts)) {
        errors.sublimationUniqueLayouts = POSITIVE_INTEGER;
      } else if (asNumber(form.sublimationUniqueLayouts) > quantity) {
        errors.sublimationUniqueLayouts = 'Cannot exceed the total order quantity.';
      }
    }
  }

  requireFilled(errors, 'sublimationRush', form.sublimationRush, 'Choose whether this is a rush order.');

  return errors;
}

function validateTarpaulin(form: ServiceFormInput, rates: RateMatrix): ServiceFieldErrors {
  const errors: ServiceFieldErrors = {};

  if (!isPositiveNumber(form.tarpaulinWidth)) errors.tarpaulinWidth = POSITIVE_NUMBER;
  if (!isPositiveNumber(form.tarpaulinHeight)) errors.tarpaulinHeight = POSITIVE_NUMBER;
  requireFilled(errors, 'tarpaulinMedia', form.tarpaulinMedia, 'Choose a printing media.');

  if (form.tarpaulinMedia) {
    const methods = rates[form.tarpaulinMedia];
    if (!form.tarpaulinMethod || !methods?.[form.tarpaulinMethod]) {
      errors.tarpaulinMethod = 'Choose a printing method.';
    }
  }

  const tarpaulinQuantity = asNumber(form.tarpaulinQuantity);
  if (!isPositiveInteger(form.tarpaulinQuantity)) errors.tarpaulinQuantity = POSITIVE_INTEGER;
  requireFilled(errors, 'tarpaulinLayoutNeeded', form.tarpaulinLayoutNeeded, 'Choose whether layout is needed.');

  if (form.tarpaulinLayoutNeeded === 'Yes') {
    requireFilled(
      errors,
      'tarpaulinSameDesign',
      form.tarpaulinSameDesign,
      'Choose whether all pieces share the same design.'
    );
    if (form.tarpaulinSameDesign === 'No') {
      if (!isPositiveInteger(form.tarpaulinUniqueLayouts)) {
        errors.tarpaulinUniqueLayouts = POSITIVE_INTEGER;
      } else if (
        isPositiveInteger(form.tarpaulinQuantity) &&
        asNumber(form.tarpaulinUniqueLayouts) > tarpaulinQuantity
      ) {
        errors.tarpaulinUniqueLayouts = 'Cannot exceed the total order quantity.';
      }
    }
  }

  requireFilled(
    errors,
    'tarpaulinEyeletsFinishing',
    form.tarpaulinEyeletsFinishing,
    'Choose whether eyelets/finishing are needed.'
  );
  requireFilled(errors, 'tarpaulinEyeletOption', form.tarpaulinEyeletOption, 'Choose an eyelet option.');
  requireFilled(errors, 'tarpaulinEdgeFinishing', form.tarpaulinEdgeFinishing, 'Choose edge finishing.');

  return errors;
}

function validateStickers(form: ServiceFormInput, rates: RateMatrix): ServiceFieldErrors {
  const errors: ServiceFieldErrors = {};

  requireFilled(errors, 'stickerType', form.stickerType, 'Choose a sticker type.');
  requireFilled(errors, 'stickerCutOutput', form.stickerCutOutput, 'Choose a cut/output option.');
  requireFilled(errors, 'stickerLamination', form.stickerLamination, 'Choose a lamination option.');

  if (
    form.stickerType &&
    form.stickerLamination &&
    rates[form.stickerType]?.[form.stickerLamination] === undefined
  ) {
    errors.stickerLamination = 'Choose Non-Laminated or Laminated for an estimate.';
  }

  requireFilled(errors, 'stickerApplication', form.stickerApplication, 'Choose an application/use.');
  requireFilled(errors, 'stickerUnit', form.stickerUnit, 'Choose a measurement unit.');
  if (!isPositiveNumber(form.stickersWidth)) errors.stickersWidth = POSITIVE_NUMBER;
  if (!isPositiveNumber(form.stickersHeight)) errors.stickersHeight = POSITIVE_NUMBER;
  if (!isPositiveInteger(form.stickersQuantity)) errors.stickersQuantity = POSITIVE_INTEGER;

  return errors;
}

function validateSignage(form: ServiceFormInput): ServiceFieldErrors {
  const errors: ServiceFieldErrors = {};
  const isSintra = form.signageType === 'Sticker on Sintra Board';
  const isPanaflex =
    form.signageType === 'Panaflex — Non-Lighted' || form.signageType === 'Panaflex — Lighted';
  const isBlackout = form.signageType === 'Blackout Tarp Signage — With Frame';
  const showInstall =
    !isSintra && form.signageFulfillment === 'Delivery / Installation Package';

  requireFilled(errors, 'signageType', form.signageType, 'Choose a signage type.');

  if (isSintra) {
    requireFilled(errors, 'sintraThickness', form.sintraThickness, 'Choose Sintra thickness.');
    requireFilled(errors, 'sintraPrintSide', form.sintraPrintSide, 'Choose a print side.');
    requireFilled(errors, 'sintraLamination', form.sintraLamination, 'Choose a lamination option.');
    requireFilled(errors, 'sintraCutStyle', form.sintraCutStyle, 'Choose a cut style.');
    requireFilled(errors, 'sintraDisplayOption', form.sintraDisplayOption, 'Choose a display option.');
  }

  if (isPanaflex) {
    requireFilled(
      errors,
      'panaflexFaceMaterial',
      form.panaflexFaceMaterial,
      'Choose a face material / output type.'
    );
    if (form.panaflexFaceMaterial === 'Printed Panaflex') {
      requireFilled(
        errors,
        'panaflexPrintingMethod',
        form.panaflexPrintingMethod,
        'Choose a printing method.'
      );
    }
  }

  if (!isSintra && form.signageType) {
    requireFilled(errors, 'signageFace', form.signageFace, 'Choose a sign face.');
  }

  if (isBlackout) {
    requireFilled(
      errors,
      'blackoutPrintingMethod',
      form.blackoutPrintingMethod,
      'Choose a printing method.'
    );
  }

  if (!isSintra && form.signageType) {
    requireFilled(errors, 'signageFulfillment', form.signageFulfillment, 'Choose a fulfillment option.');
  }

  requireFilled(errors, 'signageUnit', form.signageUnit, 'Choose a measurement unit.');
  if (!isPositiveNumber(form.signageWidth)) errors.signageWidth = POSITIVE_NUMBER;
  if (!isPositiveNumber(form.signageHeight)) errors.signageHeight = POSITIVE_NUMBER;
  if (!isPositiveInteger(form.signageQuantity)) errors.signageQuantity = POSITIVE_INTEGER;

  if (showInstall) {
    requireFilled(
      errors,
      'signageInstallationLocation',
      form.signageInstallationLocation,
      'Choose an installation location.'
    );
    requireFilled(errors, 'signageMountingType', form.signageMountingType, 'Choose a mounting type.');
    if (form.signageType === 'Panaflex — Lighted') {
      requireFilled(
        errors,
        'signagePowerSource',
        form.signagePowerSource,
        'Choose whether power is available nearby.'
      );
    }
    requireFilled(
      errors,
      'signageSiteDetails',
      form.signageSiteDetails,
      'Add site / installation details.'
    );
  }

  return errors;
}

export const SERVICE_FIELD_ORDER: Record<ServiceId, ServiceFieldKey[]> = {
  'DTF Printing': [
    'dtfServiceType',
    'dtfTransferMeters',
    'dtfTransferArtworkReady',
    'dtfPrintSide',
    'dtfFrontPrintSize',
    'dtfBackPrintSize',
    'dtfCustomWidth',
    'dtfCustomHeight',
    'dtfQuantity',
    'dtfCustomerProvidesShirt',
    'dtfArtworkReady',
  ],
  'Full Sublimation': [
    'sublimationProductType',
    'sublimationQuantity',
    'sublimationOversized',
    'sublimationFabricWeight',
    'sublimationPersonalization',
    'sublimationDesignNeeded',
    'sublimationSameDesign',
    'sublimationUniqueLayouts',
    'sublimationRush',
  ],
  Tarpaulin: [
    'tarpaulinWidth',
    'tarpaulinHeight',
    'tarpaulinMedia',
    'tarpaulinMethod',
    'tarpaulinQuantity',
    'tarpaulinLayoutNeeded',
    'tarpaulinSameDesign',
    'tarpaulinUniqueLayouts',
    'tarpaulinEyeletsFinishing',
    'tarpaulinEyeletOption',
    'tarpaulinEdgeFinishing',
  ],
  Stickers: [
    'stickerType',
    'stickerCutOutput',
    'stickerLamination',
    'stickerApplication',
    'stickerUnit',
    'stickersWidth',
    'stickersHeight',
    'stickersQuantity',
  ],
  Signage: [
    'signageType',
    'sintraThickness',
    'sintraPrintSide',
    'sintraLamination',
    'sintraCutStyle',
    'sintraDisplayOption',
    'panaflexFaceMaterial',
    'panaflexPrintingMethod',
    'signageFace',
    'blackoutPrintingMethod',
    'signageFulfillment',
    'signageUnit',
    'signageWidth',
    'signageHeight',
    'signageQuantity',
    'signageInstallationLocation',
    'signageMountingType',
    'signagePowerSource',
    'signageSiteDetails',
  ],
};

function toServiceFormInput(input: Record<string, unknown>): ServiceFormInput {
  const empty = '' as const;
  const get = (key: ServiceFieldKey) => {
    const value = input[key];
    return typeof value === 'string' ? value : value == null ? empty : String(value);
  };

  return {
    dtfServiceType: get('dtfServiceType'),
    dtfTransferMeters: get('dtfTransferMeters'),
    dtfTransferArtworkReady: get('dtfTransferArtworkReady'),
    dtfPrintSide: get('dtfPrintSide'),
    dtfFrontPrintSize: get('dtfFrontPrintSize'),
    dtfBackPrintSize: get('dtfBackPrintSize'),
    dtfCustomWidth: get('dtfCustomWidth'),
    dtfCustomHeight: get('dtfCustomHeight'),
    dtfQuantity: get('dtfQuantity'),
    dtfCustomerProvidesShirt: get('dtfCustomerProvidesShirt'),
    dtfArtworkReady: get('dtfArtworkReady'),
    sublimationProductType: get('sublimationProductType'),
    sublimationQuantity: get('sublimationQuantity'),
    sublimationOversized: get('sublimationOversized'),
    sublimationFabricWeight: get('sublimationFabricWeight'),
    sublimationPersonalization: get('sublimationPersonalization'),
    sublimationDesignNeeded: get('sublimationDesignNeeded'),
    sublimationSameDesign: get('sublimationSameDesign'),
    sublimationUniqueLayouts: get('sublimationUniqueLayouts'),
    sublimationRush: get('sublimationRush'),
    tarpaulinWidth: get('tarpaulinWidth'),
    tarpaulinHeight: get('tarpaulinHeight'),
    tarpaulinMedia: get('tarpaulinMedia'),
    tarpaulinMethod: get('tarpaulinMethod'),
    tarpaulinQuantity: get('tarpaulinQuantity'),
    tarpaulinLayoutNeeded: get('tarpaulinLayoutNeeded'),
    tarpaulinSameDesign: get('tarpaulinSameDesign'),
    tarpaulinUniqueLayouts: get('tarpaulinUniqueLayouts'),
    tarpaulinEyeletsFinishing: get('tarpaulinEyeletsFinishing'),
    tarpaulinEyeletOption: get('tarpaulinEyeletOption'),
    tarpaulinEdgeFinishing: get('tarpaulinEdgeFinishing'),
    stickerType: get('stickerType'),
    stickerCutOutput: get('stickerCutOutput'),
    stickerLamination: get('stickerLamination'),
    stickerApplication: get('stickerApplication'),
    stickerUnit: get('stickerUnit'),
    stickersWidth: get('stickersWidth'),
    stickersHeight: get('stickersHeight'),
    stickersQuantity: get('stickersQuantity'),
    signageType: get('signageType'),
    signageFace: get('signageFace'),
    signageFulfillment: get('signageFulfillment'),
    signageUnit: get('signageUnit'),
    signageWidth: get('signageWidth'),
    signageHeight: get('signageHeight'),
    signageQuantity: get('signageQuantity'),
    sintraThickness: get('sintraThickness'),
    sintraPrintSide: get('sintraPrintSide'),
    sintraLamination: get('sintraLamination'),
    sintraCutStyle: get('sintraCutStyle'),
    sintraDisplayOption: get('sintraDisplayOption'),
    panaflexFaceMaterial: get('panaflexFaceMaterial'),
    panaflexPrintingMethod: get('panaflexPrintingMethod'),
    blackoutPrintingMethod: get('blackoutPrintingMethod'),
    signageInstallationLocation: get('signageInstallationLocation'),
    signageMountingType: get('signageMountingType'),
    signagePowerSource: get('signagePowerSource'),
    signageSiteDetails: get('signageSiteDetails'),
  };
}

export function validateServiceFields(
  service: ServiceId,
  input: Record<string, unknown>,
  rateOptions?: ServiceRateOptions
): { ok: true } | { ok: false; errors: ServiceFieldErrors } {
  const form = toServiceFormInput(input);
  const tarpaulinRates = rateOptions?.tarpaulin ?? TARPAULIN_RATE_MATRIX;
  const stickerRates = rateOptions?.stickers ?? STICKER_RATE_MATRIX;
  let errors: ServiceFieldErrors;

  switch (service) {
    case 'DTF Printing':
      errors = validateDtf(form, rateOptions?.dtfTransferSpecialMinMeters);
      break;
    case 'Full Sublimation':
      errors = validateSublimation(form, rateOptions?.sublimationLayoutFeeBelowQty);
      break;
    case 'Tarpaulin':
      errors = validateTarpaulin(form, tarpaulinRates);
      break;
    case 'Stickers':
      errors = validateStickers(form, stickerRates);
      break;
    case 'Signage':
      errors = validateSignage(form);
      break;
    default:
      errors = {};
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true };
}

const SERVICE_FIELD_KEYS = new Set<string>(
  Object.values(SERVICE_FIELD_ORDER).flat()
);

export function isServiceFieldKey(key: string): key is ServiceFieldKey {
  return SERVICE_FIELD_KEYS.has(key);
}
