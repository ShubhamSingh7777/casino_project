import InputComponent from './InputComponent'
import React, { ChangeEvent } from 'react'
import { toast } from 'react-toastify'
import UserService from '../../services/user.service'
import mobileSubheader from '../_layout/elements/mobile-subheader'
import { isMobile } from 'react-device-detect'
import { useAppDispatch } from '../../redux/hooks'
import { useNavigateCustom } from '../_layout/elements/custom-link'
import { logout } from '../../redux/actions/login/loginSlice'
import { useLocation } from 'react-router-dom'

const ChangePassword = () => {
  const [passobj, setpassobj] = React.useState<any>({})
  const [errorMsg, setErrorMsg] = React.useState({})
  const dispatch = useAppDispatch()
  const navigate = useNavigateCustom()

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const btnObj = { ...passobj }
    btnObj[event.target.name] = event.target.value
    setpassobj(btnObj)
  }
  const location = useLocation();

  const submitHandler = () => {
    const errormsg: any = {}
    if (!passobj['current_password']) {
      errormsg['current_password'] = 'Please Enter Current Password'
    }
    if (!passobj['new_password']) {
      errormsg['new_password'] = 'Please Enter New Password'
    }
    if (!passobj['confirm_password']) {
      errormsg['confirm_password'] = 'Please Enter Confirm Password'
    }
    if (
      passobj['confirm_password'] &&
      passobj['new_password'] &&
      passobj['new_password'] != passobj['confirm_password']
    ) {
      errormsg['confirm_password'] = 'New Password and Confirm Password does Not Match'
    }
    if (errormsg && Object.keys(errormsg).length > 0) {
      setErrorMsg(errormsg)
      return
    }
    UserService.updateuserpassword(passobj)
      .then(() => {
        toast.success('Password Updated Successfully')
        dispatch(logout())
        navigate.go('/login')
      })
      .catch((e) => {
        const error = e.response.data.message
        setErrorMsg(e.response.data.errors)
        toast.error(error)
      })
  }

  const renderInputBox = (name: string, label: string) => {
    const rendbox = []
    rendbox.push(
      <InputComponent
        key={0}
        valName={`${name}`}
        labelName={`${label}`}
        changeHandler={changeHandler}
        errorMsg={errorMsg}
        btnValue={passobj}
      />,
    )
    return rendbox
  }

  return (
    <>
      {mobileSubheader.subheader('Change Password')}
      <div className={!isMobile ? 'col-md-12 mt-1 p-0 casinoListCustom' : 'col-md-12 padding-custom casinoListCustom'} style={{boxShadow: '0 0 5px #a4a4a4', borderRadius: '5px'}}>
        <div className='adminChangePaaswordbg'>
          {mobileSubheader.subheaderdesktop('Change Password',location.pathname)}
          <div className='card-body' style={{padding : isMobile ? '5px 0px' : '6px'}}>
            <div className='row row5 mb-3'>
              <div className='col-12 col-lg-6'>
                {renderInputBox('current_password', 'Current Password')}
              </div>
            </div>
            <div className='row row5 mb-3'>
              <div className='col-12 col-lg-6'>
                {renderInputBox('new_password', 'New Password')}
              </div>
            </div>

            <div className='row row5 mb-4'>
              <div className='col-12 col-lg-6'>
                {renderInputBox('confirm_password', 'Confirm Password')}
              </div>
            </div>

            <div className='row row5 mt-2 mb-3'>
              <div className='col-12 col-lg-6'>
                <button className='btn btn-primary updateBtnSubmit' style={{width: isMobile ? '100%': '100%'}} onClick={submitHandler}>
                 Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default ChangePassword
