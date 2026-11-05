import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import moment from 'moment'

/** Minimal column shape for exports — admin DataTable and user report tables both fit it. */
export type ExportColumn<T> = { key: string; header: string; value?: (row: T) => unknown; noExport?: boolean }

const cellValue = <T,>(col: ExportColumn<T>, row: T) => (col.value ? col.value(row) : (row as any)[col.key])

const toRows = <T,>(columns: ExportColumn<T>[], rows: T[]) => {
  const cols = columns.filter((c) => !c.noExport)
  return { cols, data: rows.map((r) => Object.fromEntries(cols.map((c) => [c.header, cellValue(c, r) ?? '']))) }
}

export const exportExcel = <T,>(name: string, columns: ExportColumn<T>[], rows: T[]) => {
  const { data } = toRows(columns, rows)
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet(data), 'Sheet1')
  const buffer = XLSX.write(book, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${name}-${moment().format('YYYY-MM-DD-HHmm')}.xlsx`)
}

const escapeHtml = (v: unknown) => String(v ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch] as string))

/** PDF via the browser's print dialog ("Save as PDF") — no PDF library is installed in the project. */
export const exportPdf = <T,>(title: string, columns: ExportColumn<T>[], rows: T[]) => {
  const { cols, data } = toRows(columns, rows)
  const win = window.open('', '_blank', 'width=1000,height=700')
  if (!win) return
  const head = cols.map((c) => `<th>${escapeHtml(c.header)}</th>`).join('')
  const body = data.map((r) => `<tr>${cols.map((c) => `<td>${escapeHtml(r[c.header])}</td>`).join('')}</tr>`).join('')
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>body{font-family:Arial,sans-serif;font-size:11px}h1{font-size:14px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:4px;text-align:left}th{background:#eee}</style>
</head><body><h1>${escapeHtml(title)}</h1><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`)
  win.document.close()
  win.focus()
  win.print()
}

