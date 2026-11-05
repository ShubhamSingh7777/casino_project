import React from 'react'
import { ExportColumn, exportExcel, exportPdf } from '../../../shared/export'
import { LuChevronLeft, LuChevronRight, LuFileText, LuInbox } from '../../icons'

export type ReportColumn<T> = ExportColumn<T> & {
  render?: (row: T, index: number) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  footer?: React.ReactNode
}

export const cellOf = <T,>(c: ReportColumn<T>, row: T) => (c.value ? c.value(row) : (row as any)[c.key])

export const ReportCard = ({ children }: { children: React.ReactNode }) => <div className='tw-mb-2 tw-rounded-ua tw-bg-white tw-p-3'>{children}</div>

export const fieldClass =
  'tw-h-10 tw-w-full tw-rounded-md tw-border tw-border-solid tw-border-line tw-bg-white tw-px-3 tw-text-body tw-outline-none focus:tw-border-primary'

export const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className='tw-block tw-min-w-0'>
    <span className='tw-mb-1 tw-block tw-text-meta tw-font-semibold tw-text-muted-fg'>{label}</span>
    {children}
  </label>
)

export const PrimaryButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type='button' {...props} className={`tw-h-10 tw-rounded-md tw-bg-primary tw-px-4 tw-text-strong tw-text-white disabled:tw-opacity-60 ${props.className || ''}`} />
)
export const LightButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type='button' {...props} className={`tw-h-10 tw-rounded-md tw-border tw-border-solid tw-border-line tw-bg-white tw-px-4 tw-text-strong ${props.className || ''}`} />
)

export function ExportMenu<T>({ name, columns, rows }: { name: string; columns: ReportColumn<T>[]; rows: T[] }) {
  return (
    <span className='tw-inline-flex tw-gap-1.5'>
      <LightButton disabled={!rows.length} onClick={() => exportExcel(name, columns, rows)} className='disabled:tw-opacity-50'>
        Excel
      </LightButton>
      <LightButton disabled={!rows.length} onClick={() => exportPdf(name, columns, rows)} className='disabled:tw-opacity-50'>
        PDF
      </LightButton>
    </span>
  )
}

const ROW_OPTIONS = [10, 25, 50, 100]

/**
 * Light report table: optional client paging (rows-per-page) or server paging,
 * empty state, footer totals, horizontal scroll on small screens.
 */
export function ReportTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  emptyText = 'No records found',
  rowClassName,
  server,
}: {
  columns: ReportColumn<T>[]
  rows: T[]
  rowKey: (row: T, i: number) => string
  loading?: boolean
  emptyText?: string
  rowClassName?: (row: T) => string
  server?: { page: number; totalPages: number; onPage: (p: number) => void }
}) {
  const [size, setSize] = React.useState(25)
  const [page, setPage] = React.useState(1)
  React.useEffect(() => setPage(1), [rows, size])

  const totalPages = server ? Math.max(1, server.totalPages || 1) : Math.max(1, Math.ceil(rows.length / size))
  const current = server ? server.page : page
  const visible = server ? rows : rows.slice((page - 1) * size, page * size)
  const go = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages)
    server ? server.onPage(next) : setPage(next)
  }
  const align = (a?: string) => (a === 'right' ? 'tw-text-right' : a === 'center' ? 'tw-text-center' : 'tw-text-left')
  const hasFooter = columns.some((c) => c.footer !== undefined)

  return (
    <div>
      <div className='tw-overflow-x-auto tw-rounded-md tw-border tw-border-solid tw-border-line'>
        <table className='tw-w-full tw-min-w-max tw-border-collapse tw-text-body'>
          <thead>
            <tr className='tw-bg-table-head tw-text-table-head-fg'>
              {columns.map((c) => (
                <th key={c.key} className={`tw-whitespace-nowrap tw-px-3 tw-py-2 tw-text-meta tw-font-bold ${align(c.align)}`}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }, (_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length} className='tw-px-3 tw-py-2'>
                    <div className='tw-h-5 tw-animate-pulse tw-rounded tw-bg-gray-200' />
                  </td>
                </tr>
              ))
            ) : !visible.length ? (
              <tr>
                <td colSpan={columns.length} className='tw-px-3 tw-py-10 tw-text-center tw-text-muted-fg'>
                  <LuInbox className='tw-mx-auto tw-mb-2 tw-h-8 tw-w-8 tw-opacity-50' aria-hidden />
                  {emptyText}
                </td>
              </tr>
            ) : (
              visible.map((row, i) => (
                <tr key={rowKey(row, i)} className={`tw-border-0 tw-border-t tw-border-solid tw-border-line ${rowClassName?.(row) || ''}`}>
                  {columns.map((c) => (
                    <td key={c.key} className={`tw-whitespace-nowrap tw-px-3 tw-py-2 ${align(c.align)}`}>
                      {c.render ? c.render(row, i) : (cellOf(c, row) as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {hasFooter && visible.length > 0 && (
            <tfoot>
              <tr className='tw-border-0 tw-border-t tw-border-solid tw-border-line tw-bg-muted tw-font-bold'>
                {columns.map((c) => (
                  <td key={c.key} className={`tw-whitespace-nowrap tw-px-3 tw-py-2 ${align(c.align)}`}>
                    {c.footer}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <div className='tw-mt-2 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-text-meta tw-text-muted-fg'>
        {!server ? (
          <label className='tw-flex tw-items-center tw-gap-1.5'>
            Rows per page
            <select value={size} onChange={(e) => setSize(Number(e.target.value))} className='tw-h-8 tw-rounded tw-border tw-border-solid tw-border-line tw-bg-white tw-px-1'>
              {ROW_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <span />
        )}
        <div className='tw-flex tw-items-center tw-gap-1'>
          <button type='button' aria-label='Previous page' disabled={current <= 1} onClick={() => go(current - 1)} className='tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid tw-border-line tw-bg-white disabled:tw-opacity-40'>
            <LuChevronLeft className='tw-h-4 tw-w-4' />
          </button>
          <span className='tw-px-2 tw-font-semibold tw-text-fg'>
            {current} / {totalPages}
          </span>
          <button type='button' aria-label='Next page' disabled={current >= totalPages} onClick={() => go(current + 1)} className='tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid tw-border-line tw-bg-white disabled:tw-opacity-40'>
            <LuChevronRight className='tw-h-4 tw-w-4' />
          </button>
        </div>
      </div>
    </div>
  )
}

export const ReportTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className='tw-mb-3 tw-flex tw-items-center tw-gap-2 tw-text-section'>
    <LuFileText className='tw-h-4 tw-w-4 tw-text-primary' aria-hidden /> {children}
  </h2>
)
