import InputComponent from './InputComponent'
import React, { ChangeEvent } from 'react'
import { toast } from 'react-toastify'
import UserService from '../../services/user.service'
import mobileSubheader from '../_layout/elements/mobile-subheader'
import { isMobile } from 'react-device-detect'

const ButtonValues = () => {
  const [btn, setBtn] = React.useState<any>({})
  const [errorMsg, setErrorMsg] = React.useState({})
  const [activeTab, setActiveTab] = React.useState('game')

  React.useEffect(() => {
    UserService.getUserStake()
      .then((res) => {
        setBtn(res.data.data.userStake)
      })
      .catch((e) => {
        const error = e.response.data.message
        toast.error(error)
      })
  }, [])

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const btnObj = { ...btn }
    btnObj[event.target.name] = event.target.value
    setBtn(btnObj)
  }

  const submitHandler = () => {
    UserService.updateUserStake(btn)
      .then(() => {
        toast.success('Buttons Values Updated Successfully')
      })
      .catch((e) => {
        const error = e.response.data.message
        setErrorMsg(e.response.data.errors)
        toast.error(error)
      })
  }

  const renderButtonValue = () => {
    const inputButtons = []
    if (activeTab === 'game') {
      for (let i = 1; i <= 10; i++) {
        inputButtons.push(
          <InputComponent
            key={`game-${i}`}
            btnName={`name${i}`}
            valName={`value${i}`}
            changeHandler={changeHandler}
            btnValue={btn}
            errorMsg={errorMsg}
          />,
        )
      }
    } else {
      for (let i = 1; i <= 6; i++) {
        inputButtons.push(
          <InputComponent
            key={`casino-${i}`}
            btnName={`casinoName${i}`}
            valName={`casinoValue${i}`}
            changeHandler={changeHandler}
            btnValue={btn}
            errorMsg={errorMsg}
          />,
        )
      }
    }
    return inputButtons
  }

  return (
    <>
      {/* {mobileSubheader.subheader('Change Button Values')} */}
      <div className={!isMobile ? 'col-lg-12 p-0' : 'col-12 padding-custom'} style={{padding: isMobile ?'0px':'',marginBottom:isMobile?'32px':''}}>
        <div className='card'>
          {/* {mobileSubheader.subheaderdesktop('Change Button Values')} */}
          <div className='card-body p10'>
            <div className='d-flex mt-5 mb-3'>
                 <div className='nav-item mt-2'>
                    <a className='gameButtons' 
                       style={{marginRight:'0px', backgroundColor: activeTab === 'game' ? '' : '#cccccc', color: activeTab === 'game' ? '' : '#000000', cursor: 'pointer'}}
                       onClick={() => setActiveTab('game')}>Game Buttons</a>
                 </div>
                 <div className='nav-item mt-2'>
                    <a className='gameButtons' 
                       style={{backgroundColor: activeTab === 'casino' ? '' : '#cccccc', color: activeTab === 'casino' ? '' : '#000000', cursor: 'pointer'}}
                       onClick={() => setActiveTab('casino')}>Casino Buttons</a>
                 </div>
            </div>
            <div className='row row5 mbc-5'>
              <div className='col-6 col-lg-6 mb-2' style={{maxWidth:'50%'}}>
                <div className='button-title' style={{fontSize:isMobile?'12px':'',color:'#000000'}}>
                  <span>
                    <b>Price Label:</b>
                  </span>
                </div>
              </div>
              <div className='col-6 col-lg-6 mb-2' style={{maxWidth:'50%'}}>
                <div className='button-title' style={{fontSize:isMobile?'12px':'',color:'#000000',marginBottom:isMobile?'.5rem':'',paddingLeft:isMobile?'3px':'4px'}}>
                  <span>
                    <b>Price Value:</b>
                  </span>
                </div>
              </div>
            </div>
            {renderButtonValue()}
            <div className='row row5 mt-2'>
              <div className='col-12 col-lg-6' style={{paddingRight:isMobile?'5px':'10px'}}>
                <button className='btn btn-primary' onClick={submitHandler} style={{fontSize:isMobile?'16px':''}}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default ButtonValues
