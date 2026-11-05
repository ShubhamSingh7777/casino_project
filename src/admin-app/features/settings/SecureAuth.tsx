import React from 'react'
import { Card, PageHeader } from '../../ui/PageHeader'
import { Button, inputClass } from '../../ui/Button'
import { Tabs } from '../../ui/Modal'

type Method = 'app' | 'telegram' | 'google'

/**
 * Secure Auth Verification (spec §4.26). The backend has no 2FA endpoints, so the steps are
 * shown but nothing can be submitted and the status stays "Disabled".
 */
const SecureAuth = () => {
  const [method, setMethod] = React.useState<Method>('app')
  return (
    <div>
      <PageHeader title='Secure Auth Verification' />
      <Card className='tw-text-center'>
        <p className='tw-mb-2 tw-text-[14px] tw-font-semibold'>
          Secure Auth Verification Status: <span className='tw-ml-1 tw-rounded tw-bg-ad-danger tw-px-2 tw-py-0.5 tw-text-[12px]'>Disabled</span>
        </p>
        <p className='tw-mb-4 tw-text-[13px] tw-text-ad-muted'>Please select below option to enable secure auth verification</p>
        <div className='tw-flex tw-justify-center'>
          <Tabs<Method>
            tabs={[
              { key: 'app', label: 'Enable Using Mobile App' },
              { key: 'telegram', label: 'Enable Using Telegram' },
              { key: 'google', label: 'Enable Using Google Auth' },
            ]}
            active={method}
            onChange={setMethod}
          />
        </div>
        <div className='tw-mx-auto tw-max-w-md'>
          {method === 'app' ? (
            <>
              <p className='tw-mb-2 tw-text-[13px]'>Please enter below auth code in your &apos;Secure Auth Verification App&apos;.</p>
              <p className='tw-mb-2 tw-text-[28px] tw-font-bold tw-tracking-[0.3em] tw-text-ad-muted'>------</p>
              <p className='tw-text-[12px] tw-text-ad-muted'>The code appears here once secure auth is connected to the server.</p>
            </>
          ) : (
            <>
              <p className='tw-mb-2 tw-text-[13px]'>Please enter your login password to continue</p>
              <div className='tw-flex tw-gap-2'>
                <input type='password' disabled placeholder='Login password' aria-label='Login password' className={inputClass} />
                <Button disabled className='tw-shrink-0'>
                  {method === 'telegram' ? 'Get Connection ID' : 'Submit'}
                </Button>
              </div>
            </>
          )}
          <p className='tw-mt-4 tw-rounded tw-bg-ad-warning/20 tw-px-3 tw-py-1.5 tw-text-[12px] tw-text-ad-warning'>Secure auth is not connected to the server yet.</p>
        </div>
      </Card>
    </div>
  )
}

export default SecureAuth
