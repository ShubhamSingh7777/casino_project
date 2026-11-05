import React from 'react'
import { useLocation } from 'react-router-dom'
import { useUi } from '../context/UiContext'
import Sheet from '../components/Sheet'
import SportList from './SportList'

const SideDrawer = () => {
  const { drawerOpen, setDrawerOpen } = useUi()
  const { pathname } = useLocation()
  const close = React.useCallback(() => setDrawerOpen(false), [setDrawerOpen])

  React.useEffect(close, [pathname])

  return (
    <Sheet open={drawerOpen} onClose={close} side='left' label='Sports menu' className='ua-ui xl:tw-hidden'>
      <SportList onNavigate={close} />
    </Sheet>
  )
}

export default SideDrawer
