import React from 'react'
import { formatSize } from '../utils/format'
import { PriceCell } from '../utils/match'

type OddsCellProps = {
  side: 'back' | 'lay'
  cell: PriceCell
  onClick?: () => void
  className?: string
  /** Best price of a ladder — the cell nearest the centre (v2 `--back-strong` / `--lay-strong`). */
  strong?: boolean
  /** Custom size text (bookmaker lakh format, fancy "110"). */
  sizeLabel?: string
}

const SIDE_CLASS = {
  back: 'tw-bg-back tw-text-back-fg hover:tw-bg-back-hover',
  lay: 'tw-bg-lay tw-text-lay-fg hover:tw-bg-lay-hover',
}
const STRONG_CLASS = {
  back: 'tw-bg-back-strong tw-text-back-fg hover:tw-bg-back-hover',
  lay: 'tw-bg-lay-strong tw-text-lay-fg hover:tw-bg-lay-hover',
}

/** Back (blue) / Lay (pink) price cell; flashes for 400ms when the price changes. */
const OddsCell = ({ side, cell, onClick, className = '', strong, sizeLabel }: OddsCellProps) => {
  const [flashKey, setFlashKey] = React.useState(0)
  const prev = React.useRef(cell.price)

  React.useEffect(() => {
    if (prev.current !== cell.price && prev.current != null && cell.price != null) setFlashKey((k) => k + 1)
    prev.current = cell.price
  }, [cell.price])

  const empty = cell.price == null
  const size = sizeLabel ?? (cell.size != null ? formatSize(cell.size) : '')

  return (
    <button
      type='button'
      disabled={empty || !onClick}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      aria-label={`${side} ${cell.price ?? 'not available'}`}
      className={`tw-flex tw-flex-col tw-items-center tw-justify-center tw-rounded-md tw-leading-tight tw-transition-colors disabled:tw-cursor-default ${
        (strong ? STRONG_CLASS : SIDE_CLASS)[side]
      } ${className}`}
    >
      <span
        key={flashKey}
        className={`tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center tw-justify-center tw-rounded-md ${flashKey ? 'tw-animate-ua-flash' : ''}`}
      >
        <span className='tw-text-price tw-tabular-nums'>{empty ? '-' : cell.price}</span>
        {!empty && size && <span className='tw-text-badge tw-font-normal tw-tabular-nums tw-opacity-80'>{size}</span>}
      </span>
    </button>
  )
}

export default React.memo(
  OddsCell,
  (a, b) =>
    a.cell.price === b.cell.price &&
    a.cell.size === b.cell.size &&
    a.side === b.side &&
    a.strong === b.strong &&
    a.sizeLabel === b.sizeLabel &&
    a.className === b.className &&
    !!a.onClick === !!b.onClick,
)
