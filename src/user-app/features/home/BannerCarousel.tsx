import React from 'react'
import { LuChevronLeft, LuChevronRight } from '../../icons'

// Same banners the legacy carousel used.
const BANNERS = ['/imgs/carousel/296.png', '/imgs/carousel/294.png', '/imgs/carousel/694.png', '/imgs/carousel/902.png', '/imgs/carousel/937.png']
const AUTOPLAY_MS = 4000

/**
 * Scroll-snap carousel: 1 slide on mobile, 3 from md. Autoplays and loops;
 * pauses while the user is touching/hovering it.
 */
const BannerCarousel = () => {
  const track = React.useRef<HTMLDivElement>(null)
  const paused = React.useRef(false)

  const step = React.useCallback((dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const slide = el.firstElementChild as HTMLElement | null
    const width = slide ? slide.offsetWidth + 8 : el.clientWidth
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    const atStart = el.scrollLeft <= 4
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
    else el.scrollBy({ left: dir * width, behavior: 'smooth' })
  }, [])

  React.useEffect(() => {
    const id = window.setInterval(() => !paused.current && step(1), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [step])

  const pause = (value: boolean) => () => {
    paused.current = value
  }

  const arrow =
    'tw-absolute tw-top-1/2 tw-z-10 tw-flex tw-h-8 tw-w-8 -tw-translate-y-1/2 tw-items-center tw-justify-center tw-rounded-full tw-bg-black/50 tw-text-white hover:tw-bg-black/70'

  return (
    <div
      className='tw-relative tw-mb-2'
      onMouseEnter={pause(true)}
      onMouseLeave={pause(false)}
      onTouchStart={pause(true)}
      onTouchEnd={pause(false)}
    >
      <div ref={track} className='ua-no-scrollbar tw-flex tw-snap-x tw-snap-mandatory tw-gap-2 tw-overflow-x-auto'>
        {BANNERS.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Promotion ${i + 1}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            className='tw-aspect-[36/17] tw-w-full tw-shrink-0 tw-snap-start tw-rounded-ua tw-bg-gray-200 tw-object-cover md:tw-w-[calc((100%-16px)/3)]'
          />
        ))}
      </div>
      <button type='button' aria-label='Previous banner' onClick={() => step(-1)} className={`${arrow} tw-left-2`}>
        <LuChevronLeft className='tw-h-5 tw-w-5' />
      </button>
      <button type='button' aria-label='Next banner' onClick={() => step(1)} className={`${arrow} tw-right-2`}>
        <LuChevronRight className='tw-h-5 tw-w-5' />
      </button>
    </div>
  )
}

export default BannerCarousel
