import React from 'react'
import dayjs from 'dayjs'
import { DateRange, lastDays, Range, SingleDate } from '../../../shared/DateRange'
import { Card, PageHeader } from '../../ui/PageHeader'
import { Button, inputClass, labelClass } from '../../ui/Button'
import { Column, DataTable } from '../../ui/DataTable'
import { ExportButtons } from '../../ui/ExportButtons'
import { Tabs } from '../../ui/Modal'
import { UserOption, UserSelect } from '../../ui/UserSelect'

export type PendingSelect = { label: string; options: string[] | (() => Promise<string[]>) }

export type PendingReportProps = {
  title: string
  crumbs?: string[]
  tabs?: string[]
  /** filter controls, in order */
  user?: boolean
  range?: { maxDays?: number }
  date?: boolean
  selects?: PendingSelect[]
  columns: string[]
  info?: string
  /** list pages that show their (empty) table straight away instead of after Load */
  loadOnMount?: boolean
  pageSizes?: number[]
  children?: React.ReactNode
}

export const NoApiNote = () => (
  <p className='tw-mb-3 tw-rounded tw-bg-ad-warning/20 tw-px-3 tw-py-1.5 tw-text-[12px] tw-text-ad-warning'>
    This report has no API in the backend yet. The screen is ready; rows will show here once the endpoint exists.
  </p>
)

const SelectFilter = ({ select, value, onChange }: { select: PendingSelect; value: string; onChange: (v: string) => void }) => {
  const [options, setOptions] = React.useState<string[]>(Array.isArray(select.options) ? select.options : [])
  React.useEffect(() => {
    if (typeof select.options === 'function') select.options().then(setOptions).catch(() => setOptions([]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [select.label])
  return (
    <label className='tw-block tw-min-w-[180px]'>
      <span className={labelClass}>{select.label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        <option value=''>Select</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

/**
 * Report screen for spec pages whose API does not exist in this backend yet: real filters,
 * tabs, table columns and export buttons, with an empty table and a note instead of fake data.
 */
const PendingReport = ({ title, crumbs, tabs, user, range, date, selects = [], columns, info, loadOnMount, pageSizes, children }: PendingReportProps) => {
  const [tab, setTab] = React.useState(tabs?.[0] || '')
  const [who, setWho] = React.useState<UserOption | null>(null)
  const [dates, setDates] = React.useState<Range>(lastDays(Math.min(7, range?.maxDays || 7)))
  const [day, setDay] = React.useState(dayjs())
  const [picked, setPicked] = React.useState<Record<string, string>>({})
  const [loaded, setLoaded] = React.useState(!!loadOnMount)
  const hasFilters = user || range || date || selects.length > 0

  const cols: Column<Record<string, never>>[] = columns.map((c) => ({ key: c, header: c, sortable: true }))
  const reset = () => {
    setWho(null)
    setDates(lastDays(Math.min(7, range?.maxDays || 7)))
    setDay(dayjs())
    setPicked({})
    setLoaded(!!loadOnMount)
  }

  return (
    <div>
      <PageHeader title={title} crumbs={crumbs} />
      <Card>
        {tabs && <Tabs<string> tabs={tabs.map((t) => ({ key: t, label: t }))} active={tab} onChange={setTab} />}
        {info && <p className='tw-mb-3 tw-rounded tw-bg-[#d4e6f9] tw-px-3 tw-py-2 tw-text-[13px] tw-text-[#212529]'>{info}</p>}
        <NoApiNote />
        {hasFilters ? (
          <div className='tw-mb-3 tw-flex tw-flex-wrap tw-items-end tw-gap-2'>
            {user && (
              <label className='tw-block tw-w-56'>
                <span className={labelClass}>Search By Client Name</span>
                <UserSelect value={who} onChange={setWho} />
              </label>
            )}
            {range && (
              <label className='tw-block'>
                <span className={labelClass}>Select Date Range</span>
                <DateRange value={dates} onChange={setDates} maxDays={range.maxDays} />
              </label>
            )}
            {date && (
              <label className='tw-block'>
                <span className={labelClass}>Date</span>
                <SingleDate value={day} onChange={setDay} />
              </label>
            )}
            {selects.map((s) => (
              <SelectFilter key={s.label} select={s} value={picked[s.label] || ''} onChange={(v) => setPicked((p) => ({ ...p, [s.label]: v }))} />
            ))}
            <Button onClick={() => setLoaded(true)}>Load</Button>
            <Button variant='light' onClick={reset}>
              Reset
            </Button>
            <ExportButtons name={title.toLowerCase().replace(/\s+/g, '-')} columns={cols} rows={[]} disabled />
          </div>
        ) : (
          <div className='tw-mb-3 tw-flex tw-justify-end'>
            <ExportButtons name={title.toLowerCase().replace(/\s+/g, '-')} columns={cols} rows={[]} disabled />
          </div>
        )}
        {loaded ? (
          <DataTable columns={cols} rows={[]} rowKey={(_, i) => String(i)} pageSizes={pageSizes} />
        ) : (
          <p className='tw-py-6 tw-text-center tw-text-[13px] tw-text-ad-muted'>Choose the filters and press Load.</p>
        )}
      </Card>
      {children}
    </div>
  )
}

export default PendingReport
