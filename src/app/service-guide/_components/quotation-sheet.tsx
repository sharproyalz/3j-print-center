import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import type { DetailItem } from '~/app/service-guide/_lib/job-details';
import { BUSINESS } from '~/app/service-guide/_lib/pricing';

export function QuotationSheet({
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
  actions?: ReactNode;
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

      {actions ? <div className="quotation-actions">{actions}</div> : null}
    </article>
  );
}
