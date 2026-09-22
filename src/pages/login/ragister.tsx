import React, { useEffect } from 'react'
import User from '../../models/User'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getUserInfoAction, loginAction, loginUserAction } from '../../redux/actions/login/login.action'
import { selectUserData, updateMessage, userUpdate } from '../../redux/actions/login/loginSlice'
import { useWebsocketUser } from '../../context/webSocketUser'
import { useNavigateCustom } from '../_layout/elements/custom-link'
import { isMobile } from 'react-device-detect'
import api from '../../utils/api'
import SubmitButton from '../../components/SubmitButton'

const Ragistration = () => {
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserData)
  const { socketUser } = useWebsocketUser()
  const navigate = useNavigateCustom()

  const [ragistrationForm, setRagistrationForm] = React.useState<User & {
    phone?: string
    otp?: string
  }>({
    username: '',
    password: '',
    logs: '',
    isDemo: false,
    phone:'',
    otp: ''
  })

  const [otpSent, setOtpSent] = React.useState(false)
  const [otpLoading, setOtpLoading] = React.useState(false)

  React.useEffect(() => {
    api.get(`${process.env.REACT_APP_IP_API_URL}`).then((res) => {
      setRagistrationForm((prev) => ({ ...prev, logs: res.data }))
    })
  }, [])

  useEffect(()=>{
   console.log(userState,'userstate')
  },[userState])

  React.useEffect(() => {
    if (userState.status === 'done') {
      const { role, _id } = userState.user
      socketUser.emit('login', {
        role: userState.user.role,
        sessionId: userState.user.sessionId,
        _id,
      })
      localStorage.setItem('login-session', userState.user.sessionId)

      if (userState.user.role && ['admin', '1', '2', '3'].includes(userState.user.role)) {
        return navigate.go('/')
      }

      return isMobile ? navigate.go('/match/4/sports') : navigate.go('/')
    }
  }, [userState])

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRagistrationForm({ ...ragistrationForm, [e.target.name]: e.target.value })
  }

  const handleSendOtp = async () => {
    if (!ragistrationForm.phone) {
      alert('Please enter your phone number first.')
      return
    }
    try {
      setOtpLoading(true)
      const res = await api.post('/send-otp', { phone: ragistrationForm.phone })
      if (res.data.success) {
        setOtpSent(true)
        alert('OTP sent successfully!')
      } else {
        alert(res.data.message || 'Failed to send OTP')
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Error sending OTP')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!otpSent) {
      alert('Please verify your phone with OTP first.')
      return
    }
    if (!ragistrationForm.otp) {
      alert('Please enter OTP before proceeding.')
      return
    }
    dispatch(loginUserAction(ragistrationForm))
  }

  return (
    <div>
      <div className='login register-cont'>
        <div className='loginInner1'>
          <div className='log-logo mt-2  text-center'>
            <img src='/imgs/logo.png' className='logo-login' />
          </div>
          <div className='featured-box-login featured-box-secundary default'>
            <h4 className='text-center'>
              Register <i className='fas fa-hand-point-down'></i>
            </h4>
            <div className='whatsapp-box-register'>
               <div>
                  <span>Register as New User</span>
                  <h4>Get your instant ID from whatsapp</h4>
               </div>
               <a href="https://wa.me/1234567890" className='create-whatsapp-link'>
                  <div className='whatsapp-icon'>
                     <i className="fab fa-whatsapp"></i>
                 </div>
                  <div className='click-here'>
                    click here
                  </div>
               </a>
            </div>
            <form onSubmit={handleSubmit} role='form' autoComplete='off' method='post'>
              <div className='form-group mt-2'>
                <input
                  name='username'
                  placeholder='User Name'
                  type='text'
                  className='form-control'
                  onChange={handleForm}
                  style={{background:'none'}}
                  required
                />
                <i className='fas fa-user user-icon-new'></i>
              </div>

              <div className='form-group mt-2'>
                <input
                  name='password'
                  placeholder='Password'
                  type='password'
                  className='form-control'
                  onChange={handleForm}
                  style={{background:'none'}}
                  required
                />
                <i className='fas fa-key user-icon-new'></i>
              </div>

              <div className='form-group mt-2'>
                <input
                  name='phone'
                  placeholder='Phone Number'
                  type='tel'
                  className='form-control'
                  onChange={handleForm}
                  style={{background:'none'}}
                  required
                />
                <i className='fas fa-phone user-icon-new'></i>
              </div>

              <div className='form-group mt-2 mb-2 otp-field' style={{ display: 'flex' }}>
                <input
                  name='otp'
                  placeholder='Enter OTP'
                  type='text'
                  className='form-control otp-input-form-register'
                  onChange={handleForm}
                  value={ragistrationForm.otp}
                  disabled={!otpSent}
                  style={{background:'none'}}
                />
                <button
                  type='button'
                  onClick={handleSendOtp}
                  className='btn btn-secondary btn-register-sendOTP'
                  disabled={otpLoading}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {otpLoading ? (
                    <i className='fas fa-spinner fa-spin'></i>
                  ) : (
                    otpSent ? 'Resend OTP' : 'Send OTP'
                  )}
                </button>
              </div>

              {userState.error && <small className='text-danger'>{userState.error}</small>}

              <div className='form-group text-center mb-0'>
                <SubmitButton type='submit' className='btn btn-submit btn-login mb-10'>
                  Register
                  {userState.status === 'loading' ? (
                    <i className='ml-2 fas fa-spinner fa-spin'></i>
                  ) : (
                    <i className='ml-2 fas fa-sign-in-alt'></i>
                  )}
                </SubmitButton>

                {/* <div style={{ margin: '10px 0' }}>Or</div> */}
<small className='recaptchaTerms'>
                  This site is protected by reCAPTCHA and the Google{' '}
                  <a
                    target={'_blank'}
                    rel='noopener noreferrer'
                    href='https://policies.google.com/privacy'
                  >
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a
                    target={'_blank'}
                    rel='noopener noreferrer'
                    href='https://policies.google.com/terms'
                  >
                    Terms of Service
                  </a>{' '}
                  apply.
                </small>
                <SubmitButton
                  type='button'
                  onClick={() => navigate.go('/login')}
                  className='btn btn-submit btn-login btn-register-new'
                >
                  <span style={{color:'black',fontWeight:'bold'}}>Already have User?</span> <b> Login here</b>  
                  <i className='ml-2 fas fa-sign-in-alt'></i>
                </SubmitButton>

                
              </div>
            </form>
          </div>
        </div>
      </div>

       <section className="footer footer-login">
             <div className="footer-top">
               <div className="footer-links">
                 <nav className="navbar navbar-expand-sm navbar-login-div">
                   <ul className="navbar-nav">
                     <li className={`nav-item ${isMobile ? 'mt-2':''}`} style={{display:'flex',alignItems:'center'}}>
                       <a className="nav-link" href="/terms-and-conditions" target="_blank"> Terms and Conditions </a>
                      <a className="nav-link" href="/responsible-gaming" target="_blank"> Responsible Gaming </a>
                     </li>
                   </ul>
                 </nav>
               </div>
               <div className="support-detail">
                 <h2>24X7 Support</h2>
               </div>
               
               {/* <div className="social-icons-box"></div> */}
             </div>
          </section>
    </div>
  )
}

export default Ragistration