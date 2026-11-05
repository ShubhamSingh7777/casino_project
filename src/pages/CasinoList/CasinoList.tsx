import React from 'react'
import { isMobile } from 'react-device-detect'
import CasinoListItem from './CasinoListItem'
const CasinoList = () => {
  const casinoWidth = isMobile ? 'col-3' : 'col-2'
  return (
    <>
      <div className='game-heading'>
        <span className='card-header-title'>Casino Games</span>
      </div>
      <div className='col-12' style={{paddingRight: '0px',paddingLeft: '0px',}}>
        <div className='card-content pt30 pt7 pb30'>
          <CasinoListItem />
        </div>
      </div>
    </>
  )
}
export default React.memo(CasinoList)
