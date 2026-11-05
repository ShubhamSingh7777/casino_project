import React from 'react'
import { LuArrowUpDown, LuChevronLeft, LuChevronRight, LuChevronsLeft, LuChevronsRight } from './icons'

export type Column<T> = {
  key: string
  header: string
  render?: (row: T, index: number) => React.ReactNode
  /** value used for sorting, searching and export; defaults to row[key] */
  value?: (row: T) => string | number | null | undefined
  sortable?: boolean
  align?: 'left' | 'right' | 'center'
  /** footer total cell (e.g. sums) */
  footer?: React.ReactNode
  /** leave out of Excel/PDF (action columns) */
  noExport?: boolean
}

type ServerPaging = { page: number; totalPages: number; onPage: (page: number) => void }

type DataTableProps<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T, index: number) => string
  pageSizes?: number[]
  /** pass for API-paginated lists; client paging is used otherwise */
  server?: ServerPaging
  searchable?: boolean
  emptyText?: string
  rowClassName?: (row: T) => string
  loading?: boolean
  toolbar?: React.ReactNode
}

export const cellValue = <T,>(col: Column<T>, row: T) => (col.value ? col.value(row) : (row as any)[col.key])

const PAGE_SIZES = [25, 50, 75, 100, 125, 150]

const PageButton = ({ onClick, disabled, label, children, active }: any) => (
  <button
    type='button'
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className={`tw-flex tw-h-8 tw-min-w-[32px] tw-items-center tw-justify-center tw-rounded-[30px] tw-px-2 tw-text-[12px] disabled:tw-opacity-40 ${
      active ? 'tw-bg-ad-info tw-text-white' : 'tw-bg-ad-item tw-text-white hover:tw-bg-white/25'
    }`}
  >
    {children}
  </button>
)

/**
 * Report table (spec §1.5): "Show N entries", client search, sortable headers,
 * « ‹ n › » pagination, empty row, optional footer totals, horizontal scroll.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  pageSizes = PAGE_SIZES,
  server,
  searchable = true,
  emptyText = 'There are no records to show',
  rowClassName,
  loading,
  toolbar,
}: DataTableProps<T>) {
  const [size, setSize] = React.useState(pageSizes[0])
  const [page, setPage] = React.useState(1)
  const [query, setQuery] = React.useState('')
  const [sort, setSort] = React.useState<{ key: string; dir: 1 | -1 } | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = q ? rows.filter((r) => columns.some((c) => String(cellValue(c, r) ?? '').toLowerCase().includes(q))) : rows
    if (sort) {
      const col = columns.find((c) => c.key === sort.key)
      if (col) {
        list = [...list].sort((a, b) => {
          const va = cellValue(col, a)
          const vb = cellValue(col, b)
          const na = Number(va)
          const nb = Number(vb)
          const cmp = !Number.isNaN(na) && !Number.isNaN(nb) ? na - nb : String(va ?? '').localeCompare(String(vb ?? ''))
          return cmp * sort.dir
        })
      }
    }
    return list
  }, [rows, columns, query, sort])

  React.useEffect(() => setPage(1), [query, size, rows])

  const totalPages = server ? server.totalPages || 1 : Math.max(1, Math.ceil(filtered.length / size))
  const current = server ? server.page : page
  const visible = server ? filtered : filtered.slice((page - 1) * size, page * size)
  const go = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages)
    server ? server.onPage(next) : setPage(next)
  }
  const hasFooter = columns.some((c) => c.footer !== undefined)
  const alignClass = (a?: Column<T>['align']) => (a === 'right' ? 'tw-text-right' : a === 'center' ? 'tw-text-center' : 'tw-text-left')

  return (
    <div>
      <div className='tw-mb-2 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2'>
        <label className='tw-flex tw-items-center tw-gap-1.5 tw-text-[12px]'>
          Show
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className='tw-h-8 tw-rounded tw-border-0 tw-bg-white tw-px-1 tw-text-[12px] tw-text-[#495057]'
          >
            {pageSizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          entries
        </label>
        <div className='tw-flex tw-flex-wrap tw-items-center tw-gap-2'>
          {toolbar}
          {searchable && (
            <input
              type='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search...'
              aria-label='Search table'
              className='tw-h-8 tw-w-48 tw-rounded tw-border-0 tw-bg-white tw-px-2 tw-text-[12px] tw-text-[#495057] tw-outline-none'
            />
          )}
        </div>
      </div>

      <div className='tw-overflow-x-auto'>
        <table className='tw-w-full tw-min-w-max tw-text-[12px]'>
          <thead>
            <tr className='tw-bg-white/10'>
              {columns.map((c) => (
                <th key={c.key} className={`tw-whitespace-nowrap tw-px-2 tw-py-2 tw-font-semibold tw-text-white ${alignClass(c.align)}`}>
                  {c.sortable ? (
                    <button
                      type='button'
                      title='Click to sort ascending'
                      onClick={() => setSort((s) => (s?.key === c.key ? { key: c.key, dir: s.dir === 1 ? -1 : 1 } : { key: c.key, dir: 1 }))}
                      className='tw-inline-flex tw-items-center tw-gap-1'
                    >
                      {c.header} <LuArrowUpDown className='tw-h-3 tw-w-3 tw-opacity-60' />
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className='tw-px-2 tw-py-6 tw-text-center !tw-text-ad-muted'>
                  Loading…
                </td>
              </tr>
            ) : !visible.length ? (
              <tr>
                <td colSpan={columns.length} className='tw-px-2 tw-py-6 tw-text-center !tw-text-ad-muted'>
                  {emptyText}
                </td>
              </tr>
            ) : (
              visible.map((row, i) => (
                <tr key={rowKey(row, i)} className={`tw-border-0 tw-border-b tw-border-solid tw-border-white/10 ${rowClassName?.(row) || ''}`}>
                  {columns.map((c) => (
                    <td key={c.key} className={`tw-whitespace-nowrap tw-px-2 tw-py-1.5 tw-text-white ${alignClass(c.align)}`}>
                      {c.render ? c.render(row, i) : (cellValue(c, row) as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {hasFooter && (
            <tfoot>
              <tr className='tw-bg-white/10 tw-font-semibold'>
                {columns.map((c) => (
                  <td key={c.key} className={`tw-whitespace-nowrap tw-px-2 tw-py-2 tw-text-white ${alignClass(c.align)}`}>
                    {c.footer}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <div className='tw-mt-3 tw-flex tw-justify-end tw-gap-1'>
        <PageButton label='First page' disabled={current <= 1} onClick={() => go(1)}>
          <LuChevronsLeft className='tw-h-4 tw-w-4' />
        </PageButton>
        <PageButton label='Previous page' disabled={current <= 1} onClick={() => go(current - 1)}>
          <LuChevronLeft className='tw-h-4 tw-w-4' />
        </PageButton>
        <PageButton label={`Page ${current}`} active>
          {current}
        </PageButton>
        <PageButton label='Next page' disabled={current >= totalPages} onClick={() => go(current + 1)}>
          <LuChevronRight className='tw-h-4 tw-w-4' />
        </PageButton>
        <PageButton label='Last page' disabled={current >= totalPages} onClick={() => go(totalPages)}>
          <LuChevronsRight className='tw-h-4 tw-w-4' />
        </PageButton>
      </div>
    </div>
  )
}
