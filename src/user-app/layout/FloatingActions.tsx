import React from 'react'
import { useLocation } from 'react-router-dom'
import { LuDownload } from '../icons'
import { useAppSelector } from '../../redux/hooks'
import { selectUserContact, selectUserContactFixed } from '../../redux/actions/login/loginSlice'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

/**
 * Bottom floating actions: "Install App" pill (right) and the WhatsApp / Telegram
 * support buttons the legacy layout showed (left). Hidden on odds/casino screens, as before.
 */
const FloatingActions = () => {
  const { pathname } = useLocation()
  const { canInstall, install } = useInstallPrompt()
  const contact = useAppSelector(selectUserContact)
  const contactFixed = useAppSelector(selectUserContactFixed)

  if (pathname.includes('odds') || pathname.includes('casino')) return null

  const whatsapp = contact?.whatsapp || contactFixed?.whatsapp
  const telegram = contact?.telegram || contactFixed?.telegram
  const bottom = 'tw-bottom-[calc(64px+16px+env(safe-area-inset-bottom))] xl:tw-bottom-4'

  return (
    <>
      {(whatsapp || telegram) && (
        <div className={`tw-fixed tw-left-3 tw-z-30 tw-flex tw-flex-col tw-gap-2 ${bottom}`}>
          {whatsapp && (
            <a href={`https://wa.me/${whatsapp}`} target='_blank' rel='noreferrer' aria-label='Chat on WhatsApp'>
              <img src='/whatsapp.png' alt='' className='tw-h-11 tw-w-11' />
            </a>
          )}
          {telegram && (
            <a href={`https://t.me/${telegram}`} target='_blank' rel='noreferrer' aria-label='Chat on Telegram'>
              <img src='/Telegram.png' alt='' className='tw-h-11 tw-w-11' />
            </a>
          )}
        </div>
      )}
      {canInstall && (
        <button
          type='button'
          onClick={install}
          className={`tw-fixed tw-right-3 tw-z-30 tw-flex tw-h-10 tw-items-center tw-gap-2 tw-rounded-full tw-bg-primary tw-px-4 tw-text-sm tw-font-semibold tw-text-white tw-shadow-lg ${bottom}`}
        >
          <LuDownload className='tw-h-4 tw-w-4' /> Install App
        </button>
      )}
    </>
  )
}

export default FloatingActions
