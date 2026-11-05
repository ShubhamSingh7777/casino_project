import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LuChevronLeft, LuExternalLink } from '../../icons'
import '../../styles/user-app.css'

/** Only launch URLs from the provider API are expected here; anything else is refused. */
const safeUrl = (raw: string | null) => {
  try {
    const u = new URL(raw || '')
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : null
  } catch {
    return null
  }
}

/**
 * /casino-play?url=…&name=… — full-screen frame for provider (int-casino) games, no site chrome.
 * Some providers refuse to be framed, so "Open in new tab" is always available.
 */
const ProviderGameShell = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const url = safeUrl(params.get('url'))
  const name = params.get('name') || 'Game'

  return (
    <div id='ua-root'>
      <div className='ua-ui tw-flex tw-h-[100dvh] tw-flex-col tw-bg-black'>
        <header className='tw-flex tw-h-12 tw-shrink-0 tw-items-center tw-gap-2 tw-bg-primary tw-px-2 tw-text-white'>
          <button type='button' aria-label='Back' onClick={() => navigate(-1)} className='tw-flex tw-items-center tw-gap-1 tw-rounded-md tw-px-2 tw-py-1.5 hover:tw-bg-white/10'>
            <LuChevronLeft className='tw-h-5 tw-w-5' /> Back
          </button>
          <h1 className='tw-min-w-0 tw-flex-1 tw-truncate tw-text-strong'>{name}</h1>
          {url && (
            <a href={url} target='_blank' rel='noreferrer' className='tw-flex tw-items-center tw-gap-1 tw-rounded-md tw-px-2 tw-py-1.5 tw-text-meta hover:tw-bg-white/10'>
              <LuExternalLink className='tw-h-4 tw-w-4' /> Open in new tab
            </a>
          )}
        </header>
        {url ? (
          <iframe title={name} src={url} allow='autoplay; fullscreen; encrypted-media' allowFullScreen className='tw-w-full tw-flex-1 tw-border-0' />
        ) : (
          <p className='tw-m-auto tw-text-body tw-text-white/70'>This game link is not valid.</p>
        )}
      </div>
    </div>
  )
}

export default ProviderGameShell
