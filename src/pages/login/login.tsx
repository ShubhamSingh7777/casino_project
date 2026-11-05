import React from 'react'
import User from '../../models/User'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { loginAction } from '../../redux/actions/login/login.action'
import { selectUserData } from '../../redux/actions/login/loginSlice'
import { useWebsocketUser } from '../../context/webSocketUser'
import { useNavigateCustom } from '../_layout/elements/custom-link'
import { isMobile } from 'react-device-detect'
import api from '../../utils/api'
import SubmitButton from '../../components/SubmitButton'

const Login = () => {
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserData)
  const { socketUser } = useWebsocketUser()

  const navigate = useNavigateCustom()

  const [showPassword, setShowPassword] = React.useState(false)
  const [loginForm, setLoginForm] = React.useState<User>({
    username: '',
    password: '',
    logs: '',
    isDemo: false
  })

  React.useEffect(() => {
    api.get(`${process.env.REACT_APP_IP_API_URL}`).then((res) => {
      setLoginForm({ ...loginForm, logs: res.data })
    })
  }, [])

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
      // return isMobile ? navigate.go('/') : navigate.go('/')

    }
  }, [userState])

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
  }
  const handleSubmitDemoLogin = () => {
    const loginFormNew = { ...loginForm, isDemo: true };
    setLoginForm(loginFormNew);
    localStorage.setItem("isDemo", "true");
    dispatch(loginAction(loginFormNew)); // directly call action with updated form
    return isMobile ? navigate.go('/match/4') : navigate.go('/match/4')

  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(loginAction(loginForm))
  }
  return (
    <div>
      <div className='login'>
        <div className='loginInner1'>
          <div className={`log-logo  text-center ${isMobile ? 'm-b-0' : 'm-b-20'}`}>
            <img src='/imgs/logo.png' className='logo-login' />
          </div>
          <div className={`featured-box-login ${isMobile ? 'mt-4' : ''} featured-box-secundary default`}>
            <h4 className='text-center'>
              Login <i className='fas fa-hand-point-down'></i>
            </h4>
            <form
              onSubmit={(e) => handleSubmit(e)}
              role='form'
              autoComplete='off'
              method='post'
              style={{ marginBottom: '0' }}
            >
              <div className='form-group mb-4'>
                <input
                  name='username'
                  placeholder='Username'
                  type='text'
                  className='form-control'
                  aria-required='true'
                  aria-invalid='false'
                  onChange={handleForm}
                  required
                />
                <i className='fas fa-user user-icon-new'></i>
                <small className='text-danger' style={{ display: 'none' }}></small>
              </div>
              <div className='form-group mb-4'>
                <input
                  name='password'
                  placeholder='Password'
                  type={showPassword ? 'text' : 'password'}
                  className='form-control'
                  aria-required='true'
                  aria-invalid='false'
                  onChange={handleForm}
                  required
                />
                <i
                  className={`fas ${showPassword ? 'fa-unlock' : 'fa-key'} user-icon-new`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                ></i>
                {userState.error ? (
                  <small className='text-danger'>{userState.error}</small>
                ) : (
                  ''
                )}
              </div>
              <div className='form-group text-center mb-0'>
                <SubmitButton type='submit' className='btn btn-submit btn-login'>
                  Login
                  {userState.status === 'loading' ? (
                    <i className='ml-2 fas fa-spinner fa-spin'></i>
                  ) : (
                    <i className='ml-2 fas fa-sign-in-alt' style={{ color: 'white !important' }}></i>
                  )}
                </SubmitButton>
                {/* <div className='text-end w-100 forgot-password-new'>
                    <a  href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">Forgot Password?</a>
                </div> */}
                <SubmitButton type='submit' formNoValidate onClick={() => handleSubmitDemoLogin()} className='btn btn-submit demo-btnLogin btn-login mt-2 mb-10'>
                  Login with Demo ID
                  {userState.status === 'loading' ? (
                    <i className='ml-2 fas fa-spinner fa-spin'></i>
                  ) : (
                    <i className='ml-2 fas fa-sign-in-alt' style={{ color: 'white !important' }}></i>
                  )}
                </SubmitButton>
                {/* <div style={{margin:'10px 0'}}>Or</div> */}
                <small className='recaptchaTerms mt-1'>
                  This site is protected by reCAPTCHA and the Google
                  <a
                    target={'_blank'}
                    rel='noopener noreferrer'
                    href='https://policies.google.com/privacy'
                    style={{ textDecoration: 'none' }}
                  >
                    Privacy Policy
                  </a>{' '}
                  and
                  <a
                    target={'_blank'}
                    rel='noopener noreferrer'
                    href='https://policies.google.com/terms'
                    style={{ textDecoration: 'none' }}
                  >
                    Terms of Service
                  </a>{' '}
                  apply.
                </small>
                <SubmitButton type='submit' formNoValidate onClick={() => navigate.go('/register')} className='btn btn-submit btn-register-new btn-login mb-0'>
                  <span style={{ color: 'black', fontWeight: 'bold' }}>Don't have User ?</span> <b> Register here</b>
                  {userState.status === 'loading' ? (
                    <i className='ml-2 fas fa-spinner fa-spin'></i>
                  ) : (
                    <i className='ml-2 fas fa-sign-in-alt' style={{ color: 'white !important' }}></i>
                  )}
                </SubmitButton>

              </div>
              {/* <div className='mt-2 text-center download-apk'></div> */}
            </form>
          </div>
        </div>
      </div>
      <section className="footer footer-login">
        <div className="footer-top">
          <div className="footer-links">
            <nav className="navbar navbar-expand-sm navbar-login-div">
              <ul className="navbar-nav">
                <li className={`nav-item ${isMobile ? 'mt-2' : ''}`} style={{ display: 'flex', alignItems: 'center' }}>
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

export default Login