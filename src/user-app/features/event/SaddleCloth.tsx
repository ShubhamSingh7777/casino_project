import React from 'react'

// Greyhound trap colours (v2 §5.6): 1 red, 2 blue, 3 white, 4 black, 5 orange, 6 black/white stripes.
const TRAP: Record<number, string> = {
  1: 'tw-bg-red-600 tw-text-white',
  2: 'tw-bg-blue-600 tw-text-white',
  3: 'tw-bg-white tw-text-black tw-border tw-border-solid tw-border-gray-300',
  4: 'tw-bg-black tw-text-white',
  5: 'tw-bg-orange-500 tw-text-black',
  6: 'tw-bg-[repeating-linear-gradient(90deg,#000_0_4px,#fff_4px_8px)] tw-text-red-600',
}

/** Coloured number square for race runners (greyhound traps; horses use a neutral cloth). */
export const SaddleCloth = ({ number, kind }: { number: number; kind: 'horse' | 'greyhound' }) => (
  <span
    className={`tw-flex tw-h-7 tw-w-7 tw-shrink-0 tw-items-center tw-justify-center tw-rounded tw-text-strong ${
      kind === 'greyhound' ? TRAP[number] || 'tw-bg-gray-200' : 'tw-bg-gray-100 tw-text-fg'
    }`}
  >
    {number}
  </span>
)
