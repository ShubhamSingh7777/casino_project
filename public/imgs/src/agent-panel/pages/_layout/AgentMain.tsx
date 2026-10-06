import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import agentService from '../../../services/agent.service'
import AgentHeader from './elements/AgentHeader'
import Footer from '../../../admin-app/pages/_layout/elements/footer'

const AgentMain: React.FC = () => {
  const navigate = useNavigate()

  // Guard: if not logged in as agent, redirect to agent login
  React.useEffect(() => {
    if (!agentService.isAgentLoggedIn()) {
      navigate('/admin/agent-login', { replace: true })
    }
  }, [])

  if (!agentService.isAgentLoggedIn()) return null

  return (
    <div className="admin">
      <AgentHeader />
      <ToastContainer />
      <div className="main">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default AgentMain
