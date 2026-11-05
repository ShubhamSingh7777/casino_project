import React from 'react'
import { useNavigate } from 'react-router-dom'
import IMatch from '../../../models/IMatch'
import { useUi } from '../../context/UiContext'
import { useEscape } from '../../hooks/useClickOutside'
import { formatFullTime, getStartStatus } from '../../utils/format'
import { getSeriesName } from '../../utils/match'
import { LuChevronDown, LuChevronLeft, LuTv, LuX } from '../../icons'

export const EventBreadcrumb = ({ match, onRules }: { match: IMatch; onRules?: () => void }) => {
  const navigate = useNavigate()
  const { timezone } = useUi()
  const status = getStartStatus(match.matchDateTime)
  return (
    <div className='tw-flex tw-h-11 tw-items-center tw-gap-2 tw-rounded-t-ua tw-bg-primary tw-pr-3 tw-text-white'>
      <button type='button' aria-label='Go back' onClick={() => navigate(-1)} className='tw-flex tw-h-11 tw-w-10 tw-shrink-0 tw-items-center tw-justify-center'>
        <LuChevronLeft className='tw-h-5 tw-w-5' />
      </button>
      <p className='tw-m-0 tw-flex tw-min-w-0 tw-flex-1 tw-items-center tw-gap-1 tw-text-strong'>
        <span className='tw-max-w-[40%] tw-truncate tw-font-normal tw-text-white/70'>{getSeriesName(match)}</span>
        <span className='tw-text-white/50'>/</span>
        <span className='tw-truncate'>{match.name}</span>
      </p>
      {onRules && (
        <button type='button' onClick={onRules} className='tw-shrink-0 tw-text-meta tw-font-bold tw-text-rules tw-underline'>
          Rules
        </button>
      )}
      <span className='tw-hidden tw-shrink-0 tw-text-meta sm:tw-inline'>{formatFullTime(match.matchDateTime, timezone)}</span>
      {status !== 'scheduled' && (
        <span
          className={`tw-h-2 tw-w-2 tw-shrink-0 tw-animate-pulse tw-rounded-full ${status === 'soon' ? 'tw-bg-warning' : 'tw-bg-success'}`}
          aria-label={status === 'soon' ? 'Starting soon' : 'Live'}
        />
      )}
    </div>
  )
}

export type EventTab = 'market' | 'video'

/** Market | Live Video. A single centred "Market" tab when the event has no video (v2 §5.5). */
export const MarketVideoTabs = ({ tab, onChange, hasVideo }: { tab: EventTab; onChange: (t: EventTab) => void; hasVideo: boolean }) => (
  <div role='tablist' className={`tw-grid tw-bg-primary-two ${hasVideo ? 'tw-grid-cols-2' : 'tw-grid-cols-1'}`}>
    {(hasVideo ? (['market', 'video'] as EventTab[]) : (['market'] as EventTab[])).map((t) => (
      <button
        key={t}
        role='tab'
        type='button'
        aria-selected={tab === t}
        onClick={() => onChange(t)}
        className={`tw-h-10 tw-text-strong ${tab === t ? 'tw-bg-white/10 tw-text-white' : 'tw-text-white/60'}`}
      >
        {t === 'market' ? 'Market' : 'Live Video'}
      </button>
    ))}
  </div>
)

/** 16:9 player, or the "No Live Video Available" empty state. */
export const VideoPanel = ({ src }: { src?: string }) => (
  <div className='tw-relative tw-aspect-video tw-w-full tw-overflow-hidden tw-bg-black'>
    {src ? (
      <iframe title='Live video' src={src} allow='autoplay; fullscreen' className='tw-absolute tw-inset-0 tw-h-full tw-w-full tw-border-0' />
    ) : (
      <div className='tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2 tw-px-4 tw-text-center tw-text-white'>
        <LuTv className='tw-h-10 tw-w-10 tw-text-white/60' />
        <p className='tw-m-0 tw-text-section'>No Live Video Available</p>
        <p className='tw-m-0 tw-text-meta tw-text-white/70'>We don&apos;t have a broadcast for this event right now.</p>
      </div>
    )}
  </div>
)

/** Collapsible "Scoreboard" / "Graphics" card around the provider's scorecard frame. */
export const ScorePanel = ({ title, src, height }: { title: string; src?: string; height: number }) => {
  const [open, setOpen] = React.useState(true)
  return (
    <div className='tw-mb-2 tw-overflow-hidden tw-rounded-b-ua tw-bg-white'>
      <button
        type='button'
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className='tw-flex tw-h-10 tw-w-full tw-items-center tw-gap-2 tw-px-3 tw-text-strong'
      >
        <LuTv className='tw-h-4 tw-w-4' /> {title}
        <LuChevronDown className={`tw-ml-auto tw-h-4 tw-w-4 tw-transition-transform ${open ? '' : '-tw-rotate-90'}`} />
      </button>
      {open &&
        (src ? (
          <iframe title={title} src={src} style={{ height }} className='tw-block tw-w-full tw-border-0' />
        ) : (
          <p className='tw-m-0 tw-pb-6 tw-pt-2 tw-text-center tw-text-body tw-text-muted-fg'>No {title} Available</p>
        ))}
    </div>
  )
}

export const RulesDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  useEscape(onClose, open)
  if (!open) return null
  return (
    <div className='tw-fixed tw-inset-0 tw-z-[70] tw-flex tw-items-center tw-justify-center tw-p-3'>
      <div className='tw-absolute tw-inset-0 tw-bg-black/60' onClick={onClose} />
      <div role='dialog' aria-modal='true' aria-label='Rules' className='tw-relative tw-w-full tw-max-w-[420px] tw-rounded-xl tw-bg-white tw-p-5'>
        <button type='button' aria-label='Close rules' onClick={onClose} className='tw-absolute tw-right-3 tw-top-3 tw-p-1 tw-text-muted-fg'>
          <LuX className='tw-h-5 tw-w-5' />
        </button>
        <h2 className='tw-mb-2 tw-text-title'>Rules</h2>
        <p className='tw-m-0 tw-text-body tw-text-muted-fg'>No rules available.</p>
      </div>
    </div>
  )
}
