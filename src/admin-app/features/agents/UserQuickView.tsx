import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import { RoleName } from '../../../models/User'
import userService from '../../../services/user.service'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { LuCheck, LuX } from '../../ui/icons'

const money = (n: any) => Number(n || 0).toFixed(2)

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className='tw-rounded tw-bg-ad-card tw-p-3'>
    <h3 className='tw-mb-2 tw-text-[13px] tw-font-semibold'>{title}</h3>
    {children}
  </section>
)

const Mark = ({ on }: { on: boolean }) =>
  on ? <LuCheck className='tw-h-4 tw-w-4 tw-text-ad-success' aria-label='Yes' /> : <LuX className='tw-h-4 tw-w-4 tw-text-ad-danger' aria-label='No' />

/**
 * User Quick-View (spec §5.10), opened from the header "Search User". Game detail and lock state
 * come from get-parent-user-detail; per-event game locks have no API, so that panel stays empty.
 */
const UserQuickView = ({ username, onClose }: { username: string | null; onClose: () => void }) => {
  const navigate = useNavigate()
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    if (!username) return
    setUser(null)
    userService
      .getParentUserDetail(username)
      .then((res: AxiosResponse<any>) => setUser(res.data?.data?.[0] || { username }))
      .catch(() => setUser({ username }))
  }, [username])

  const exposure = Number(user?.balance?.exposer || 0) + Number(user?.balance?.casinoexposer || 0)
  const th = 'tw-py-1 tw-text-left tw-font-semibold tw-text-ad-muted'

  return (
    <Modal open={!!username} title='Market Analysis' onClose={onClose} width='tw-max-w-5xl'>
      {!user ? (
        <p className='tw-py-6 tw-text-center tw-text-ad-muted'>Loading…</p>
      ) : (
        <>
          <div className='tw-grid tw-gap-3 md:tw-grid-cols-3'>
            <Panel title='Game Detail'>
              <dl className='tw-text-[12px]'>
                {[
                  ['Username', user.username],
                  ['Account Type', RoleName[user.role] || user.role || '-'],
                  ['General', money(user.balance?.balance)],
                  ['Exposure', money(exposure)],
                  ['Credit Reference', money(user.creditRefrences)],
                ].map(([k, v]) => (
                  <div key={k} className='tw-flex tw-justify-between tw-border-0 tw-border-b tw-border-solid tw-border-white/10 tw-py-1.5'>
                    <dt className='tw-text-ad-muted'>{k}</dt>
                    <dd className='tw-m-0 tw-font-semibold tw-tabular-nums'>{v}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
            <Panel title='User Lock'>
              <table className='tw-w-full tw-text-[12px]'>
                <thead>
                  <tr>
                    <th className={th}>Master Name</th>
                    <th className={th}>User Act</th>
                    <th className={th}>Bet Active</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='tw-py-1.5 tw-text-white'>{user.parent?.username || user.username}</td>
                    <td className='tw-py-1.5'>
                      <Mark on={!!user.isLogin} />
                    </td>
                    <td className='tw-py-1.5'>
                      <Mark on={!!user.betLock} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </Panel>
            <Panel title='Game Lock'>
              <table className='tw-w-full tw-text-[12px]'>
                <thead>
                  <tr>
                    <th className={th}>S.No.</th>
                    <th className={th}>Master Name</th>
                    <th className={th}>Bet Lock</th>
                    <th className={th}>Event Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className='tw-py-3 tw-text-center tw-text-ad-muted'>
                      No records found
                    </td>
                  </tr>
                </tbody>
              </table>
            </Panel>
          </div>
          <div className='tw-mt-3 tw-flex tw-justify-end'>
            <Button
              onClick={() => {
                onClose()
                navigate(`/admin/list-clients/${user.username}?search=true`)
              }}
            >
              Open in Agent Listing
            </Button>
          </div>
        </>
      )}
    </Modal>
  )
}

export default UserQuickView
