import type { ServiceId } from '~/app/service-guide/_lib/pricing';

export type DetailItem = {
  label: string;
  value: string;
};

export type JobDetailForm = {
  dtfServiceType: string;
  dtfTransferMeters: string;
  dtfTransferArtworkReady: string;
  dtfPrintSide: string;
  dtfFrontPrintSize: string;
  dtfBackPrintSize: string;
  dtfCustomWidth: string;
  dtfCustomHeight: string;
  dtfQuantity: string;
  dtfShoulderName: string;
  dtfCustomerProvidesShirt: string;
  dtfArtworkReady: string;
  sublimationProductType: string;
  sublimationQuantity: string;
  sublimationOversized: string;
  sublimationFabricWeight: string;
  sublimationPersonalization: string;
  sublimationDesignNeeded: string;
  sublimationSameDesign: string;
  sublimationUniqueLayouts: string;
  sublimationRush: string;
  tarpaulinWidth: string;
  tarpaulinHeight: string;
  tarpaulinMedia: string;
  tarpaulinMethod: string;
  tarpaulinQuantity: string;
  tarpaulinLayoutNeeded: string;
  tarpaulinSameDesign: string;
  tarpaulinUniqueLayouts: string;
  tarpaulinEyeletsFinishing: string;
  tarpaulinEyeletOption: string;
  tarpaulinEdgeFinishing: string;
  stickerType: string;
  stickerCutOutput: string;
  stickerLamination: string;
  stickerApplication: string;
  stickerUnit: string;
  stickersWidth: string;
  stickersHeight: string;
  stickersQuantity: string;
  signageType: string;
  signageFace: string;
  signageFulfillment: string;
  signageUnit: string;
  signageWidth: string;
  signageHeight: string;
  signageQuantity: string;
  sintraThickness: string;
  sintraPrintSide: string;
  sintraLamination: string;
  sintraCutStyle: string;
  sintraDisplayOption: string;
  panaflexFaceMaterial: string;
  panaflexPrintingMethod: string;
  blackoutPrintingMethod: string;
  signageInstallationLocation: string;
  signageMountingType: string;
  signagePowerSource: string;
  signageSiteDetails: string;
};

function pushDetail(rows: DetailItem[], label: string, value?: string | number | null) {
  const normalized = String(value ?? '').trim();
  if (!normalized || normalized === '—') return;
  rows.push({ label, value: normalized });
}

export function getJobDetailRows(service: ServiceId | null, form: JobDetailForm): DetailItem[] {
  if (!service) return [];

  const rows: DetailItem[] = [];

  if (service === 'DTF Printing') {
    pushDetail(rows, 'Service type', form.dtfServiceType);
    if (form.dtfServiceType === 'DTF Transfer Printing — Per Meter') {
      pushDetail(rows, 'Meters', form.dtfTransferMeters);
      pushDetail(rows, 'Artwork ready', form.dtfTransferArtworkReady);
      return rows;
    }

    pushDetail(rows, 'Print side', form.dtfPrintSide);
    if (['Front', 'Both'].includes(form.dtfPrintSide)) {
      pushDetail(rows, 'Front print size', form.dtfFrontPrintSize);
    }
    if (['Back', 'Both'].includes(form.dtfPrintSide)) {
      pushDetail(rows, 'Back print size', form.dtfBackPrintSize);
    }
    if (form.dtfFrontPrintSize === 'Custom Size' || form.dtfBackPrintSize === 'Custom Size') {
      pushDetail(
        rows,
        'Custom size',
        [form.dtfCustomWidth, form.dtfCustomHeight].filter(Boolean).join(' × '),
      );
    }
    pushDetail(rows, 'Quantity', form.dtfQuantity);
    pushDetail(rows, 'Shoulder name', form.dtfShoulderName);
    pushDetail(rows, 'Customer provides shirt', form.dtfCustomerProvidesShirt);
    pushDetail(rows, 'Artwork ready', form.dtfArtworkReady);
    return rows;
  }

  if (service === 'Full Sublimation') {
    pushDetail(rows, 'Product type', form.sublimationProductType);
    pushDetail(rows, 'Quantity', form.sublimationQuantity);
    if (Number(form.sublimationOversized) > 0) {
      pushDetail(rows, '4XL–6XL quantity', form.sublimationOversized);
    }
    pushDetail(rows, 'Fabric weight', form.sublimationFabricWeight);
    pushDetail(rows, 'Personalization', form.sublimationPersonalization);
    pushDetail(rows, 'Design needed', form.sublimationDesignNeeded);
    pushDetail(rows, 'Same design', form.sublimationSameDesign);
    if (form.sublimationUniqueLayouts) {
      pushDetail(rows, 'Unique layouts', form.sublimationUniqueLayouts);
    }
    pushDetail(rows, 'Rush', form.sublimationRush);
    return rows;
  }

  if (service === 'Tarpaulin') {
    pushDetail(rows, 'Size', `${form.tarpaulinWidth} × ${form.tarpaulinHeight} ft`);
    pushDetail(rows, 'Media', form.tarpaulinMedia);
    pushDetail(rows, 'Print method', form.tarpaulinMethod);
    pushDetail(rows, 'Quantity', form.tarpaulinQuantity);
    pushDetail(rows, 'Layout needed', form.tarpaulinLayoutNeeded);
    pushDetail(rows, 'Same design', form.tarpaulinSameDesign);
    if (form.tarpaulinUniqueLayouts) {
      pushDetail(rows, 'Unique layouts', form.tarpaulinUniqueLayouts);
    }
    pushDetail(rows, 'Eyelets / finishing', form.tarpaulinEyeletsFinishing);
    pushDetail(rows, 'Eyelet option', form.tarpaulinEyeletOption);
    pushDetail(rows, 'Edge finishing', form.tarpaulinEdgeFinishing);
    return rows;
  }

  if (service === 'Stickers') {
    pushDetail(rows, 'Sticker type', form.stickerType);
    pushDetail(rows, 'Cut / output', form.stickerCutOutput);
    pushDetail(rows, 'Lamination', form.stickerLamination);
    pushDetail(rows, 'Application', form.stickerApplication);
    pushDetail(
      rows,
      'Size',
      `${form.stickersWidth} × ${form.stickersHeight} ${form.stickerUnit || ''}`.trim(),
    );
    pushDetail(rows, 'Quantity', form.stickersQuantity);
    return rows;
  }

  pushDetail(rows, 'Signage type', form.signageType);
  pushDetail(rows, 'Face / output', form.signageFace);
  pushDetail(rows, 'Fulfillment', form.signageFulfillment);
  pushDetail(
    rows,
    'Size',
    `${form.signageWidth} × ${form.signageHeight} ${form.signageUnit || ''}`.trim(),
  );
  pushDetail(rows, 'Quantity', form.signageQuantity);

  if (form.signageType === 'Sticker on Sintra Board') {
    pushDetail(rows, 'Thickness', form.sintraThickness);
    pushDetail(rows, 'Print side', form.sintraPrintSide);
    pushDetail(rows, 'Lamination', form.sintraLamination);
    pushDetail(rows, 'Cut style', form.sintraCutStyle);
    pushDetail(rows, 'Display option', form.sintraDisplayOption);
  }

  if (form.signageType === 'Panaflex — Non-Lighted' || form.signageType === 'Panaflex — Lighted') {
    pushDetail(rows, 'Face material', form.panaflexFaceMaterial);
    pushDetail(rows, 'Printing method', form.panaflexPrintingMethod);
  }

  if (form.signageType === 'Blackout Tarp Signage — With Frame') {
    pushDetail(rows, 'Printing method', form.blackoutPrintingMethod);
  }

  if (form.signageFulfillment === 'Delivery / Installation Package') {
    pushDetail(rows, 'Installation location', form.signageInstallationLocation);
    pushDetail(rows, 'Mounting type', form.signageMountingType);
    pushDetail(rows, 'Power source', form.signagePowerSource);
    pushDetail(rows, 'Site details', form.signageSiteDetails);
  }

  return rows;
}
