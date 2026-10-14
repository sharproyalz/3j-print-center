const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const MARGIN_X_MM = 10;
const MARGIN_Y_MM = 8;
const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_X_MM * 2;
const CONTENT_HEIGHT_MM = PAGE_HEIGHT_MM - MARGIN_Y_MM * 2;
const MAX_PAGES = 2;

function quotationFileName(customerName: string) {
  const safe = customerName
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
  return safe ? `Quotation - ${safe}.pdf` : 'Quotation.pdf';
}

function canvasHasInk(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return false;

  const sampleHeight = Math.min(canvas.height, 800);
  const { data } = context.getImageData(0, 0, canvas.width, sampleHeight);
  let ink = 0;

  for (let index = 0; index < data.length; index += 16 * 4) {
    const red = data[index] ?? 255;
    const green = data[index + 1] ?? 255;
    const blue = data[index + 2] ?? 255;
    if (red < 245 || green < 245 || blue < 245) ink += 1;
  }

  return ink > 40;
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadQuotationSheet(sheet: HTMLElement, customerName: string) {
  const page = sheet.closest<HTMLElement>('.service-guide-page');
  if (!page) {
    throw new Error('Quotation is not open.');
  }

  const host = document.createElement('div');
  host.className = 'quotation-export-host';
  host.setAttribute('aria-hidden', 'true');

  const clone = sheet.cloneNode(true) as HTMLElement;
  clone.classList.add('is-export');
  clone.querySelector('#quotation-title')?.removeAttribute('id');
  clone.querySelector('.quotation-actions')?.remove();
  clone.querySelector('[data-quotation-close]')?.remove();
  host.appendChild(clone);
  page.appendChild(host);

  try {
    await document.fonts.ready;
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });

    if (clone.offsetWidth < 100 || clone.offsetHeight < 100) {
      throw new Error('Could not prepare the quotation for download.');
    }

    const canvas = await captureElement(clone);
    await writeCanvasPdf(canvas, quotationFileName(customerName));
  } finally {
    host.remove();
  }
}

async function captureElement(element: HTMLElement) {
  const html2canvas = (await import('html2canvas')).default;
  const captureWidth = element.scrollWidth;
  const captureHeight = element.scrollHeight;
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false,
    width: captureWidth,
    height: captureHeight,
    windowWidth: captureWidth,
    windowHeight: captureHeight,
    scrollX: 0,
    scrollY: -window.scrollY,
    x: 0,
    y: 0,
  });

  if (!canvasHasInk(canvas)) {
    throw new Error('Could not prepare the quotation for download.');
  }

  return canvas;
}

async function writeCanvasPdf(canvas: HTMLCanvasElement, fileName: string) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const renderedHeightMm = (canvas.height * CONTENT_WIDTH_MM) / canvas.width;
  const onePageLimit = CONTENT_HEIGHT_MM - 3;
  const twoPageLimit = CONTENT_HEIGHT_MM * MAX_PAGES - 3;
  let scale = 1;
  if (renderedHeightMm > onePageLimit && renderedHeightMm <= onePageLimit + 30) {
    scale = onePageLimit / renderedHeightMm;
  } else if (renderedHeightMm > twoPageLimit) {
    scale = twoPageLimit / renderedHeightMm;
  }

  const drawWidthMm = CONTENT_WIDTH_MM * scale;
  const offsetX = MARGIN_X_MM + (CONTENT_WIDTH_MM - drawWidthMm) / 2;
  const pixelsPerMm = canvas.width / drawWidthMm;
  const sliceHeightPx = Math.max(1, Math.floor(onePageLimit * pixelsPerMm));

  let offset = 0;
  let pageIndex = 0;

  while (offset < canvas.height && pageIndex < MAX_PAGES) {
    const sliceHeight = Math.min(sliceHeightPx, canvas.height - offset);
    const slice = document.createElement('canvas');
    slice.width = canvas.width;
    slice.height = sliceHeight;
    const context = slice.getContext('2d');
    if (!context) throw new Error('Could not prepare the quotation for download.');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, slice.width, slice.height);
    context.drawImage(
      canvas,
      0,
      offset,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight,
    );

    if (pageIndex > 0) pdf.addPage();
    pdf.addImage(
      slice.toDataURL('image/jpeg', 0.92),
      'JPEG',
      offsetX,
      MARGIN_Y_MM,
      drawWidthMm,
      sliceHeight / pixelsPerMm,
    );

    offset += sliceHeight;
    pageIndex += 1;
  }

  triggerDownload(pdf.output('blob'), fileName);
}

export async function downloadElementAsPdf(element: HTMLElement, fileName: string) {
  await document.fonts.ready;
  if (element.offsetWidth < 100 || element.offsetHeight < 100) {
    throw new Error('Could not prepare the quotation for download.');
  }
  const canvas = await captureElement(element);
  await writeCanvasPdf(canvas, fileName);
}

export async function downloadQuotationPdf(customerName: string) {
  const sheet = document.querySelector<HTMLElement>('#quotation-modal .quotation-sheet');
  if (!sheet) {
    throw new Error('Quotation is not open.');
  }
  await downloadQuotationSheet(sheet, customerName);
}
