import React from 'react'

export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  onOutside: () => void,
  enabled = true,
) => {
  React.useEffect(() => {
    if (!enabled) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [ref, onOutside, enabled])
}

/** Close overlays on Escape. */
export const useEscape = (onEscape: () => void, enabled = true) => {
  React.useEffect(() => {
    if (!enabled) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onEscape()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onEscape, enabled])
}
