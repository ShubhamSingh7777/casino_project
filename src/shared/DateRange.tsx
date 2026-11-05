import React from 'react'
import { ConfigProvider, DatePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

export type Range = [Dayjs, Dayjs]

export const lastDays = (days: number): Range => [dayjs().subtract(days, 'day').startOf('day'), dayjs().endOf('day')]

/** API date format used by the existing report endpoints. */
export const apiDate = (d: Dayjs) => d.format('YYYY-MM-DD')

/** 2-month range picker (antd), "dd/mm/yyyy ~ dd/mm/yyyy" — spec §1.6. */
export const DateRange = ({ value, onChange, maxDays }: { value: Range; onChange: (r: Range) => void; maxDays?: number }) => (
  <ConfigProvider theme={{ token: { colorPrimary: '#333d79', borderRadius: 4, fontFamily: 'Lato, system-ui, sans-serif' } }}>
    <DatePicker.RangePicker
      value={value}
      format='DD/MM/YYYY'
      separator='~'
      allowClear={false}
      onChange={(v) => v && v[0] && v[1] && onChange([v[0].startOf('day'), v[1].endOf('day')])}
      disabledDate={
        maxDays
          ? (current, { from }) => (from ? Math.abs(current.diff(from, 'day')) >= maxDays : false)
          : undefined
      }
      style={{ height: 36, width: '100%' }}
    />
  </ConfigProvider>
)

export const SingleDate = ({ value, onChange }: { value: Dayjs; onChange: (d: Dayjs) => void }) => (
  <ConfigProvider theme={{ token: { colorPrimary: '#333d79', borderRadius: 4 } }}>
    <DatePicker value={value} format='DD/MM/YYYY' allowClear={false} onChange={(d) => d && onChange(d)} style={{ height: 36, width: '100%' }} />
  </ConfigProvider>
)
