'use client';

import type { PriceRate, PriceSetting, PricingService } from '@prisma/client';
import { Fragment, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { FLAT_RATE_VARIANT } from '~/lib/pricing-catalog';
import {
  PRICING_SETTING_DEF_BY_KEY,
  type PricingSettingClusterRole,
} from '~/lib/pricing-settings';
import { cn } from '~/lib/utils';
import { api } from '~/trpc/react';

type Props = {
  initialRates: PriceRate[];
  initialSettings: PriceSetting[];
};

type VolumeClusterRow = {
  group: string;
  cluster: string;
  sortOrder: number;
  from?: PriceSetting;
  discount?: PriceSetting;
  benefit?: PriceSetting;
};

type ServiceTab = PricingService | 'ADDONS' | 'VOLUME';

type TabMeta = {
  id: ServiceTab;
  label: string;
  unit?: string;
  layout: 'matrix' | 'flat' | 'tier' | 'addons' | 'volume';
  optionLabel?: string;
  variantLabel?: string;
};

const TABS: TabMeta[] = [
  {
    id: 'DTF_SHIRT',
    label: 'DTF Shirt',
    unit: '₱ / print',
    layout: 'flat',
    optionLabel: 'Print size',
  },
  {
    id: 'DTF_TRANSFER',
    label: 'DTF Transfer',
    unit: '₱ / meter',
    layout: 'tier',
    optionLabel: 'Volume tier',
  },
  {
    id: 'SUBLIMATION',
    label: 'Sublimation',
    unit: '₱ / piece',
    layout: 'flat',
    optionLabel: 'Product type',
  },
  {
    id: 'TARPAULIN',
    label: 'Tarpaulin',
    unit: '₱ / sq.ft',
    layout: 'matrix',
    optionLabel: 'Media / material',
    variantLabel: 'Printing method',
  },
  {
    id: 'STICKERS',
    label: 'Stickers',
    unit: '₱ / sq.in',
    layout: 'matrix',
    optionLabel: 'Sticker type',
    variantLabel: 'Lamination',
  },
  {
    id: 'SIGNAGE_FRAME',
    label: 'Signage',
    unit: '₱ / sq.ft',
    layout: 'matrix',
    optionLabel: 'Signage type',
    variantLabel: 'Option / method',
  },
  {
    id: 'SIGNAGE_SINTRA',
    label: 'Sintra',
    unit: '₱ / sq.in',
    layout: 'matrix',
    optionLabel: 'Thickness',
    variantLabel: 'Print side',
  },
  {
    id: 'ADDONS',
    label: 'Add-ons',
    layout: 'addons',
  },
  {
    id: 'VOLUME',
    label: 'Volume',
    layout: 'volume',
  },
];

function formatDraft(value: number) {
  return Number.isInteger(value) ? String(value) : String(value);
}

function RateInput({
  value,
  invalid,
  changed,
  onChange,
}: {
  value: string;
  invalid: boolean;
  changed: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      className={cn(
        'ml-auto h-10 w-28 text-right tabular-nums',
        invalid && 'border-destructive',
        changed && 'border-primary'
      )}
      inputMode="decimal"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function PricingView({ initialRates, initialSettings }: Props) {
  const utils = api.useUtils();
  const ratesQuery = api.pricing.getAll.useQuery(undefined, {
    initialData: initialRates,
  });
  const settingsQuery = api.pricing.getSettings.useQuery(undefined, {
    initialData: initialSettings,
  });
  const rates = ratesQuery.data ?? initialRates;
  const settings = settingsQuery.data ?? initialSettings;

  const [activeTab, setActiveTab] = useState<ServiceTab>('DTF_SHIRT');
  const [rateDrafts, setRateDrafts] = useState<Record<string, string>>({});
  const [settingDrafts, setSettingDrafts] = useState<Record<string, string>>({});

  const updateRates = api.pricing.updateRates.useMutation({
    onSuccess: async () => {
      toast.success('Prices updated.');
      setRateDrafts({});
      await utils.pricing.getAll.invalidate();
      await utils.pricing.getCatalog.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Could not update prices.');
    },
  });

  const updateSettings = api.pricing.updateSettings.useMutation({
    onSuccess: async () => {
      toast.success(activeTab === 'VOLUME' ? 'Volume rules updated.' : 'Add-ons updated.');
      setSettingDrafts({});
      await utils.pricing.getSettings.invalidate();
      await utils.pricing.getCatalog.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Could not update settings.');
    },
  });

  const activeTabMeta = TABS.find((tab) => tab.id === activeTab) ?? TABS[0]!;
  const isSettingsTab = activeTab === 'ADDONS' || activeTab === 'VOLUME';
  const settingsTab = activeTab === 'VOLUME' ? 'volume' : 'addons';

  const tabRates = useMemo(
    () => (isSettingsTab ? [] : rates.filter((rate) => rate.service === activeTab)),
    [rates, activeTab, isSettingsTab]
  );

  const tabSettings = useMemo(
    () =>
      settings.filter((setting) => {
        const def = PRICING_SETTING_DEF_BY_KEY.get(setting.key);
        return (def?.tab ?? 'addons') === settingsTab;
      }),
    [settings, settingsTab]
  );

  const groupedRates = useMemo(() => {
    const groups = new Map<string, PriceRate[]>();
    for (const rate of tabRates) {
      const list = groups.get(rate.optionKey) ?? [];
      list.push(rate);
      groups.set(rate.optionKey, list);
    }
    return Array.from(groups.entries());
  }, [tabRates]);

  const flatRates = useMemo(
    () => tabRates.filter((rate) => rate.variantKey === FLAT_RATE_VARIANT),
    [tabRates]
  );

  const tierRates = useMemo(
    () =>
      [...tabRates].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || Number(a.optionKey) - Number(b.optionKey)
      ),
    [tabRates]
  );

  const groupedSettings = useMemo(() => {
    const groups = new Map<string, PriceSetting[]>();
    for (const setting of tabSettings) {
      const list = groups.get(setting.group) ?? [];
      list.push(setting);
      groups.set(setting.group, list);
    }
    return Array.from(groups.entries());
  }, [tabSettings]);

  const volumeClusterGroups = useMemo(() => {
    const clusters = new Map<string, VolumeClusterRow>();

    for (const setting of tabSettings) {
      const def = PRICING_SETTING_DEF_BY_KEY.get(setting.key);
      const cluster = def?.cluster ?? setting.label;
      const mapKey = `${setting.group}::${cluster}`;
      const existing = clusters.get(mapKey) ?? {
        group: setting.group,
        cluster,
        sortOrder: def?.sortOrder ?? setting.sortOrder,
        from: undefined,
        discount: undefined,
        benefit: undefined,
      };

      const role = def?.clusterRole as PricingSettingClusterRole | undefined;
      if (role === 'from') existing.from = setting;
      else if (role === 'discount') existing.discount = setting;
      else if (role === 'benefit') existing.benefit = setting;
      else existing.from = setting;

      existing.sortOrder = Math.min(existing.sortOrder, def?.sortOrder ?? setting.sortOrder);
      clusters.set(mapKey, existing);
    }

    const byGroup = new Map<string, VolumeClusterRow[]>();
    for (const row of Array.from(clusters.values()).sort((a, b) => a.sortOrder - b.sortOrder)) {
      const list = byGroup.get(row.group) ?? [];
      list.push(row);
      byGroup.set(row.group, list);
    }
    return Array.from(byGroup.entries());
  }, [tabSettings]);

  const specialMinSetting = settings.find((setting) => setting.key === 'dtf.transferSpecialMinMeters');

  const changedRates = useMemo(() => {
    const changes: { id: string; rate: number }[] = [];
    for (const rate of rates) {
      const draft = rateDrafts[rate.id];
      if (draft === undefined) continue;
      const parsed = Number(draft);
      if (!Number.isFinite(parsed) || parsed <= 0) continue;
      if (parsed !== rate.rate) changes.push({ id: rate.id, rate: parsed });
    }
    return changes;
  }, [rateDrafts, rates]);

  const changedSettings = useMemo(() => {
    const changes: { id: string; value?: number; textValue?: string }[] = [];
    for (const setting of tabSettings) {
      const draft = settingDrafts[setting.id];
      if (draft === undefined) continue;
      const def = PRICING_SETTING_DEF_BY_KEY.get(setting.key);
      if (def?.kind === 'text') {
        const next = draft.trim();
        if (!next) continue;
        if (next !== (setting.textValue ?? '')) changes.push({ id: setting.id, textValue: next });
        continue;
      }
      const parsed = Number(draft);
      if (!Number.isFinite(parsed) || parsed < 0) continue;
      if (parsed !== setting.value) changes.push({ id: setting.id, value: parsed });
    }
    return changes;
  }, [settingDrafts, tabSettings]);

  const hasInvalidRateDraft = useMemo(() => {
    return Object.entries(rateDrafts).some(([id, value]) => {
      if (!rates.some((rate) => rate.id === id)) return false;
      const parsed = Number(value);
      return value.trim() === '' || !Number.isFinite(parsed) || parsed <= 0;
    });
  }, [rateDrafts, rates]);

  const hasInvalidSettingDraft = useMemo(() => {
    return Object.entries(settingDrafts).some(([id, value]) => {
      const setting = tabSettings.find((row) => row.id === id);
      if (!setting) return false;
      const def = PRICING_SETTING_DEF_BY_KEY.get(setting.key);
      if (def?.kind === 'text') return value.trim() === '';
      const parsed = Number(value);
      return value.trim() === '' || !Number.isFinite(parsed) || parsed < 0;
    });
  }, [settingDrafts, tabSettings]);

  const hasDrafts = isSettingsTab
    ? tabSettings.some((setting) => settingDrafts[setting.id] !== undefined)
    : Object.keys(rateDrafts).length > 0;
  const unsavedCount = isSettingsTab ? changedSettings.length : changedRates.length;
  const isSaving = updateRates.isLoading || updateSettings.isLoading;

  const resetDrafts = () => {
    if (isSettingsTab) setSettingDrafts({});
    else setRateDrafts({});
  };

  const save = () => {
    if (isSettingsTab) {
      if (hasInvalidSettingDraft) {
        toast.error(
          activeTab === 'VOLUME'
            ? 'Enter a valid value (0 or greater) or non-empty text for every edited field.'
            : 'Enter a valid value (0 or greater) for every edited field.'
        );
        return;
      }
      if (!changedSettings.length) {
        toast.message(activeTab === 'VOLUME' ? 'No volume changes to save.' : 'No add-on changes to save.');
        return;
      }
      updateSettings.mutate({ settings: changedSettings });
      return;
    }

    if (hasInvalidRateDraft) {
      toast.error('Enter a valid rate greater than 0 for every edited field.');
      return;
    }
    if (!changedRates.length) {
      toast.message('No price changes to save.');
      return;
    }
    updateRates.mutate({ rates: changedRates });
  };

  const getRateRowState = (row: PriceRate) => {
    const draft = rateDrafts[row.id];
    const display = draft ?? formatDraft(row.rate);
    const parsed = Number(display);
    const invalid =
      draft !== undefined && (draft.trim() === '' || !Number.isFinite(parsed) || parsed <= 0);
    const changed = draft !== undefined && Number(draft) !== row.rate && !invalid;
    return { display, invalid, changed };
  };

  const getSettingRowState = (row: PriceSetting) => {
    const def = PRICING_SETTING_DEF_BY_KEY.get(row.key);
    const draft = settingDrafts[row.id];
    if (def?.kind === 'text') {
      const stored = (row.textValue ?? def.defaultText ?? '').trim();
      const display = draft ?? row.textValue ?? def.defaultText ?? '';
      const invalid = draft !== undefined && draft.trim() === '';
      const changed = draft !== undefined && draft.trim() !== stored && !invalid;
      return { display, invalid, changed, kind: 'text' as const };
    }
    const display = draft ?? formatDraft(row.value);
    const parsed = Number(display);
    const invalid =
      draft !== undefined && (draft.trim() === '' || !Number.isFinite(parsed) || parsed < 0);
    const changed = draft !== undefined && Number(draft) !== row.value && !invalid;
    return { display, invalid, changed, kind: 'number' as const };
  };

  return (
    <main className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Pricing</h1>
          <p className="text-sm text-muted-foreground">
            Update rates, add-ons, and volume rules used by the Service Guide quote calculator.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isSettingsTab ? (
            <Card className="px-4 py-2 shadow-none">
              <p className="text-xs text-muted-foreground">Unit</p>
              <p className="text-lg font-semibold">{activeTabMeta.unit}</p>
            </Card>
          ) : null}
          <Card className="px-4 py-2 shadow-none">
            <p className="text-xs text-muted-foreground">{isSettingsTab ? 'Settings' : 'Rates'}</p>
            <p className="text-lg font-semibold tabular-nums">
              {isSettingsTab ? tabSettings.length : tabRates.length}
            </p>
          </Card>
          <Card className="px-4 py-2 shadow-none">
            <p className="text-xs text-muted-foreground">Unsaved</p>
            <p className="text-lg font-semibold tabular-nums">{unsavedCount}</p>
          </Card>
        </div>
      </div>

      <Card className="shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => (
                <Button
                  key={tab.id}
                  type="button"
                  size="sm"
                  variant={activeTab === tab.id ? 'secondary' : 'outline'}
                  className="lg:h-10"
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 lg:h-10"
                onClick={resetDrafts}
                disabled={!hasDrafts || isSaving}
              >
                Reset
              </Button>
              <Button
                type="button"
                size="sm"
                className="shrink-0 lg:h-10"
                onClick={save}
                disabled={
                  isSaving ||
                  !unsavedCount ||
                  (isSettingsTab ? hasInvalidSettingDraft : hasInvalidRateDraft)
                }
              >
                {isSaving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isSettingsTab ? (
        !tabSettings.length ? (
          <Card className="border-dashed shadow-none">
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">
                {activeTab === 'VOLUME' ? 'No volume settings found.' : 'No add-on settings found.'}
              </p>
            </CardContent>
          </Card>
        ) : activeTab === 'VOLUME' ? (
          <Card className="shadow-none">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[160px]">Tier</TableHead>
                  <TableHead className="w-[200px]">From</TableHead>
                  <TableHead>Discount / benefit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volumeClusterGroups.map(([group, rows]) => (
                  <Fragment key={group}>
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={3}
                        className="bg-muted/50 py-3 text-sm font-semibold text-foreground"
                      >
                        {group.replace(/^Volume ·\s*/, '')}
                      </TableCell>
                    </TableRow>
                    {rows.map((row) => {
                      const fromState = row.from ? getSettingRowState(row.from) : null;
                      const discountState = row.discount ? getSettingRowState(row.discount) : null;
                      const benefitState = row.benefit ? getSettingRowState(row.benefit) : null;
                      const companionState = discountState ?? benefitState;
                      const companionSetting = row.discount ?? row.benefit;

                      return (
                        <TableRow key={`${row.group}-${row.cluster}`}>
                          <TableCell className="pl-8 font-medium">{row.cluster}</TableCell>
                          <TableCell>
                            {row.from && fromState ? (
                              <div className="flex items-center justify-end gap-2">
                                <RateInput
                                  value={fromState.display}
                                  invalid={fromState.invalid}
                                  changed={fromState.changed}
                                  onChange={(value) =>
                                    setSettingDrafts((prev) => ({
                                      ...prev,
                                      [row.from!.id]: value,
                                    }))
                                  }
                                />
                                <span className="w-20 text-sm text-muted-foreground">
                                  {row.from.unit}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {companionSetting && companionState ? (
                              companionState.kind === 'text' ? (
                                <Input
                                  className={cn(
                                    'h-10 w-full max-w-lg text-left',
                                    companionState.invalid && 'border-destructive',
                                    companionState.changed && 'border-primary'
                                  )}
                                  value={companionState.display}
                                  onChange={(e) =>
                                    setSettingDrafts((prev) => ({
                                      ...prev,
                                      [companionSetting.id]: e.target.value,
                                    }))
                                  }
                                />
                              ) : (
                                <div className="flex items-center justify-end gap-2">
                                  <RateInput
                                    value={companionState.display}
                                    invalid={companionState.invalid}
                                    changed={companionState.changed}
                                    onChange={(value) =>
                                      setSettingDrafts((prev) => ({
                                        ...prev,
                                        [companionSetting.id]: value,
                                      }))
                                    }
                                  />
                                  <span className="w-8 text-sm text-muted-foreground">
                                    {companionSetting.unit}
                                  </span>
                                </div>
                              )
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card className="shadow-none">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Setting</TableHead>
                  <TableHead className="w-[120px]">Unit</TableHead>
                  <TableHead className="w-[140px] text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedSettings.map(([group, rows]) => (
                  <Fragment key={group}>
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={3}
                        className="bg-muted/50 py-3 text-sm font-semibold text-foreground"
                      >
                        {group}
                      </TableCell>
                    </TableRow>
                    {rows.map((row) => {
                      const { display, invalid, changed, kind } = getSettingRowState(row);
                      return (
                        <TableRow key={row.id}>
                          <TableCell className="pl-8 font-medium">{row.label}</TableCell>
                          <TableCell className="text-muted-foreground">{row.unit}</TableCell>
                          <TableCell className="text-right">
                            {kind === 'text' ? (
                              <Input
                                className={cn(
                                  'ml-auto h-10 w-full max-w-md text-left',
                                  invalid && 'border-destructive',
                                  changed && 'border-primary'
                                )}
                                value={display}
                                onChange={(e) =>
                                  setSettingDrafts((prev) => ({ ...prev, [row.id]: e.target.value }))
                                }
                              />
                            ) : (
                              <RateInput
                                value={display}
                                invalid={invalid}
                                changed={changed}
                                onChange={(value) =>
                                  setSettingDrafts((prev) => ({ ...prev, [row.id]: value }))
                                }
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </Card>
        )
      ) : !tabRates.length ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No rates found for this service.</p>
          </CardContent>
        </Card>
      ) : activeTabMeta.layout === 'flat' ? (
        <Card className="shadow-none">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{activeTabMeta.optionLabel}</TableHead>
                <TableHead className="w-[140px] text-right">
                  Rate ({activeTabMeta.unit})
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flatRates.map((row) => {
                const { display, invalid, changed } = getRateRowState(row);
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.optionKey}</TableCell>
                    <TableCell className="text-right">
                      <RateInput
                        value={display}
                        invalid={invalid}
                        changed={changed}
                        onChange={(value) =>
                          setRateDrafts((prev) => ({ ...prev, [row.id]: value }))
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      ) : activeTabMeta.layout === 'tier' ? (
        <Card className="shadow-none">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{activeTabMeta.optionLabel}</TableHead>
                <TableHead className="w-[140px] text-right">
                  Rate ({activeTabMeta.unit})
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tierRates.map((row) => {
                const { display, invalid, changed } = getRateRowState(row);
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.variantKey}</TableCell>
                    <TableCell className="text-right">
                      <RateInput
                        value={display}
                        invalid={invalid}
                        changed={changed}
                        onChange={(value) =>
                          setRateDrafts((prev) => ({ ...prev, [row.id]: value }))
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <p className="border-t px-4 py-3 text-sm text-muted-foreground">
            Orders from{' '}
            {specialMinSetting
              ? formatDraft(Number(settingDrafts[specialMinSetting.id] ?? specialMinSetting.value))
              : '1000'}
            + meters require special volume pricing. Edit that threshold under Add-ons.
          </p>
        </Card>
      ) : (
        <Card className="shadow-none">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{activeTabMeta.variantLabel}</TableHead>
                <TableHead className="w-[140px] text-right">
                  Rate ({activeTabMeta.unit})
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedRates.map(([optionKey, rows]) => (
                <Fragment key={optionKey}>
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={2}
                      className="bg-muted/50 py-3 text-sm font-semibold text-foreground"
                    >
                      {optionKey}
                    </TableCell>
                  </TableRow>
                  {rows.map((row) => {
                    const { display, invalid, changed } = getRateRowState(row);
                    return (
                      <TableRow key={row.id}>
                        <TableCell className="pl-8">{row.variantKey}</TableCell>
                        <TableCell className="text-right">
                          <RateInput
                            value={display}
                            invalid={invalid}
                            changed={changed}
                            onChange={(value) =>
                              setRateDrafts((prev) => ({ ...prev, [row.id]: value }))
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </main>
  );
}
