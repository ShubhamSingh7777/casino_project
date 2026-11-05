import moment from 'moment'

/**
 * Timezone options shown in the header menu. `offsetMinutes` is applied relative to IST,
 * because the legacy screens already render match times as IST (see `toIstMoment`).
 */
export type TimezoneOption = {
  id: 'system' | 'local' | 'ist'
  title: string
  label: string
  offsetMinutes: number
}

export const TIMEZONES: TimezoneOption[] = [
  { id: 'system', title: 'System time', label: 'UTC +0', offsetMinutes: 0 },
  { id: 'local', title: 'Local time', label: 'UTC +5:30', offsetMinutes: 330 },
  { id: 'ist', title: 'India Standard', label: 'UTC +5:30', offsetMinutes: 330 },
]

const IST_OFFSET_MINUTES = 330

/**
 * Same conversion the legacy match lists use (`addISTOffset` + `moment.utc`):
 * the API time + 60 minutes, read as UTC, gives the IST wall-clock time.
 */
const toIstMoment = (iso: string) => moment.utc(iso).add(60, 'minutes')

export const toZonedMoment = (iso: string, tz: TimezoneOption) =>
  toIstMoment(iso).add(tz.offsetMinutes - IST_OFFSET_MINUTES, 'minutes')

export const formatMatchTime = (iso: string, tz: TimezoneOption) => {
  const m = toZonedMoment(iso, tz)
  const now = moment.utc().add(tz.offsetMinutes, 'minutes')
  const day = m.isSame(now, 'day') ? 'TODAY' : m.isSame(now.clone().add(1, 'day'), 'day') ? 'TOMORROW' : m.format('DD MMM')
  return { day, time: m.format('HH:mm') }
}

/**
 * True when the match start time has passed. Uses the same IST conversion as the displayed
 * time, so "In Play" and the shown start time always agree.
 */
export const hasStarted = (iso: string) => !toIstMoment(iso).isAfter(moment.utc().add(IST_OFFSET_MINUTES, 'minutes'))

export type StartStatus = 'live' | 'soon' | 'scheduled'

/** Racing chips: live once started, "soon" within ±5 min of the start (v2 §5.4). */
export const getStartStatus = (iso: string): StartStatus => {
  const diffMin = toIstMoment(iso).diff(moment.utc().add(IST_OFFSET_MINUTES, 'minutes'), 'minutes', true)
  if (Math.abs(diffMin) <= 5) return 'soon'
  return diffMin < 0 ? 'live' : 'scheduled'
}

/** "26/10/2026 23:45 (GMT +5:30)" for breadcrumbs */
export const formatFullTime = (iso: string, tz: TimezoneOption) =>
  `${toZonedMoment(iso, tz).format('DD/MM/YYYY HH:mm')} (GMT ${tz.label.replace('UTC ', '')})`

/** 1030 → 1.03K, 1750000 → 1.75M */
export const formatSize = (size?: number | string | null) => {
  const n = Number(size)
  if (!size || Number.isNaN(n)) return ''
  if (n >= 1e6) return `${+(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${+(n / 1e3).toFixed(2)}K`
  return `${+n.toFixed(2)}`
}

export const formatMoney = (value?: number | string | null) => {
  const n = Number(value ?? 0)
  return Number.isNaN(n) ? '0' : n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
}
