'use client';

import { QuoteRequest, QuoteStatus } from '@prisma/client';
import { Copy, Printer, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { SelectNative } from '~/components/ui/select-native';
import { Separator } from '~/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/lib/utils';
import { api } from '~/trpc/react';

type Props = {
  initialData: QuoteRequest[];
};

type DateFilter = 'ALL' | 'THIS_WEEK' | 'OVERDUE';
type SortOption = 'NEWEST' | 'NEEDED_SOONEST';
type StatusFilter = 'ALL' | 'PRODUCTION' | QuoteStatus;

const STATUS_OPTIONS: { value: QuoteStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'REVIEWED', label: 'Reviewed' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'IN_PRODUCTION', label: 'In production' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CLOSED', label: 'Closed' },
];

const PRODUCTION_STATUSES: QuoteStatus[] = ['CONFIRMED', 'IN_PRODUCTION'];

function statusLabel(status: QuoteStatus) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function statusBadgeVariant(status: QuoteStatus) {
  if (status === 'NEW') return 'default' as const;
  if (status === 'CONFIRMED' || status === 'IN_PRODUCTION') return 'secondary' as const;
  if (status === 'COMPLETED') return 'outline' as const;
  if (status === 'CLOSED') return 'muted' as const;
  return 'outline' as const;
}

function nextProductionStatus(status: QuoteStatus): QuoteStatus | null {
  if (status === 'NEW' || status === 'REVIEWED' || status === 'CONTACTED') return 'CONFIRMED';
  if (status === 'CONFIRMED') return 'IN_PRODUCTION';
  if (status === 'IN_PRODUCTION') return 'COMPLETED';
  return null;
}

function productionActionLabel(status: QuoteStatus) {
  if (status === 'NEW' || status === 'REVIEWED' || status === 'CONTACTED') return 'Confirm job';
  if (status === 'CONFIRMED') return 'Start production';
  if (status === 'IN_PRODUCTION') return 'Mark completed';
  return null;
}

function parseEstimateLines(summary: string) {
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

function parseTargetDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfWeek(date: Date) {
  const start = startOfDay(date);
  const day = start.getDay();
  const daysUntilSunday = (7 - day) % 7;
  return new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate() + daysUntilSunday,
    23,
    59,
    59,
    999
  );
}

function buildQuoteSummary(quote: QuoteRequest) {
  return [
    `Customer: ${quote.customerName}`,
    `Mobile: ${quote.mobileNumber}`,
    quote.emailAddress ? `Email: ${quote.emailAddress}` : null,
    quote.facebookMessengerName ? `Messenger: ${quote.facebookMessengerName}` : null,
    `Service: ${quote.selectedService}`,
    `Estimated price: ${quote.estimatedPrice}`,
    `Needed by: ${quote.targetCompletionDate}`,
    `Status: ${statusLabel(quote.status)}`,
    `Customer notes: ${quote.notes || '—'}`,
    `Estimate details: ${quote.estimateSummary || '—'}`,
    quote.adminNotes ? `Admin notes: ${quote.adminNotes}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

function printQuote(quote: QuoteRequest) {
  const estimateLines = parseEstimateLines(quote.estimateSummary);
  const estimateHtml = estimateLines.length
    ? `<ul>${estimateLines
        .map(
          (item) =>
            `<li><span>${item.label ? `${item.label}: ` : ''}</span><strong>${item.value}</strong></li>`
        )
        .join('')}</ul>`
    : `<p>${quote.estimateSummary || '—'}</p>`;

  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Quote — ${quote.customerName}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111; padding: 24px; line-height: 1.5; }
      h1 { margin: 0 0 4px; font-size: 24px; }
      .muted { color: #555; margin-bottom: 20px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; margin-bottom: 20px; }
      .label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
      .section { border-top: 1px solid #ddd; padding-top: 14px; margin-top: 14px; }
      ul { padding-left: 18px; margin: 8px 0 0; }
      li { margin: 4px 0; }
    </style>
  </head>
  <body>
    <h1>${quote.customerName}</h1>
    <p class="muted">${quote.selectedService} · ${quote.estimatedPrice}</p>
    <div class="grid">
      <div><div class="label">Mobile</div><div>${quote.mobileNumber}</div></div>
      <div><div class="label">Email</div><div>${quote.emailAddress || '—'}</div></div>
      <div><div class="label">Messenger</div><div>${quote.facebookMessengerName || '—'}</div></div>
      <div><div class="label">Needed by</div><div>${quote.targetCompletionDate}</div></div>
      <div><div class="label">Status</div><div>${statusLabel(quote.status)}</div></div>
      <div><div class="label">Submitted</div><div>${new Date(quote.createdAt).toLocaleString('en-PH')}</div></div>
    </div>
    <div class="section">
      <div class="label">Customer notes</div>
      <p>${quote.notes || '—'}</p>
    </div>
    <div class="section">
      <div class="label">Estimate details</div>
      ${estimateHtml}
    </div>
    ${
      quote.adminNotes
        ? `<div class="section"><div class="label">Admin notes</div><p>${quote.adminNotes}</p></div>`
        : ''
    }
  </body>
</html>`;

  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
  if (!printWindow) {
    toast.error('Pop-up blocked. Allow pop-ups to print.');
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export function QuotesView({ initialData }: Props) {
  const router = useRouter();
  const utils = api.useUtils();
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('NEW');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState<DateFilter>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('NEWEST');
  const [adminNotesDraft, setAdminNotesDraft] = useState('');

  const quotesQuery = api.quoteRequest.getAll.useQuery(undefined, { initialData });
  const quotes = quotesQuery.data ?? [];

  const serviceOptions = useMemo(() => {
    return Array.from(new Set(quotes.map((quote) => quote.selectedService))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [quotes]);

  const newCount = useMemo(
    () => quotes.filter((quote) => quote.status === 'NEW').length,
    [quotes]
  );
  const productionCount = useMemo(
    () => quotes.filter((quote) => PRODUCTION_STATUSES.includes(quote.status)).length,
    [quotes]
  );

  const filteredQuotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    const today = startOfDay(new Date());
    const weekEnd = endOfWeek(new Date());

    const next = quotes.filter((quote) => {
      if (statusFilter === 'PRODUCTION') {
        if (!PRODUCTION_STATUSES.includes(quote.status)) return false;
      } else if (statusFilter !== 'ALL' && quote.status !== statusFilter) {
        return false;
      }
      if (serviceFilter !== 'ALL' && quote.selectedService !== serviceFilter) return false;

      const targetDate = parseTargetDate(quote.targetCompletionDate);
      if (dateFilter === 'THIS_WEEK') {
        if (!targetDate || targetDate < today || targetDate > weekEnd) return false;
      }
      if (dateFilter === 'OVERDUE') {
        if (!targetDate || targetDate >= today) return false;
      }

      if (!query) return true;

      const haystack = [
        quote.customerName,
        quote.mobileNumber,
        quote.emailAddress ?? '',
        quote.facebookMessengerName ?? '',
        quote.selectedService,
        quote.notes,
        quote.adminNotes ?? '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });

    next.sort((a, b) => {
      if (sortOption === 'NEEDED_SOONEST') {
        const aDate = parseTargetDate(a.targetCompletionDate)?.getTime() ?? Number.POSITIVE_INFINITY;
        const bDate = parseTargetDate(b.targetCompletionDate)?.getTime() ?? Number.POSITIVE_INFINITY;
        if (aDate !== bDate) return aDate - bDate;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return next;
  }, [quotes, search, statusFilter, serviceFilter, dateFilter, sortOption]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    statusFilter !== 'NEW' ||
    serviceFilter !== 'ALL' ||
    dateFilter !== 'ALL' ||
    sortOption !== 'NEWEST';

  const selectedQuote = useMemo(
    () => quotes.find((quote) => quote.id === selectedQuoteId) ?? null,
    [quotes, selectedQuoteId]
  );
  const estimateLines = useMemo(
    () => (selectedQuote ? parseEstimateLines(selectedQuote.estimateSummary) : []),
    [selectedQuote]
  );

  useEffect(() => {
    setAdminNotesDraft(selectedQuote?.adminNotes ?? '');
  }, [selectedQuote?.id, selectedQuote?.adminNotes]);

  const invalidateQuotes = async () => {
    await Promise.all([
      utils.quoteRequest.getAll.invalidate(),
      utils.quoteRequest.getNewCount.invalidate(),
    ]);
    router.refresh();
  };

  const updateStatus = api.quoteRequest.updateStatus.useMutation({
    onSuccess: async () => {
      toast.success('Quote status updated.');
      await invalidateQuotes();
    },
    onError: (error) => toast.error(error.message || 'Failed to update status.'),
  });

  const updateAdminNotes = api.quoteRequest.updateAdminNotes.useMutation({
    onSuccess: async () => {
      toast.success('Admin notes saved.');
      await invalidateQuotes();
    },
    onError: () => toast.error('Failed to save admin notes.'),
  });

  const deleteQuote = api.quoteRequest.delete.useMutation({
    onSuccess: async () => {
      toast.success('Quote deleted.');
      setSelectedQuoteId(null);
      await invalidateQuotes();
    },
    onError: () => toast.error('Failed to delete quote.'),
  });

  const copyText = async (value: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(successMessage);
    } catch {
      toast.error('Could not copy to clipboard.');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('NEW');
    setServiceFilter('ALL');
    setDateFilter('ALL');
    setSortOption('NEWEST');
  };

  return (
    <main className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Quote Requests</h1>
          <p className="text-sm text-muted-foreground">
            Review customer requests, update status, and move jobs into production.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Card className="px-4 py-2 shadow-none">
            <p className="text-xs text-muted-foreground">New</p>
            <p className="text-lg font-semibold tabular-nums">{newCount}</p>
          </Card>
          <Card className="px-4 py-2 shadow-none">
            <p className="text-xs text-muted-foreground">In production</p>
            <p className="text-lg font-semibold tabular-nums">{productionCount}</p>
          </Card>
          <Card className="px-4 py-2 shadow-none">
            <p className="text-xs text-muted-foreground">Showing</p>
            <p className="text-lg font-semibold tabular-nums">
              {hasActiveFilters ? `${filteredQuotes.length}/${quotes.length}` : quotes.length}
            </p>
          </Card>
        </div>
      </div>

      {!quotes.length ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <p className="max-w-md text-muted-foreground">
              Hey! there are currently no quote requests. New requests from customers will show up
              here.
            </p>
            <Image
              src="/empty-quotes.svg"
              alt="No quote requests"
              width={280}
              height={280}
              className="mt-8"
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-none">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, mobile, email…"
                    className="pl-9"
                  />
                </div>
                <SelectNative
                  className="lg:w-[150px]"
                  value={statusFilter}
                  onChange={(event) => {
                    const next = event.target.value as StatusFilter;
                    setStatusFilter(next);
                    if (next === 'PRODUCTION') setSortOption('NEEDED_SOONEST');
                  }}
                >
                  <option value="ALL">All statuses</option>
                  <option value="PRODUCTION">Production</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </SelectNative>
                <SelectNative
                  className="lg:w-[150px]"
                  value={serviceFilter}
                  onChange={(event) => setServiceFilter(event.target.value)}
                >
                  <option value="ALL">All services</option>
                  {serviceOptions.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </SelectNative>
                <SelectNative
                  className="lg:w-[160px]"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value as DateFilter)}
                >
                  <option value="ALL">All dates</option>
                  <option value="THIS_WEEK">Needed this week</option>
                  <option value="OVERDUE">Overdue</option>
                </SelectNative>
                <SelectNative
                  className="lg:w-[150px]"
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value as SortOption)}
                >
                  <option value="NEWEST">Newest first</option>
                  <option value="NEEDED_SOONEST">Needed soonest</option>
                </SelectNative>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 lg:h-10"
                  disabled={!hasActiveFilters}
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {!filteredQuotes.length ? (
            <Card className="border-dashed shadow-none">
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No quote requests match these filters.</p>
                <Button type="button" variant="link" className="mt-2" onClick={resetFilters}>
                  Reset filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-none">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Needed by</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[72px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((quote) => (
                    <TableRow
                      key={quote.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedQuoteId(quote.id)}
                    >
                      <TableCell>
                        <div className="min-w-[12rem]">
                          <p className="font-medium">{quote.customerName}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {quote.mobileNumber}
                            {quote.emailAddress ? ` · ${quote.emailAddress}` : ''}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {quote.selectedService}
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {quote.estimatedPrice}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {quote.targetCompletionDate}
                      </TableCell>
                      <TableCell onClick={(event) => event.stopPropagation()}>
                        <SelectNative
                          className="h-9 w-[150px]"
                          value={quote.status}
                          disabled={updateStatus.isLoading}
                          onChange={(event) =>
                            updateStatus.mutate({
                              id: quote.id,
                              status: event.target.value as QuoteStatus,
                            })
                          }
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </SelectNative>
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={deleteQuote.isLoading}
                          onClick={() => {
                            if (confirm('Delete this quote request?')) {
                              deleteQuote.mutate({ id: quote.id });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </>
      )}

      <Dialog
        open={Boolean(selectedQuote)}
        onOpenChange={(open) => {
          if (!open) setSelectedQuoteId(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selectedQuote ? (
            <>
              <DialogHeader className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 pr-6">
                  <DialogTitle className="text-2xl">{selectedQuote.customerName}</DialogTitle>
                  <Badge variant={statusBadgeVariant(selectedQuote.status)}>
                    {statusLabel(selectedQuote.status)}
                  </Badge>
                </div>
                <DialogDescription>
                  {selectedQuote.selectedService} · {selectedQuote.estimatedPrice}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyText(buildQuoteSummary(selectedQuote), 'Quote summary copied.')
                  }
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy summary
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => printQuote(selectedQuote)}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>

              <Separator />

              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Mobile</p>
                  <p className="font-medium">{selectedQuote.mobileNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedQuote.emailAddress || '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Messenger</p>
                  <p className="font-medium">{selectedQuote.facebookMessengerName || '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Needed by</p>
                  <p className="font-medium">{selectedQuote.targetCompletionDate}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-muted-foreground">Submitted</p>
                  <p className="font-medium">
                    {new Date(selectedQuote.createdAt).toLocaleString('en-PH')}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Customer notes</p>
                <p className="whitespace-pre-wrap font-medium leading-6">
                  {selectedQuote.notes || '—'}
                </p>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">Estimate details</p>
                {estimateLines.length ? (
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <ul className="space-y-2">
                      {estimateLines.map((item, index) => (
                        <li
                          key={`${item.label}-${item.value}-${index}`}
                          className={cn(
                            'grid gap-1 sm:grid-cols-[minmax(8rem,36%)_1fr] sm:gap-3',
                            !item.label && 'sm:grid-cols-1'
                          )}
                        >
                          {item.label ? (
                            <span className="text-muted-foreground">{item.label}</span>
                          ) : null}
                          <span className="font-medium">{item.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="font-medium">{selectedQuote.estimateSummary || '—'}</p>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="admin-notes">Admin notes</Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotesDraft}
                  onChange={(event) => setAdminNotesDraft(event.target.value)}
                  placeholder="Internal notes for your team…"
                  className="min-h-24"
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    disabled={
                      updateAdminNotes.isLoading ||
                      adminNotesDraft.trim() === (selectedQuote.adminNotes ?? '').trim()
                    }
                    onClick={() =>
                      updateAdminNotes.mutate({
                        id: selectedQuote.id,
                        adminNotes: adminNotesDraft.trim(),
                      })
                    }
                  >
                    {updateAdminNotes.isLoading ? 'Saving…' : 'Save notes'}
                  </Button>
                </div>
              </div>

              <DialogFooter className="gap-3 sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <SelectNative
                    className="w-[170px]"
                    value={selectedQuote.status}
                    disabled={updateStatus.isLoading}
                    onChange={(event) =>
                      updateStatus.mutate({
                        id: selectedQuote.id,
                        status: event.target.value as QuoteStatus,
                      })
                    }
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </SelectNative>
                  {productionActionLabel(selectedQuote.status) ? (
                    <Button
                      type="button"
                      disabled={updateStatus.isLoading}
                      onClick={() => {
                        const nextStatus = nextProductionStatus(selectedQuote.status);
                        if (!nextStatus) return;
                        updateStatus.mutate({
                          id: selectedQuote.id,
                          status: nextStatus,
                        });
                      }}
                    >
                      {productionActionLabel(selectedQuote.status)}
                    </Button>
                  ) : null}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  disabled={deleteQuote.isLoading}
                  onClick={() => {
                    if (confirm('Delete this quote request?')) {
                      deleteQuote.mutate({ id: selectedQuote.id });
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
