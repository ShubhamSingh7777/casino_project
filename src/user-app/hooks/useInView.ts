import React from 'react'

/** Becomes true once the element is within `rootMargin` of the viewport, and stays true. */
export const useInView = <T extends Element>(rootMargin = '400px') => {
  const ref = React.useRef<T>(null)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    if (inView || !ref.current) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [inView, rootMargin])

  return [ref, inView] as const
}
