'use client';

import { ArrowUpRight, ChevronDown, Printer, X } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { toast } from 'sonner';

import { CustomSelect } from '~/app/service-guide/_components/custom-select';
import {
  validateCustomerFields,
  type CustomerFieldErrors,
  type CustomerFieldKey,
} from '~/app/service-guide/_lib/customer-fields';
import {
  BUSINESS,
  SERVICES,
  calculateDtfShirt,
  calculateDtfTransfer,
  calculateSignage,
  calculateSticker,
  calculateSublimation,
  calculateTarpaulin,
  formatPeso,
  type ServiceId,
} from '~/app/service-guide/_lib/pricing';
import {
  SERVICE_FIELD_ORDER,
  isServiceFieldKey,
  validateServiceFields,
  type ServiceFieldErrors,
  type ServiceFieldKey,
} from '~/app/service-guide/_lib/service-fields';
import { DEFAULT_PRICING_CATALOG } from '~/lib/pricing-catalog';
import { cn } from '~/lib/utils';
import { api } from '~/trpc/react';

import '../service-guide.css';

type FormState = {
  customerName: string;
  mobileNumber: string;
  messengerName: string;
  emailAddress: string;
  notes: string;
  targetDate: string;
  consent: boolean;
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

const INITIAL_FORM: FormState = {
  customerName: '',
  mobileNumber: '',
  messengerName: '',
  emailAddress: '',
  notes: '',
  targetDate: '',
  consent: false,
  dtfServiceType: '',
  dtfTransferMeters: '',
  dtfTransferArtworkReady: '',
  dtfPrintSide: '',
  dtfFrontPrintSize: '',
  dtfBackPrintSize: '',
  dtfCustomWidth: '',
  dtfCustomHeight: '',
  dtfQuantity: '',
  dtfShoulderName: 'None',
  dtfCustomerProvidesShirt: '',
  dtfArtworkReady: '',
  sublimationProductType: '',
  sublimationQuantity: '',
  sublimationOversized: '0',
  sublimationFabricWeight: '',
  sublimationPersonalization: '',
  sublimationDesignNeeded: '',
  sublimationSameDesign: '',
  sublimationUniqueLayouts: '',
  sublimationRush: '',
  tarpaulinWidth: '',
  tarpaulinHeight: '',
  tarpaulinMedia: '',
  tarpaulinMethod: '',
  tarpaulinQuantity: '',
  tarpaulinLayoutNeeded: '',
  tarpaulinSameDesign: '',
  tarpaulinUniqueLayouts: '',
  tarpaulinEyeletsFinishing: '',
  tarpaulinEyeletOption: '',
  tarpaulinEdgeFinishing: '',
  stickerType: '',
  stickerCutOutput: '',
  stickerLamination: '',
  stickerApplication: '',
  stickerUnit: '',
  stickersWidth: '',
  stickersHeight: '',
  stickersQuantity: '',
  signageType: '',
  signageFace: '',
  signageFulfillment: '',
  signageUnit: '',
  signageWidth: '',
  signageHeight: '',
  signageQuantity: '',
  sintraThickness: '',
  sintraPrintSide: '',
  sintraLamination: '',
  sintraCutStyle: '',
  sintraDisplayOption: '',
  panaflexFaceMaterial: '',
  panaflexPrintingMethod: '',
  blackoutPrintingMethod: '',
  signageInstallationLocation: '',
  signageMountingType: '',
  signagePowerSource: '',
  signageSiteDetails: '',
};

type Panel = 'form' | 'review' | 'confirmation';

type ReviewedQuote = {
  estimatedPrice: string;
  record: Record<string, unknown>;
};

type QuoteFieldErrors = CustomerFieldErrors & ServiceFieldErrors;
type QuoteFieldKey = CustomerFieldKey | ServiceFieldKey;

const CUSTOMER_FIELD_ORDER: CustomerFieldKey[] = [
  'customerName',
  'mobileNumber',
  'emailAddress',
  'notes',
  'targetDate',
  'consent',
];

function scrollToField(key: QuoteFieldKey) {
  window.setTimeout(() => {
    document
      .querySelector(`[data-field="${key}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 0);
}

type DetailItem = {
  label: string;
  value: string;
};

function pushDetail(rows: DetailItem[], label: string, value?: string | number | null) {
  const normalized = String(value ?? '').trim();
  if (!normalized || normalized === '—') return;
  rows.push({ label, value: normalized });
}

function parseEstimateLines(summary: string): DetailItem[] {
  if (!summary.trim()) return [];

  return summary
    .split(' · ')
    .map((part) => {
      const trimmed = part.trim();
      const separatorIndex = trimmed.indexOf(': ');
      if (separatorIndex === -1) {
        return { label: '', value: trimmed };
      }
      return {
        label: trimmed.slice(0, separatorIndex).trim(),
        value: trimmed.slice(separatorIndex + 2).trim(),
      };
    })
    .filter((item) => item.value);
}

function getEstimateNote(
  service: ServiceId | null,
  isDtfTransfer: boolean,
  settings: {
    tarpaulinMinimumPrintingCharge: number;
    tarpaulinLayoutFeePerLayout: number;
    stickersMinimumJobCharge: number;
  }
): string | null {
  if (service === 'Full Sublimation') return 'Rush charges excluded.';
  if (service === 'Tarpaulin') {
    return `${formatPeso(settings.tarpaulinMinimumPrintingCharge)} minimum printing charge. Layout fee ${formatPeso(settings.tarpaulinLayoutFeePerLayout)} when needed. Eyelet and edge finishing: ₱0.`;
  }
  if (service === 'Stickers') {
    return `Minimum job charge: ${formatPeso(settings.stickersMinimumJobCharge)}.`;
  }
  if (service === 'DTF Printing' && isDtfTransfer) {
    return 'Layout and set-up are not included in the printing price.';
  }
  return null;
}

function getJobDetailRows(service: ServiceId | null, form: FormState): DetailItem[] {
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
    if (
      form.dtfFrontPrintSize === 'Custom Size' ||
      form.dtfBackPrintSize === 'Custom Size'
    ) {
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

  if (
    form.signageType === 'Panaflex — Non-Lighted' ||
    form.signageType === 'Panaflex — Lighted'
  ) {
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('field', error && 'has-error')}>
      <label className="mb-2 block font-semibold">{label}</label>
      {children}
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function QuoteSummaryDetails({
  customerName,
  mobileNumber,
  selectedService,
  jobDetails,
  notes,
  estimatedPrice,
  targetDate,
}: {
  customerName: string;
  mobileNumber: string;
  selectedService: string | null;
  jobDetails: DetailItem[];
  notes?: string;
  estimatedPrice: string;
  targetDate: string;
}) {
  return (
    <dl className="mt-6">
      <div className="detail-row">
        <dt className="mono-label text-xs text-[#bdb8ae]">CUSTOMER NAME</dt>
        <dd className="mt-1 font-bold">{customerName}</dd>
      </div>
      <div className="detail-row">
        <dt className="mono-label text-xs text-[#bdb8ae]">MOBILE NUMBER</dt>
        <dd className="mt-1 font-bold">{mobileNumber}</dd>
      </div>
      <div className="detail-row">
        <dt className="mono-label text-xs text-[#bdb8ae]">SERVICE</dt>
        <dd className="mt-1 font-bold">{selectedService}</dd>
      </div>
      <div className="detail-row">
        <dt className="mono-label text-xs text-[#bdb8ae]">JOB DETAILS</dt>
        <dd className="mt-2">
          {jobDetails.length ? (
            <ul className="job-detail-list">
              {jobDetails.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <span className="font-bold">—</span>
          )}
        </dd>
      </div>
      {notes ? (
        <div className="detail-row">
          <dt className="mono-label text-xs text-[#bdb8ae]">NOTES</dt>
          <dd className="mt-1 font-bold leading-6">{notes}</dd>
        </div>
      ) : null}
      <div className="detail-row">
        <dt className="mono-label text-xs text-[#bdb8ae]">ESTIMATED PRICE</dt>
        <dd className="mt-1 font-bold text-[#ffd52e]">{estimatedPrice}</dd>
      </div>
      <div className="detail-row">
        <dt className="mono-label text-xs text-[#bdb8ae]">TARGET COMPLETION DATE</dt>
        <dd className="mt-1 font-bold">{targetDate}</dd>
      </div>
    </dl>
  );
}

function QuotationSheet({
  customerName,
  mobileNumber,
  selectedService,
  targetDate,
  jobDetails,
  estimatedPrice,
  notes,
  titleId = 'quotation-title',
  onClose,
  actions,
}: {
  customerName: string;
  mobileNumber: string;
  selectedService: string;
  targetDate: string;
  jobDetails: DetailItem[];
  estimatedPrice: string;
  notes?: string;
  titleId?: string;
  onClose?: () => void;
  actions: ReactNode;
}) {
  return (
    <article className="quotation-sheet">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mono-label text-xs" style={{ color: '#e52521' }}>
            3J PRINT CENTER
          </p>
          <h2 id={titleId} className="mt-2 text-3xl font-extrabold">
            QUOTATION
          </h2>
          <div className="quotation-business-details mt-3 text-sm leading-6">
            {BUSINESS.address}
            <br />
            Contact: {BUSINESS.phoneDisplay}
            <br />
            Facebook: {BUSINESS.facebookLabel}
            <br />
            Website: {BUSINESS.website}
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            data-quotation-close
            className="text-2xl font-bold"
            aria-label="Close quotation"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="quotation-meta mt-6 grid gap-2 text-sm sm:grid-cols-2">
        <p>
          <strong>Prepared for:</strong> {customerName}
        </p>
        <p>
          <strong>Mobile:</strong> {mobileNumber}
        </p>
        <p>
          <strong>Service:</strong> {selectedService}
        </p>
        <p>
          <strong>Target date:</strong> {targetDate}
        </p>
      </div>

      <div className="quotation-section text-sm leading-7">
        <h3 className="font-bold">Details</h3>
        {jobDetails.length ? (
          <ul className="job-detail-list job-detail-list-print mt-2">
            {jobDetails.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2">—</p>
        )}
        {notes ? (
          <p className="mt-3">
            <strong>Notes:</strong> {notes}
          </p>
        ) : null}
        <div className="quotation-total mt-4 flex justify-between gap-4">
          <span>Final Estimated Price</span>
          <span>{estimatedPrice}</span>
        </div>
      </div>

      <div className="quotation-section quotation-terms text-sm leading-6">
        <h3 className="text-base font-extrabold">TERMS & CONDITIONS</h3>
        <div className="mt-3 space-y-2">
          <p>
            This quotation is based on the specifications and information provided by the customer
            and is subject to final confirmation before production.
          </p>
          <p>
            Prices may change if there are changes in size, quantity, material, printing method,
            finishing, artwork, or other job specifications.
          </p>
          <p>This quotation is valid for 30 days from the quotation date unless otherwise stated.</p>
        </div>
      </div>

      <div className="quotation-section quotation-acceptance">
        <h3 className="text-base font-extrabold">Customer Conforme</h3>
        <p className="mt-3 text-sm leading-6">
          I have reviewed and accepted the specifications, pricing, and terms stated in this
          quotation.
        </p>
        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          <div>
            <div className="quotation-signature-line" />
            <p className="mt-2 text-sm">Prepared by</p>
            <p className="font-bold">{BUSINESS.proprietor}</p>
            <p className="text-sm">Proprietor, 3J Print Center</p>
          </div>
          <div>
            <div className="quotation-signature-line" />
            <p className="mt-2 text-sm">Customer Conforme</p>
            <div className="quotation-date-line mt-8" />
            <p className="mt-2 text-sm">Date</p>
          </div>
        </div>
      </div>

      <div className="quotation-actions">{actions}</div>
    </article>
  );
}

export function ServiceGuideView() {
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<QuoteFieldErrors>({});
  const [panel, setPanel] = useState<Panel>('form');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [reviewed, setReviewed] = useState<ReviewedQuote | null>(null);
  const [estimateDetailsOpen, setEstimateDetailsOpen] = useState(false);

  const pricingCatalogQuery = api.pricing.getCatalog.useQuery(undefined, {
    staleTime: 60_000,
  });
  const tarpaulinRates = pricingCatalogQuery.data?.tarpaulin ?? DEFAULT_PRICING_CATALOG.tarpaulin;
  const stickerRates = pricingCatalogQuery.data?.stickers ?? DEFAULT_PRICING_CATALOG.stickers;
  const dtfShirtRates = pricingCatalogQuery.data?.dtfShirt ?? DEFAULT_PRICING_CATALOG.dtfShirt;
  const dtfTransferTiers =
    pricingCatalogQuery.data?.dtfTransfer ?? DEFAULT_PRICING_CATALOG.dtfTransfer;
  const sublimationRates =
    pricingCatalogQuery.data?.sublimation ?? DEFAULT_PRICING_CATALOG.sublimation;
  const signageFrameRates =
    pricingCatalogQuery.data?.signageFrame ?? DEFAULT_PRICING_CATALOG.signageFrame;
  const signageSintraRates =
    pricingCatalogQuery.data?.signageSintra ?? DEFAULT_PRICING_CATALOG.signageSintra;
  const pricingSettings =
    pricingCatalogQuery.data?.settings ?? DEFAULT_PRICING_CATALOG.settings;

  const createQuote = api.quoteRequest.create.useMutation({
    onSuccess: () => {
      toast.success('Your quote request has been submitted.');
      setPanel('confirmation');
      setShowQuoteModal(true);
    },
    onError: (mutationError) => {
      const message =
        mutationError.message || 'Your quote could not be saved. Please try again.';
      setError(message);
      toast.error(message);
    },
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
    if (
      key === 'customerName' ||
      key === 'mobileNumber' ||
      key === 'emailAddress' ||
      key === 'notes' ||
      key === 'targetDate' ||
      key === 'consent' ||
      isServiceFieldKey(key)
    ) {
      setFieldErrors((prev) => {
        if (!prev[key as QuoteFieldKey]) return prev;
        const next = { ...prev };
        delete next[key as QuoteFieldKey];
        return next;
      });
    }
  };

  const isDtfTransfer = form.dtfServiceType === 'DTF Transfer Printing — Per Meter';
  const showFront = ['Front', 'Both'].includes(form.dtfPrintSide);
  const showBack = ['Back', 'Both'].includes(form.dtfPrintSide);
  const showCustomSize =
    (showFront && form.dtfFrontPrintSize === 'Custom Size') ||
    (showBack && form.dtfBackPrintSize === 'Custom Size');

  const tarpaulinMethods = useMemo(() => {
    const methods = tarpaulinRates[form.tarpaulinMedia] || {};
    return Object.entries(methods).map(([method, rate]) => ({
      value: method,
      label: `${method} — ₱${rate}/sq.ft`,
    }));
  }, [form.tarpaulinMedia, tarpaulinRates]);

  useEffect(() => {
    if (!form.tarpaulinMedia) return;
    if (!tarpaulinRates[form.tarpaulinMedia]?.[form.tarpaulinMethod]) {
      update('tarpaulinMethod', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.tarpaulinMedia, tarpaulinRates]);

  useEffect(() => {
    if (form.tarpaulinLayoutNeeded !== 'Yes') {
      if (form.tarpaulinSameDesign || form.tarpaulinUniqueLayouts) {
        setForm((prev) => ({
          ...prev,
          tarpaulinSameDesign: '',
          tarpaulinUniqueLayouts: '',
        }));
      }
      return;
    }
    if (form.tarpaulinSameDesign === 'Yes' && form.tarpaulinUniqueLayouts !== '1') {
      update('tarpaulinUniqueLayouts', '1');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.tarpaulinLayoutNeeded, form.tarpaulinSameDesign]);

  const liveEstimate = useMemo(() => {
    if (!selectedService) {
      return { price: 'Awaiting estimate', summary: '' };
    }

    if (selectedService === 'DTF Printing') {
      if (isDtfTransfer) {
        const result = calculateDtfTransfer(
          Number(form.dtfTransferMeters),
          dtfTransferTiers,
          pricingSettings.dtfTransferSpecialMinMeters
        );
        return {
          price: result.special
            ? 'Please contact Three J Print Center for special volume pricing.'
            : result.valid
              ? formatPeso(result.total)
              : 'Awaiting estimate',
          summary: result.summary,
        };
      }
      const result = calculateDtfShirt({
        printSide: form.dtfPrintSide,
        frontSize: form.dtfFrontPrintSize,
        backSize: form.dtfBackPrintSize,
        quantity: Number(form.dtfQuantity),
        shoulderName: form.dtfShoulderName === 'Shoulder Name',
        rates: dtfShirtRates,
        shoulderNameFee: pricingSettings.dtfShoulderNameFee,
        volumeTier1MinPlacements: pricingSettings.dtfShirtVolumeTier1MinPlacements,
        volumeTier1Percent: pricingSettings.dtfShirtVolumeTier1Percent,
        volumeTier2MinPlacements: pricingSettings.dtfShirtVolumeTier2MinPlacements,
        volumeTier2Percent: pricingSettings.dtfShirtVolumeTier2Percent,
        volumeTier3MinPlacements: pricingSettings.dtfShirtVolumeTier3MinPlacements,
        volumeTier3Percent: pricingSettings.dtfShirtVolumeTier3Percent,
      });
      return {
        price: result.valid ? formatPeso(result.finalTotal) : 'Awaiting estimate',
        summary: result.summary,
      };
    }

    if (selectedService === 'Full Sublimation') {
      const result = calculateSublimation({
        productType: form.sublimationProductType,
        quantity: Number(form.sublimationQuantity),
        oversized: Number(form.sublimationOversized) || 0,
        fabricWeight: form.sublimationFabricWeight,
        designNeeded: form.sublimationDesignNeeded,
        sameDesign: form.sublimationSameDesign,
        uniqueLayouts: Number(form.sublimationUniqueLayouts) || 0,
        rates: sublimationRates,
        fabric200GsmAddon: pricingSettings.sublimationFabric200GsmAddon,
        layoutFeePerDesign: pricingSettings.sublimationLayoutFeePerDesign,
        oversizedAddon: pricingSettings.sublimationOversizedAddon,
        qtyTier10: pricingSettings.sublimationQtyTier10,
        qtyTier20: pricingSettings.sublimationQtyTier20,
        qtyTier50: pricingSettings.sublimationQtyTier50,
        discountAt50Percent: pricingSettings.sublimationDiscountAt50Percent,
        benefitBelow10: pricingSettings.sublimationBenefitBelow10,
        benefitFrom10: pricingSettings.sublimationBenefitFrom10,
        benefitFrom20: pricingSettings.sublimationBenefitFrom20,
      });
      return {
        price: result.valid ? formatPeso(result.total) : 'Awaiting estimate',
        summary: result.valid ? result.summary : result.summary,
      };
    }

    if (selectedService === 'Tarpaulin') {
      const result = calculateTarpaulin({
        width: Number(form.tarpaulinWidth),
        height: Number(form.tarpaulinHeight),
        quantity: Number(form.tarpaulinQuantity),
        media: form.tarpaulinMedia,
        method: form.tarpaulinMethod,
        layoutNeeded: form.tarpaulinLayoutNeeded,
        sameDesign: form.tarpaulinSameDesign,
        uniqueLayouts: Number(form.tarpaulinUniqueLayouts) || 0,
        eyeletOption: form.tarpaulinEyeletOption,
        edgeFinishing: form.tarpaulinEdgeFinishing,
        rates: tarpaulinRates,
        minimumPrintingCharge: pricingSettings.tarpaulinMinimumPrintingCharge,
        layoutFeePerLayout: pricingSettings.tarpaulinLayoutFeePerLayout,
        volumeTier1MinSqFt: pricingSettings.tarpaulinVolumeTier1MinSqFt,
        volumeTier1Percent: pricingSettings.tarpaulinVolumeTier1Percent,
        volumeTier2MinSqFt: pricingSettings.tarpaulinVolumeTier2MinSqFt,
        volumeTier2Percent: pricingSettings.tarpaulinVolumeTier2Percent,
        volumeTier3MinSqFt: pricingSettings.tarpaulinVolumeTier3MinSqFt,
        volumeTier3Percent: pricingSettings.tarpaulinVolumeTier3Percent,
      });
      return {
        price: result.valid ? formatPeso(result.finalTotal) : 'Awaiting estimate',
        summary: result.summary,
      };
    }

    if (selectedService === 'Stickers') {
      const result = calculateSticker({
        type: form.stickerType,
        lamination: form.stickerLamination,
        unit: form.stickerUnit,
        width: Number(form.stickersWidth),
        height: Number(form.stickersHeight),
        quantity: Number(form.stickersQuantity),
        rates: stickerRates,
        minimumJobCharge: pricingSettings.stickersMinimumJobCharge,
      });
      return {
        price: result.valid ? formatPeso(result.finalStickerPrice, 2) : 'Awaiting estimate',
        summary: result.summary,
      };
    }

    const result = calculateSignage({
      type: form.signageType,
      unit: form.signageUnit,
      width: Number(form.signageWidth),
      height: Number(form.signageHeight),
      quantity: Number(form.signageQuantity),
      faceMaterial: form.panaflexFaceMaterial,
      printingMethod: form.panaflexPrintingMethod,
      blackoutMethod: form.blackoutPrintingMethod,
      thickness: form.sintraThickness,
      printSide: form.sintraPrintSide,
      lamination: form.sintraLamination,
      cutStyle: form.sintraCutStyle,
      display: form.sintraDisplayOption,
      frameRates: signageFrameRates,
      sintraRates: signageSintraRates,
      sintraLaminationPerSqIn: pricingSettings.signageSintraLaminationPerSqIn,
      sintraStandPerSqIn: pricingSettings.signageSintraStandPerSqIn,
    });
    return {
      price: result.valid ? formatPeso(result.finalPrice, 2) : 'Awaiting estimate',
      summary: result.summary,
    };
  }, [
    selectedService,
    form,
    isDtfTransfer,
    tarpaulinRates,
    stickerRates,
    dtfShirtRates,
    dtfTransferTiers,
    sublimationRates,
    signageFrameRates,
    signageSintraRates,
    pricingSettings,
  ]);

  const chooseService = (service: ServiceId) => {
    setSelectedService(service);
    setPanel('form');
    setReviewed(null);
    setShowQuoteModal(false);
    setEstimateDetailsOpen(false);
    setError('');
    setFieldErrors({});
    window.setTimeout(() => {
      document.getElementById('quote-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const changeService = () => {
    setPanel('form');
    setReviewed(null);
    setShowQuoteModal(false);
    setError('');
    window.setTimeout(() => {
      document.getElementById('service-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const selectedServiceMeta = SERVICES.find((service) => service.id === selectedService);
  const isReviewing = panel === 'review' || panel === 'confirmation';

  const handleCalculate = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});

    if (!selectedService) {
      setError('Please select a printing service before requesting a quote.');
      return;
    }

    const customerValidation = validateCustomerFields({
      customerName: form.customerName,
      mobileNumber: form.mobileNumber,
      emailAddress: form.emailAddress,
      notes: form.notes,
      targetDate: form.targetDate,
      consent: form.consent,
    });

    if (!customerValidation.ok) {
      setFieldErrors(customerValidation.errors);
      const firstErrorKey = CUSTOMER_FIELD_ORDER.find((key) => customerValidation.errors[key]);
      if (firstErrorKey) scrollToField(firstErrorKey);
      return;
    }

    const serviceValidation = validateServiceFields(selectedService, form, {
      tarpaulin: tarpaulinRates,
      stickers: stickerRates,
      dtfTransferSpecialMinMeters: pricingSettings.dtfTransferSpecialMinMeters,
      sublimationLayoutFeeBelowQty: pricingSettings.sublimationQtyTier10,
    });
    if (!serviceValidation.ok) {
      setFieldErrors(serviceValidation.errors);
      const firstErrorKey = SERVICE_FIELD_ORDER[selectedService].find(
        (key) => serviceValidation.errors[key]
      );
      if (firstErrorKey) scrollToField(firstErrorKey);
      return;
    }

    const record = {
      ...form,
      customer_name: form.customerName.trim(),
      mobile_number: form.mobileNumber.trim(),
      facebook_messenger_name: form.messengerName.trim(),
      email_address: form.emailAddress.trim(),
      consent_given: form.consent,
      selected_service: selectedService,
      notes: form.notes.trim(),
      target_completion_date: form.targetDate,
      estimated_price: liveEstimate.price,
      submitted_at: new Date().toISOString(),
      estimate_summary: liveEstimate.summary,
    };

    setReviewed({ estimatedPrice: liveEstimate.price, record });
    setPanel('review');
  };

  const confirmSubmit = () => {
    if (!reviewed || !selectedService || createQuote.isLoading) return;

    createQuote.mutate({
      customerName: form.customerName.trim(),
      mobileNumber: form.mobileNumber.trim(),
      facebookMessengerName: form.messengerName.trim() || undefined,
      emailAddress: form.emailAddress.trim() || undefined,
      consentGiven: true,
      selectedService,
      estimatedPrice: reviewed.estimatedPrice,
      estimateSummary: String(reviewed.record.estimate_summary || liveEstimate.summary),
      notes: form.notes.trim(),
      targetCompletionDate: form.targetDate,
      payload: reviewed.record,
    });
  };

  const startAnother = () => {
    setForm(INITIAL_FORM);
    setSelectedService(null);
    setReviewed(null);
    setPanel('form');
    setShowQuoteModal(false);
    setError('');
    setFieldErrors({});
  };

  const isSintra = form.signageType === 'Sticker on Sintra Board';
  const isPanaflex =
    form.signageType === 'Panaflex — Non-Lighted' || form.signageType === 'Panaflex — Lighted';
  const isBlackout = form.signageType === 'Blackout Tarp Signage — With Frame';
  const showInstall =
    !isSintra && form.signageFulfillment === 'Delivery / Installation Package';
  const showSublimationLayout =
    form.sublimationDesignNeeded === 'Yes' &&
    Number(form.sublimationQuantity) < pricingSettings.sublimationQtyTier10;
  const jobDetails = useMemo(
    () => getJobDetailRows(selectedService, form),
    [selectedService, form],
  );
  const estimateLines = useMemo(
    () => parseEstimateLines(liveEstimate.summary),
    [liveEstimate.summary],
  );
  const estimateNote = getEstimateNote(selectedService, isDtfTransfer, pricingSettings);

  return (
    <div className="service-guide-page">
      <div className="print-shell">
        <main className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 pt-10 sm:px-8 sm:pt-14">
          <section className="max-w-2xl">
            <h1 className="text-xl font-bold text-[#ffd52e]">Printing Made Easy</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#d9d4ca]">
              Choose a service, share your print requirements, and send a clear quotation request.
            </p>
          </section>

          <div className={cn('desktop-grid mt-10', isReviewing && 'is-reviewing')}>
            <section>
              {isReviewing && selectedServiceMeta ? (
                <>
                  <div className="mb-5 border-b border-white/20 pb-3">
                    <h2 className="text-2xl font-bold text-[#f5f1e8]">Selected service</h2>
                  </div>

                  <div className="selected-service-card">
                    <span className="number block">
                      {selectedServiceMeta.number} / SERVICE
                    </span>
                    <p className="mt-2 text-xl font-extrabold">{selectedServiceMeta.label}</p>
                    <p className="mt-2 text-sm leading-6 text-[#d9d4ca]">
                      Your quote is based on this service. Change it only if you want to start a
                      different request.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="action-button action-ghost mt-4 w-full text-base"
                    onClick={changeService}
                  >
                    Change Service
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-5 flex items-end justify-between border-b border-white/20 pb-3">
                    <h2 className="text-2xl font-bold text-[#f5f1e8]">Select a service</h2>
                    <span className="mono-label text-xs font-bold text-[#bdb8ae]">05 OPTIONS</span>
                  </div>

                  <div className="space-y-3" id="service-list">
                    {SERVICES.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        className={cn(
                          'service-card',
                          selectedService === service.id && 'is-selected'
                        )}
                        aria-pressed={selectedService === service.id}
                        onClick={() => chooseService(service.id)}
                      >
                        <span>
                          <span className="number block">{service.number} / SERVICE</span>
                          <span className="mt-2 block text-xl font-extrabold">
                            {service.label}
                          </span>
                        </span>
                        <ArrowUpRight className="arrow h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </section>

            <section id="quote-area" className="mt-10 lg:mt-0" aria-live="polite">
              {panel === 'form' ? (
                <div className="quote-panel p-5 sm:p-7">
                  <p className="mono-label text-xs font-bold text-[#ffd52e]">QUOTATION REQUEST</p>
                  <h2 className="mt-2 text-2xl font-extrabold">Get a Quote</h2>
                  <div className="mt-5 border-y border-white/15 py-3">
                    <p className="mono-label text-xs text-[#bdb8ae]">SELECTED SERVICE</p>
                    <p className="mt-1 text-lg font-bold text-[#ffd52e]">
                      {selectedService ?? 'Select a service to begin'}
                    </p>
                  </div>

                  <form className="mt-6 space-y-5" onSubmit={handleCalculate} noValidate>
                    <div data-field="customerName">
                      <Field label="Customer Name" error={fieldErrors.customerName}>
                        <input
                          className="field-input"
                          value={form.customerName}
                          onChange={(e) => update('customerName', e.target.value)}
                          aria-invalid={Boolean(fieldErrors.customerName)}
                        />
                      </Field>
                    </div>
                    <div data-field="mobileNumber">
                      <Field label="Mobile Number" error={fieldErrors.mobileNumber}>
                        <input
                          className="field-input"
                          type="tel"
                          inputMode="tel"
                          placeholder="09171234567"
                          value={form.mobileNumber}
                          onChange={(e) => update('mobileNumber', e.target.value)}
                          aria-invalid={Boolean(fieldErrors.mobileNumber)}
                        />
                      </Field>
                    </div>
                    <Field label="Facebook / Messenger Name (optional)">
                      <input
                        className="field-input"
                        value={form.messengerName}
                        onChange={(e) => update('messengerName', e.target.value)}
                      />
                    </Field>
                    <div data-field="emailAddress">
                      <Field label="Email Address (optional)" error={fieldErrors.emailAddress}>
                        <input
                          className="field-input"
                          type="email"
                          value={form.emailAddress}
                          onChange={(e) => update('emailAddress', e.target.value)}
                          aria-invalid={Boolean(fieldErrors.emailAddress)}
                        />
                      </Field>
                    </div>

                    {selectedService === 'DTF Printing' ? (
                      <div className="space-y-5" data-service-fields="DTF Printing">
                        <div data-field="dtfServiceType">
                          <Field label="What DTF service do you need?" error={fieldErrors.dtfServiceType}>
                            <select
                              className="field-input"
                              value={form.dtfServiceType}
                              onChange={(e) => update('dtfServiceType', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.dtfServiceType)}
                            >
                              <option value="">Choose one</option>
                              <option value="DTF Shirt Printing">
                                DTF Shirt Printing — DTF print applied to shirts.
                              </option>
                              <option value="DTF Transfer Printing — Per Meter">
                                DTF Transfer Printing — Per Meter — Printed DTF transfer film only.
                                Shirt and heat pressing not included.
                              </option>
                            </select>
                          </Field>
                        </div>

                        {isDtfTransfer ? (
                          <>
                            <div data-field="dtfTransferMeters">
                              <Field label="Number of Meters" error={fieldErrors.dtfTransferMeters}>
                                <input
                                  className="field-input"
                                  type="number"
                                  min={1}
                                  step={1}
                                  value={form.dtfTransferMeters}
                                  onChange={(e) => update('dtfTransferMeters', e.target.value)}
                                  aria-invalid={Boolean(fieldErrors.dtfTransferMeters)}
                                />
                              </Field>
                            </div>
                            <div data-field="dtfTransferArtworkReady">
                              <Field
                                label="Artwork Ready?"
                                error={fieldErrors.dtfTransferArtworkReady}
                              >
                                <select
                                  className="field-input"
                                  value={form.dtfTransferArtworkReady}
                                  onChange={(e) =>
                                    update('dtfTransferArtworkReady', e.target.value)
                                  }
                                  aria-invalid={Boolean(fieldErrors.dtfTransferArtworkReady)}
                                >
                                  <option value="">Choose one</option>
                                  <option>Yes</option>
                                  <option>No</option>
                                </select>
                              </Field>
                            </div>
                            <div className="notice-panel p-4 text-sm leading-6">
                              Standard DTF transfer size per meter: 22 × 39 inches.
                            </div>
                          </>
                        ) : (
                          <>
                            <div data-field="dtfPrintSide">
                              <CustomSelect
                                id="dtf-print-side"
                                label="Print Side"
                                value={form.dtfPrintSide}
                                onChange={(value) => update('dtfPrintSide', value)}
                                options={[
                                  { value: 'Front', label: 'Front' },
                                  { value: 'Back', label: 'Back' },
                                  { value: 'Both', label: 'Both' },
                                ]}
                                error={fieldErrors.dtfPrintSide}
                              />
                            </div>
                            {showFront ? (
                              <div data-field="dtfFrontPrintSize">
                                <Field
                                  label="Front Print Size"
                                  error={fieldErrors.dtfFrontPrintSize}
                                >
                                  <select
                                    className="field-input"
                                    value={form.dtfFrontPrintSize}
                                    onChange={(e) => update('dtfFrontPrintSize', e.target.value)}
                                    aria-invalid={Boolean(fieldErrors.dtfFrontPrintSize)}
                                  >
                                    <option value="">Choose one</option>
                                    <option>A6</option>
                                    <option>A5</option>
                                    <option>A4</option>
                                    <option>A3</option>
                                    <option>Custom Size</option>
                                  </select>
                                </Field>
                              </div>
                            ) : null}
                            {showBack ? (
                              <div data-field="dtfBackPrintSize">
                                <Field
                                  label="Back Print Size"
                                  error={fieldErrors.dtfBackPrintSize}
                                >
                                  <select
                                    className="field-input"
                                    value={form.dtfBackPrintSize}
                                    onChange={(e) => update('dtfBackPrintSize', e.target.value)}
                                    aria-invalid={Boolean(fieldErrors.dtfBackPrintSize)}
                                  >
                                    <option value="">Choose one</option>
                                    <option>A6</option>
                                    <option>A5</option>
                                    <option>A4</option>
                                    <option>A3</option>
                                    <option>Custom Size</option>
                                  </select>
                                </Field>
                              </div>
                            ) : null}
                            {showCustomSize ? (
                              <div className="grid gap-5 sm:grid-cols-2">
                                <div data-field="dtfCustomWidth">
                                  <Field
                                    label="Custom Width (in)"
                                    error={fieldErrors.dtfCustomWidth}
                                  >
                                    <input
                                      className="field-input"
                                      type="number"
                                      min={0}
                                      step="any"
                                      value={form.dtfCustomWidth}
                                      onChange={(e) => update('dtfCustomWidth', e.target.value)}
                                      aria-invalid={Boolean(fieldErrors.dtfCustomWidth)}
                                    />
                                  </Field>
                                </div>
                                <div data-field="dtfCustomHeight">
                                  <Field
                                    label="Custom Height (in)"
                                    error={fieldErrors.dtfCustomHeight}
                                  >
                                    <input
                                      className="field-input"
                                      type="number"
                                      min={0}
                                      step="any"
                                      value={form.dtfCustomHeight}
                                      onChange={(e) => update('dtfCustomHeight', e.target.value)}
                                      aria-invalid={Boolean(fieldErrors.dtfCustomHeight)}
                                    />
                                  </Field>
                                </div>
                              </div>
                            ) : null}
                            <div data-field="dtfQuantity">
                              <Field label="Quantity" error={fieldErrors.dtfQuantity}>
                                <input
                                  className="field-input"
                                  type="number"
                                  min={1}
                                  step={1}
                                  value={form.dtfQuantity}
                                  onChange={(e) => update('dtfQuantity', e.target.value)}
                                  aria-invalid={Boolean(fieldErrors.dtfQuantity)}
                                />
                              </Field>
                            </div>
                            <Field label="Additional Placement (optional)">
                              <select
                                className="field-input"
                                value={form.dtfShoulderName}
                                onChange={(e) => update('dtfShoulderName', e.target.value)}
                              >
                                <option value="None">None</option>
                                <option value="Shoulder Name">Shoulder Name</option>
                              </select>
                            </Field>
                            <div data-field="dtfCustomerProvidesShirt">
                              <Field
                                label="Customer provides shirt?"
                                error={fieldErrors.dtfCustomerProvidesShirt}
                              >
                                <select
                                  className="field-input"
                                  value={form.dtfCustomerProvidesShirt}
                                  onChange={(e) =>
                                    update('dtfCustomerProvidesShirt', e.target.value)
                                  }
                                  aria-invalid={Boolean(fieldErrors.dtfCustomerProvidesShirt)}
                                >
                                  <option value="">Choose one</option>
                                  <option>Yes</option>
                                  <option>No</option>
                                </select>
                              </Field>
                            </div>
                            <div data-field="dtfArtworkReady">
                              <Field label="Artwork ready?" error={fieldErrors.dtfArtworkReady}>
                                <select
                                  className="field-input"
                                  value={form.dtfArtworkReady}
                                  onChange={(e) => update('dtfArtworkReady', e.target.value)}
                                  aria-invalid={Boolean(fieldErrors.dtfArtworkReady)}
                                >
                                  <option value="">Choose one</option>
                                  <option>Yes</option>
                                  <option>No</option>
                                </select>
                              </Field>
                            </div>
                          </>
                        )}
                      </div>
                    ) : null}

                    {selectedService === 'Full Sublimation' ? (
                      <div className="space-y-5" data-service-fields="Full Sublimation">
                        <div data-field="sublimationProductType">
                          <Field
                            label="Product Type"
                            error={fieldErrors.sublimationProductType}
                          >
                            <select
                              className="field-input"
                              value={form.sublimationProductType}
                              onChange={(e) => update('sublimationProductType', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.sublimationProductType)}
                            >
                              <option value="">Choose one</option>
                              {Object.entries(sublimationRates).map(([product, rate]) => (
                                <option key={product} value={product}>
                                  {product} — PHP {rate}
                                </option>
                              ))}
                            </select>
                          </Field>
                        </div>
                        <div data-field="sublimationQuantity">
                          <Field label="Quantity" error={fieldErrors.sublimationQuantity}>
                            <input
                              className="field-input"
                              type="number"
                              min={6}
                              step={1}
                              value={form.sublimationQuantity}
                              onChange={(e) => update('sublimationQuantity', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.sublimationQuantity)}
                            />
                          </Field>
                        </div>
                        <div data-field="sublimationOversized">
                          <Field
                            label="Estimated Quantity of 4XL–6XL"
                            error={fieldErrors.sublimationOversized}
                          >
                            <input
                              className="field-input"
                              type="number"
                              min={0}
                              step={1}
                              value={form.sublimationOversized}
                              onChange={(e) => update('sublimationOversized', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.sublimationOversized)}
                            />
                          </Field>
                          <p className="mt-2 text-sm leading-6 text-[#bdb8ae]">
                            Exact size breakdown is not required for quotation. Please estimate how
                            many pieces may be 4XL–6XL. Final price may be adjusted once actual
                            sizes are confirmed.
                          </p>
                        </div>
                        <div data-field="sublimationFabricWeight">
                          <Field
                            label="Fabric Weight"
                            error={fieldErrors.sublimationFabricWeight}
                          >
                            <select
                              className="field-input"
                              value={form.sublimationFabricWeight}
                              onChange={(e) => update('sublimationFabricWeight', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.sublimationFabricWeight)}
                            >
                              <option value="">Choose one</option>
                              <option value="180 GSM">180 GSM — included in base price</option>
                              <option value="200 GSM">
                                200 GSM — add PHP {pricingSettings.sublimationFabric200GsmAddon} per
                                piece/set
                              </option>
                            </select>
                          </Field>
                        </div>
                        <div data-field="sublimationPersonalization">
                          <Field
                            label="Name / Number Personalization Needed?"
                            error={fieldErrors.sublimationPersonalization}
                          >
                            <select
                              className="field-input"
                              value={form.sublimationPersonalization}
                              onChange={(e) => update('sublimationPersonalization', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.sublimationPersonalization)}
                            >
                              <option value="">Choose one</option>
                              <option>Yes</option>
                              <option>No</option>
                            </select>
                          </Field>
                        </div>
                        <div data-field="sublimationDesignNeeded">
                          <Field
                            label="Do you need Three J Print Center to create the design/layout?"
                            error={fieldErrors.sublimationDesignNeeded}
                          >
                            <select
                              className="field-input"
                              value={form.sublimationDesignNeeded}
                              onChange={(e) => update('sublimationDesignNeeded', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.sublimationDesignNeeded)}
                            >
                              <option value="">Choose one</option>
                              <option>Yes</option>
                              <option>No — Artwork Ready</option>
                            </select>
                          </Field>
                        </div>
                        {showSublimationLayout ? (
                          <>
                            <div data-field="sublimationSameDesign">
                              <Field
                                label="Same design for all pieces?"
                                error={fieldErrors.sublimationSameDesign}
                              >
                                <select
                                  className="field-input"
                                  value={form.sublimationSameDesign}
                                  onChange={(e) => update('sublimationSameDesign', e.target.value)}
                                  aria-invalid={Boolean(fieldErrors.sublimationSameDesign)}
                                >
                                  <option value="">Choose one</option>
                                  <option>Yes</option>
                                  <option>No</option>
                                </select>
                              </Field>
                            </div>
                            {form.sublimationSameDesign === 'No' ? (
                              <div data-field="sublimationUniqueLayouts">
                                <Field
                                  label="Number of Unique Designs / Layouts"
                                  error={fieldErrors.sublimationUniqueLayouts}
                                >
                                  <input
                                    className="field-input"
                                    type="number"
                                    min={1}
                                    max={
                                      Number(form.sublimationQuantity) > 0
                                        ? Number(form.sublimationQuantity)
                                        : undefined
                                    }
                                    step={1}
                                    value={form.sublimationUniqueLayouts}
                                    onChange={(e) =>
                                      update('sublimationUniqueLayouts', e.target.value)
                                    }
                                    aria-invalid={Boolean(fieldErrors.sublimationUniqueLayouts)}
                                  />
                                </Field>
                              </div>
                            ) : null}
                          </>
                        ) : null}
                        <div data-field="sublimationRush">
                          <Field label="Rush Order?" error={fieldErrors.sublimationRush}>
                            <select
                              className="field-input"
                              value={form.sublimationRush}
                              onChange={(e) => update('sublimationRush', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.sublimationRush)}
                            >
                              <option value="">Choose one</option>
                              <option>No</option>
                              <option>Yes</option>
                            </select>
                            {form.sublimationRush === 'Yes' ? (
                              <p className="mt-2 text-sm text-[#ffd7d5]">
                                Rush charge is subject to final quotation and production availability.
                              </p>
                            ) : null}
                          </Field>
                        </div>
                      </div>
                    ) : null}

                    {selectedService === 'Tarpaulin' ? (
                      <div className="space-y-5" data-service-fields="Tarpaulin">
                        <div data-field="tarpaulinWidth">
                          <Field label="Width (ft)" error={fieldErrors.tarpaulinWidth}>
                            <input
                              className="field-input"
                              type="number"
                              min={0}
                              step="any"
                              value={form.tarpaulinWidth}
                              onChange={(e) => update('tarpaulinWidth', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.tarpaulinWidth)}
                            />
                          </Field>
                        </div>
                        <div data-field="tarpaulinHeight">
                          <Field label="Height (ft)" error={fieldErrors.tarpaulinHeight}>
                            <input
                              className="field-input"
                              type="number"
                              min={0}
                              step="any"
                              value={form.tarpaulinHeight}
                              onChange={(e) => update('tarpaulinHeight', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.tarpaulinHeight)}
                            />
                          </Field>
                        </div>
                        <div data-field="tarpaulinMedia">
                          <CustomSelect
                            id="tarpaulin-media"
                            label="Printing Media / Material"
                            value={form.tarpaulinMedia}
                            onChange={(value) => update('tarpaulinMedia', value)}
                            options={Object.keys(tarpaulinRates).map((media) => ({
                              value: media,
                              label: media,
                            }))}
                            error={fieldErrors.tarpaulinMedia}
                          />
                        </div>
                        {tarpaulinMethods.length ? (
                          <div data-field="tarpaulinMethod">
                            <CustomSelect
                              id="tarpaulin-method"
                              label="Printing Method"
                              value={form.tarpaulinMethod}
                              onChange={(value) => update('tarpaulinMethod', value)}
                              options={tarpaulinMethods}
                              error={fieldErrors.tarpaulinMethod}
                            />
                          </div>
                        ) : null}
                        <div data-field="tarpaulinQuantity">
                          <Field label="Quantity" error={fieldErrors.tarpaulinQuantity}>
                            <input
                              className="field-input"
                              type="number"
                              min={1}
                              step={1}
                              value={form.tarpaulinQuantity}
                              onChange={(e) => update('tarpaulinQuantity', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.tarpaulinQuantity)}
                            />
                          </Field>
                        </div>
                        <div data-field="tarpaulinLayoutNeeded">
                          <Field label="Layout needed?" error={fieldErrors.tarpaulinLayoutNeeded}>
                            <select
                              className="field-input"
                              value={form.tarpaulinLayoutNeeded}
                              onChange={(e) => update('tarpaulinLayoutNeeded', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.tarpaulinLayoutNeeded)}
                            >
                              <option value="">Choose one</option>
                              <option>Yes</option>
                              <option>No</option>
                            </select>
                          </Field>
                        </div>
                        {form.tarpaulinLayoutNeeded === 'Yes' ? (
                          <>
                            <div data-field="tarpaulinSameDesign">
                              <Field
                                label="Same design for all pieces?"
                                error={fieldErrors.tarpaulinSameDesign}
                              >
                                <select
                                  className="field-input"
                                  value={form.tarpaulinSameDesign}
                                  onChange={(e) => update('tarpaulinSameDesign', e.target.value)}
                                  aria-invalid={Boolean(fieldErrors.tarpaulinSameDesign)}
                                >
                                  <option value="">Choose one</option>
                                  <option>Yes</option>
                                  <option>No</option>
                                </select>
                              </Field>
                            </div>
                            {form.tarpaulinSameDesign === 'No' ? (
                              <div data-field="tarpaulinUniqueLayouts">
                                <Field
                                  label="Number of Unique Designs / Layouts"
                                  error={fieldErrors.tarpaulinUniqueLayouts}
                                >
                                  <input
                                    className="field-input"
                                    type="number"
                                    min={1}
                                    max={
                                      Number(form.tarpaulinQuantity) > 0
                                        ? Number(form.tarpaulinQuantity)
                                        : undefined
                                    }
                                    step={1}
                                    value={form.tarpaulinUniqueLayouts}
                                    onChange={(e) =>
                                      update('tarpaulinUniqueLayouts', e.target.value)
                                    }
                                    aria-invalid={Boolean(fieldErrors.tarpaulinUniqueLayouts)}
                                  />
                                </Field>
                              </div>
                            ) : null}
                          </>
                        ) : null}
                        <div data-field="tarpaulinEyeletsFinishing">
                          <Field
                            label="Eyelets / finishing needed?"
                            error={fieldErrors.tarpaulinEyeletsFinishing}
                          >
                            <select
                              className="field-input"
                              value={form.tarpaulinEyeletsFinishing}
                              onChange={(e) => update('tarpaulinEyeletsFinishing', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.tarpaulinEyeletsFinishing)}
                            >
                              <option value="">Choose one</option>
                              <option>Yes</option>
                              <option>No</option>
                            </select>
                          </Field>
                        </div>
                        <div data-field="tarpaulinEyeletOption">
                          <Field label="Eyelet Option" error={fieldErrors.tarpaulinEyeletOption}>
                            <select
                              className="field-input"
                              value={form.tarpaulinEyeletOption}
                              onChange={(e) => update('tarpaulinEyeletOption', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.tarpaulinEyeletOption)}
                            >
                              <option value="">Choose one</option>
                              <option>4 Corners</option>
                              <option>Top Only</option>
                              <option>No Eyelets</option>
                            </select>
                          </Field>
                        </div>
                        <div data-field="tarpaulinEdgeFinishing">
                          <Field label="Edge Finishing" error={fieldErrors.tarpaulinEdgeFinishing}>
                            <select
                              className="field-input"
                              value={form.tarpaulinEdgeFinishing}
                              onChange={(e) => update('tarpaulinEdgeFinishing', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.tarpaulinEdgeFinishing)}
                            >
                              <option value="">Choose one</option>
                              <option>With Border</option>
                              <option>Cut to Size</option>
                            </select>
                          </Field>
                        </div>
                      </div>
                    ) : null}

                    {selectedService === 'Stickers' ? (
                      <div className="space-y-5" data-service-fields="Stickers">
                        <div data-field="stickerType">
                          <CustomSelect
                            id="sticker-type"
                            label="Sticker Type"
                            value={form.stickerType}
                            onChange={(value) => update('stickerType', value)}
                            options={Object.keys(stickerRates).map((type) => ({
                              value: type,
                              label: type,
                            }))}
                            error={fieldErrors.stickerType}
                          />
                        </div>
                        <div data-field="stickerCutOutput">
                          <CustomSelect
                            id="sticker-cut-output"
                            label="Cut / Output Requirement"
                            value={form.stickerCutOutput}
                            onChange={(value) => update('stickerCutOutput', value)}
                            options={[
                              {
                                value: 'Cut to Size / Straight Cut',
                                label: 'Cut to Size / Straight Cut',
                              },
                              { value: 'Contour / Shape Cut', label: 'Contour / Shape Cut' },
                              {
                                value: 'Print Only — No Cutting',
                                label: 'Print Only — No Cutting',
                              },
                              { value: 'Not Sure', label: 'Not Sure' },
                            ]}
                            error={fieldErrors.stickerCutOutput}
                          />
                        </div>
                        <div data-field="stickerLamination">
                          <CustomSelect
                            id="sticker-lamination"
                            label="Lamination"
                            value={form.stickerLamination}
                            onChange={(value) => update('stickerLamination', value)}
                            options={[
                              { value: 'Non-Laminated', label: 'Non-Laminated' },
                              { value: 'Laminated', label: 'Laminated' },
                              { value: 'Not Sure', label: 'Not Sure' },
                            ]}
                            error={fieldErrors.stickerLamination}
                          />
                        </div>
                        <div data-field="stickerApplication">
                          <CustomSelect
                            id="sticker-application"
                            label="Application / Use"
                            value={form.stickerApplication}
                            onChange={(value) => update('stickerApplication', value)}
                            options={[
                              { value: 'Indoor', label: 'Indoor' },
                              { value: 'Outdoor', label: 'Outdoor' },
                              { value: 'Vehicle / Automotive', label: 'Vehicle / Automotive' },
                              { value: 'Window / Glass', label: 'Window / Glass' },
                              { value: 'Other / Not Sure', label: 'Other / Not Sure' },
                            ]}
                            error={fieldErrors.stickerApplication}
                          />
                        </div>
                        <div data-field="stickerUnit">
                          <CustomSelect
                            id="sticker-unit"
                            label="Measurement unit"
                            value={form.stickerUnit}
                            onChange={(value) => update('stickerUnit', value)}
                            options={[
                              { value: 'Inches', label: 'Inches' },
                              { value: 'Centimeters', label: 'Centimeters' },
                              { value: 'Feet', label: 'Feet' },
                            ]}
                            error={fieldErrors.stickerUnit}
                          />
                        </div>
                        <div data-field="stickersWidth">
                          <Field label="Width" error={fieldErrors.stickersWidth}>
                            <input
                              className="field-input"
                              type="number"
                              min={0}
                              step="any"
                              value={form.stickersWidth}
                              onChange={(e) => update('stickersWidth', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.stickersWidth)}
                            />
                          </Field>
                        </div>
                        <div data-field="stickersHeight">
                          <Field label="Height" error={fieldErrors.stickersHeight}>
                            <input
                              className="field-input"
                              type="number"
                              min={0}
                              step="any"
                              value={form.stickersHeight}
                              onChange={(e) => update('stickersHeight', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.stickersHeight)}
                            />
                          </Field>
                        </div>
                        <div data-field="stickersQuantity">
                          <Field label="Quantity" error={fieldErrors.stickersQuantity}>
                            <input
                              className="field-input"
                              type="number"
                              min={1}
                              step={1}
                              value={form.stickersQuantity}
                              onChange={(e) => update('stickersQuantity', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.stickersQuantity)}
                            />
                          </Field>
                        </div>
                      </div>
                    ) : null}

                    {selectedService === 'Signage' ? (
                      <div className="space-y-5" data-service-fields="Signage">
                        <div data-field="signageType">
                          <CustomSelect
                            id="signage-type"
                            label="Signage Type"
                            value={form.signageType}
                            onChange={(value) => update('signageType', value)}
                            options={[
                              {
                                value: 'Panaflex — Non-Lighted',
                                label: 'Panaflex — Non-Lighted',
                              },
                              { value: 'Panaflex — Lighted', label: 'Panaflex — Lighted' },
                              {
                                value: 'Blackout Tarp Signage — With Frame',
                                label: 'Blackout Tarp Signage — With Frame',
                              },
                              {
                                value: 'Sticker on Sintra Board',
                                label: 'Sticker on Sintra Board',
                              },
                            ]}
                            error={fieldErrors.signageType}
                          />
                        </div>

                        {isSintra ? (
                          <>
                            <div data-field="sintraThickness">
                              <CustomSelect
                                id="sintra-thickness"
                                label="Sintra Thickness"
                                value={form.sintraThickness}
                                onChange={(value) => update('sintraThickness', value)}
                                options={[
                                  { value: '3mm', label: '3mm' },
                                  { value: '5mm', label: '5mm' },
                                ]}
                                error={fieldErrors.sintraThickness}
                              />
                            </div>
                            <div data-field="sintraPrintSide">
                              <CustomSelect
                                id="sintra-print-side"
                                label="Print Side"
                                value={form.sintraPrintSide}
                                onChange={(value) => update('sintraPrintSide', value)}
                                options={[
                                  { value: 'Front Only', label: 'Front Only' },
                                  { value: 'Back to Back', label: 'Back to Back' },
                                ]}
                                error={fieldErrors.sintraPrintSide}
                              />
                            </div>
                            <div data-field="sintraLamination">
                              <CustomSelect
                                id="sintra-lamination"
                                label="Lamination"
                                value={form.sintraLamination}
                                onChange={(value) => update('sintraLamination', value)}
                                options={[
                                  { value: 'Non-Laminated', label: 'Non-Laminated' },
                                  { value: 'Laminated', label: 'Laminated' },
                                ]}
                                error={fieldErrors.sintraLamination}
                              />
                            </div>
                            <div data-field="sintraCutStyle">
                              <CustomSelect
                                id="sintra-cut-style"
                                label="Cut Style"
                                value={form.sintraCutStyle}
                                onChange={(value) => update('sintraCutStyle', value)}
                                options={[
                                  {
                                    value: 'Straight Cut / Cut to Size',
                                    label: 'Straight Cut / Cut to Size',
                                  },
                                  {
                                    value: 'Curve / Contour Cut',
                                    label: 'Curve / Contour Cut',
                                  },
                                ]}
                                error={fieldErrors.sintraCutStyle}
                              />
                            </div>
                            <div data-field="sintraDisplayOption">
                              <CustomSelect
                                id="sintra-display-option"
                                label="Display Option"
                                value={form.sintraDisplayOption}
                                onChange={(value) => update('sintraDisplayOption', value)}
                                options={[
                                  { value: 'Flat Only', label: 'Flat Only' },
                                  {
                                    value: 'With Sintra Stand / Standee',
                                    label: 'With Sintra Stand / Standee',
                                  },
                                ]}
                                error={fieldErrors.sintraDisplayOption}
                              />
                            </div>
                          </>
                        ) : null}

                        {isPanaflex ? (
                          <>
                            <div data-field="panaflexFaceMaterial">
                              <CustomSelect
                                id="panaflex-face-material"
                                label="Face Material / Output Type"
                                value={form.panaflexFaceMaterial}
                                onChange={(value) => update('panaflexFaceMaterial', value)}
                                options={[
                                  {
                                    value: 'Cut-out Sticker — Laminated',
                                    label: 'Cut-out Sticker — Laminated',
                                  },
                                  { value: 'Printed Panaflex', label: 'Printed Panaflex' },
                                ]}
                                error={fieldErrors.panaflexFaceMaterial}
                              />
                            </div>
                            {form.panaflexFaceMaterial === 'Printed Panaflex' ? (
                              <div data-field="panaflexPrintingMethod">
                                <CustomSelect
                                  id="panaflex-printing-method"
                                  label="Printing Method"
                                  value={form.panaflexPrintingMethod}
                                  onChange={(value) => update('panaflexPrintingMethod', value)}
                                  options={[
                                    { value: 'Eco-Solvent', label: 'Eco-Solvent' },
                                    { value: 'Solvent', label: 'Solvent' },
                                    { value: 'UV Print', label: 'UV Print' },
                                  ]}
                                  error={fieldErrors.panaflexPrintingMethod}
                                />
                              </div>
                            ) : null}
                          </>
                        ) : null}

                        {!isSintra ? (
                          <div data-field="signageFace">
                            <CustomSelect
                              id="signage-face"
                              label="Sign Face"
                              value={form.signageFace}
                              onChange={(value) => update('signageFace', value)}
                              options={[
                                { value: 'Single Face', label: 'Single Face' },
                                { value: 'Double Face', label: 'Double Face' },
                              ]}
                              error={fieldErrors.signageFace}
                            />
                          </div>
                        ) : null}

                        {isBlackout ? (
                          <div data-field="blackoutPrintingMethod">
                            <CustomSelect
                              id="blackout-printing-method"
                              label="Printing Method"
                              value={form.blackoutPrintingMethod}
                              onChange={(value) => update('blackoutPrintingMethod', value)}
                              options={[
                                { value: 'Eco-Solvent', label: 'Eco-Solvent' },
                                { value: 'Solvent', label: 'Solvent' },
                                { value: 'UV Print', label: 'UV Print' },
                              ]}
                              error={fieldErrors.blackoutPrintingMethod}
                            />
                          </div>
                        ) : null}

                        {!isSintra ? (
                          <div data-field="signageFulfillment">
                            <CustomSelect
                              id="signage-fulfillment"
                              label="Fulfillment Option"
                              value={form.signageFulfillment}
                              onChange={(value) => update('signageFulfillment', value)}
                              options={[
                                {
                                  value: 'Pickup Only — No Installation',
                                  label: 'Pickup Only — No Installation',
                                },
                                {
                                  value: 'Delivery / Installation Package',
                                  label: 'Delivery / Installation Package',
                                },
                              ]}
                              error={fieldErrors.signageFulfillment}
                            />
                          </div>
                        ) : null}

                        <div data-field="signageUnit">
                          <CustomSelect
                            id="signage-unit"
                            label="Measurement unit"
                            value={form.signageUnit}
                            onChange={(value) => update('signageUnit', value)}
                            options={[
                              { value: 'Inches', label: 'Inches' },
                              { value: 'Feet', label: 'Feet' },
                              { value: 'Meters', label: 'Meters' },
                            ]}
                            error={fieldErrors.signageUnit}
                          />
                        </div>
                        <div data-field="signageWidth">
                          <Field label="Width" error={fieldErrors.signageWidth}>
                            <input
                              className="field-input"
                              type="number"
                              min={0}
                              step="any"
                              value={form.signageWidth}
                              onChange={(e) => update('signageWidth', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.signageWidth)}
                            />
                          </Field>
                        </div>
                        <div data-field="signageHeight">
                          <Field label="Height" error={fieldErrors.signageHeight}>
                            <input
                              className="field-input"
                              type="number"
                              min={0}
                              step="any"
                              value={form.signageHeight}
                              onChange={(e) => update('signageHeight', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.signageHeight)}
                            />
                          </Field>
                        </div>
                        <div data-field="signageQuantity">
                          <Field label="Quantity" error={fieldErrors.signageQuantity}>
                            <input
                              className="field-input"
                              type="number"
                              min={1}
                              step={1}
                              value={form.signageQuantity}
                              onChange={(e) => update('signageQuantity', e.target.value)}
                              aria-invalid={Boolean(fieldErrors.signageQuantity)}
                            />
                          </Field>
                        </div>

                        {showInstall ? (
                          <>
                            <div data-field="signageInstallationLocation">
                              <CustomSelect
                                id="signage-installation-location"
                                label="Installation Location"
                                value={form.signageInstallationLocation}
                                onChange={(value) =>
                                  update('signageInstallationLocation', value)
                                }
                                options={[
                                  { value: 'Indoor', label: 'Indoor' },
                                  { value: 'Outdoor', label: 'Outdoor' },
                                ]}
                                error={fieldErrors.signageInstallationLocation}
                              />
                            </div>
                            <div data-field="signageMountingType">
                              <CustomSelect
                                id="signage-mounting-type"
                                label="Mounting Type"
                                value={form.signageMountingType}
                                onChange={(value) => update('signageMountingType', value)}
                                options={[
                                  { value: 'Wall Mounted', label: 'Wall Mounted' },
                                  { value: 'Hanging', label: 'Hanging' },
                                  {
                                    value: 'Freestanding / Post Mounted',
                                    label: 'Freestanding / Post Mounted',
                                  },
                                  { value: 'Not Sure', label: 'Not Sure' },
                                ]}
                                error={fieldErrors.signageMountingType}
                              />
                            </div>
                            {form.signageType === 'Panaflex — Lighted' ? (
                              <div data-field="signagePowerSource">
                                <CustomSelect
                                  id="signage-power-source"
                                  label="Power Source Available Near Installation Point?"
                                  value={form.signagePowerSource}
                                  onChange={(value) => update('signagePowerSource', value)}
                                  options={[
                                    { value: 'Yes', label: 'Yes' },
                                    { value: 'No', label: 'No' },
                                    { value: 'Not Sure', label: 'Not Sure' },
                                  ]}
                                  error={fieldErrors.signagePowerSource}
                                />
                              </div>
                            ) : null}
                            <div data-field="signageSiteDetails">
                              <Field
                                label="Site / Installation Details"
                                error={fieldErrors.signageSiteDetails}
                              >
                                <textarea
                                  className="field-textarea min-h-28 resize-y"
                                  value={form.signageSiteDetails}
                                  onChange={(e) => update('signageSiteDetails', e.target.value)}
                                  aria-invalid={Boolean(fieldErrors.signageSiteDetails)}
                                />
                              </Field>
                            </div>
                          </>
                        ) : null}

                      </div>
                    ) : null}

                    <div data-field="notes">
                      <Field label="Order details / notes" error={fieldErrors.notes}>
                        <textarea
                          className="field-textarea min-h-28 resize-y"
                          value={form.notes}
                          onChange={(e) => update('notes', e.target.value)}
                          aria-invalid={Boolean(fieldErrors.notes)}
                        />
                      </Field>
                    </div>
                    <div data-field="targetDate">
                      <Field label="Target completion date" error={fieldErrors.targetDate}>
                        <input
                          className="field-input"
                          type="date"
                          value={form.targetDate}
                          onChange={(e) => update('targetDate', e.target.value)}
                          aria-invalid={Boolean(fieldErrors.targetDate)}
                        />
                      </Field>
                    </div>

                    <div className="estimate-price-block">
                      <label className="block font-bold text-[#ffd52e]">Estimated Price</label>
                      <input
                        className="field-input mt-3 font-bold"
                        type="text"
                        value={liveEstimate.price}
                        readOnly
                      />

                      {estimateNote || estimateLines.length > 0 ? (
                        <div className="estimate-details mt-3">
                          <button
                            type="button"
                            className="estimate-details-toggle"
                            aria-expanded={estimateDetailsOpen}
                            onClick={() => setEstimateDetailsOpen((prev) => !prev)}
                          >
                            <span>Estimate details</span>
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 transition-transform duration-200',
                                estimateDetailsOpen && 'rotate-180'
                              )}
                            />
                          </button>

                          {estimateDetailsOpen ? (
                            <div className="estimate-details-body">
                              {estimateNote ? (
                                <p className="estimate-details-note">{estimateNote}</p>
                              ) : null}
                              {estimateLines.length > 0 ? (
                                <ul className="estimate-breakdown">
                                  {estimateLines.map((item, index) => (
                                    <li
                                      key={`${item.label}-${item.value}-${index}`}
                                      className={!item.label ? 'is-note' : undefined}
                                    >
                                      {item.label ? <span>{item.label}</span> : null}
                                      <strong>{item.value}</strong>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div data-field="consent" className={cn('field', fieldErrors.consent && 'has-error')}>
                      <label className="flex min-h-12 items-start gap-3 leading-6">
                        <input
                          className="mt-1 h-5 w-5 shrink-0 accent-[#ffd52e]"
                          type="checkbox"
                          checked={form.consent}
                          onChange={(e) => update('consent', e.target.checked)}
                          aria-invalid={Boolean(fieldErrors.consent)}
                        />
                        <span>
                          I agree to provide my information to Three J Print Center for quotation,
                          order processing, and customer communication.
                        </span>
                      </label>
                      {fieldErrors.consent ? (
                        <p className="field-error" role="alert">
                          {fieldErrors.consent}
                        </p>
                      ) : null}
                    </div>

                    {error ? (
                      <div className="error-box p-3 text-sm" role="alert">
                        {error}
                      </div>
                    ) : null}

                    <button type="submit" className="action-button action-red w-full text-base">
                      Calculate & Review Quote
                    </button>

                    <p className="mt-4 text-center text-sm leading-6 text-[#bdb8ae]">
                      <a
                        className="underline decoration-white/25 underline-offset-4 transition hover:text-[#f5f1e8] hover:decoration-white/50"
                        href={BUSINESS.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Prefer to message us instead?
                      </a>
                    </p>
                  </form>
                </div>
              ) : null}

              {panel === 'review' && reviewed ? (
                <div className="success-panel p-5 sm:p-7">
                  <p className="mono-label text-xs text-[#ffd52e]">QUOTE REVIEW</p>
                  <h2 className="mt-2 text-2xl font-extrabold">Review your quote</h2>
                  <p className="mt-3 leading-6 text-[#d9d4ca]">
                    Check these details before confirming and submitting your quotation request.
                  </p>
                  <QuoteSummaryDetails
                    customerName={form.customerName}
                    mobileNumber={form.mobileNumber}
                    selectedService={selectedService}
                    jobDetails={jobDetails}
                    notes={form.notes.trim() || undefined}
                    estimatedPrice={reviewed.estimatedPrice}
                    targetDate={form.targetDate}
                  />
                  {error ? (
                    <div className="error-box mt-5 p-3 text-sm" role="alert">
                      {error}
                    </div>
                  ) : null}
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      className="action-button action-ghost"
                      onClick={() => setPanel('form')}
                      disabled={createQuote.isLoading}
                    >
                      Edit Quote
                    </button>
                    <button
                      type="button"
                      className="action-button action-red"
                      onClick={confirmSubmit}
                      disabled={createQuote.isLoading}
                    >
                      {createQuote.isLoading ? 'Submitting…' : 'Confirm & Submit Quote'}
                    </button>
                  </div>
                </div>
              ) : null}

              {panel === 'confirmation' && reviewed ? (
                <div className="success-panel p-5 sm:p-7">
                  <p className="mono-label text-xs text-[#ffd52e]">REQUEST SUBMITTED</p>
                  <h2 className="mt-2 text-2xl font-extrabold">
                    Your quote request has been submitted and saved.
                  </h2>
                  <p className="mt-3 leading-6 text-[#d9d4ca]">
                    Keep these request details for your reference. You can also print or save the
                    quotation sheet.
                  </p>
                  <QuoteSummaryDetails
                    customerName={form.customerName}
                    mobileNumber={form.mobileNumber}
                    selectedService={selectedService}
                    jobDetails={jobDetails}
                    notes={form.notes.trim() || undefined}
                    estimatedPrice={reviewed.estimatedPrice}
                    targetDate={form.targetDate}
                  />
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      className="action-button action-red"
                      onClick={() => setShowQuoteModal(true)}
                    >
                      View Quotation
                    </button>
                    <button
                      type="button"
                      className="action-button action-yellow"
                      onClick={startAnother}
                    >
                      Start Another Quote
                    </button>
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        </main>
      </div>

      {showQuoteModal && reviewed && selectedService ? (
        <div
          id="quotation-modal"
          className="quotation-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quotation-title"
        >
          <QuotationSheet
            customerName={form.customerName}
            mobileNumber={form.mobileNumber}
            selectedService={selectedService}
            targetDate={form.targetDate}
            jobDetails={jobDetails}
            estimatedPrice={reviewed.estimatedPrice}
            notes={form.notes.trim() || undefined}
            onClose={() => setShowQuoteModal(false)}
            actions={
              <>
                <button
                  type="button"
                  className="action-button action-red"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4" />
                  Print Quotation
                </button>
                <button
                  type="button"
                  className="action-button action-yellow"
                  onClick={() => window.print()}
                >
                  Save as PDF
                </button>
                <button
                  type="button"
                  className="action-button action-ghost text-black"
                  onClick={startAnother}
                >
                  New Quote
                </button>
                <button
                  type="button"
                  className="action-button action-ghost text-black"
                  onClick={() => setShowQuoteModal(false)}
                >
                  Close
                </button>
              </>
            }
          />
        </div>
      ) : null}
    </div>
  );
}
