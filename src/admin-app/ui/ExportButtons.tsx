import React from 'react'
import { Column } from './DataTable'
import { exportExcel, exportPdf } from '../../shared/export'
import { LuFileDown, LuFileSpreadsheet } from './icons'

/** Icon-only Excel (green) + PDF (red) buttons (spec §1.5). */
export function ExportButtons<T>({ name, columns, rows, disabled }: { name: string; columns: Column<T>[]; rows: T[]; disabled?: boolean }) {
  const off = disabled || !rows.length
  return (
    <span className='tw-inline-flex tw-gap-1.5'>
      <button
        type='button'
        title='Export Excel'
        aria-label='Export Excel'
        disabled={off}
        onClick={() => exportExcel(name, columns, rows)}
        className='tw-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded tw-bg-ad-success tw-text-white disabled:tw-opacity-50'
      >
        <LuFileSpreadsheet className='tw-h-4 tw-w-4' />
      </button>
      <button
        type='button'
        title='Export PDF'
        aria-label='Export PDF'
        disabled={off}
        onClick={() => exportPdf(name, columns, rows)}
        className='tw-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded tw-bg-ad-danger tw-text-white disabled:tw-opacity-50'
      >
        <LuFileDown className='tw-h-4 tw-w-4' />
      </button>
    </span>
  )
}
