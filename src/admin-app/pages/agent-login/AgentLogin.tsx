import React from 'react'
import { useNavigate } from 'react-router-dom'
import agentService from '../../../services/agent.service'

const AgentLogin = () => {
  const navigate = useNavigate()
  const [form, setForm] = React.useState({ username: '', password: '' })
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // If already logged in, redirect
  React.useEffect(() => {
    if (agentService.isAgentLoggedIn()) {
      navigate('/agent')
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      return setError('Username and password are required')
    }
    setLoading(true)
    try {
      const res = await agentService.agentLogin(form.username, form.password)
      if (res.data?.success) {
        agentService.saveAgentSession(res.data.data)
        navigate('/agent')
      } else {
        setError(res.data?.message || 'Login failed')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login'>
      <div className='wrapper d-flex justify-content-center align-items-center'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='loginInner1'>
                <div className='log-logo m-b-20 text-center'>
                  <img src='/imgs/logo.png' className='logo-login' style={{ maxWidth: '250px', maxHeight: '100px' }} />
                </div>
                <div className='featured-box-login featured-box-secundary default log-fld'>
                  <h2 className='text-center'>Agent Login</h2>
                  <form onSubmit={handleSubmit} role='form' autoComplete='off' method='post'>
                    <div className='form-group m-b-20'>
                      <input
                        name='username'
                        placeholder='Agent Username'
                        type='text'
                        className='form-control'
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className='form-group m-b-20'>
                      <input
                        name='password'
                        placeholder='Password'
                        type='password'
                        className='form-control'
                        onChange={handleChange}
                        required
                      />
                      {error && <small className='text-danger'>{error}</small>}
                    </div>
                    <div className='form-group text-center mb-0'>
                      <button type='submit' className='btn btn-submit btn-login' disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}{' '}
                        {loading
                          ? <i className='fas fa-spinner fa-spin' />
                          : <i className='fas fa-sign-in-alt' />}
                      </button>
                    </div>
                    <div className='mt-2 text-center'>
                      <small>
                        <a href='/admin/login' style={{ color: '#999' }}>Admin Login →</a>
                      </small>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentLogin
