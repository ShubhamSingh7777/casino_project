import React from 'react'
import { useNavigate } from 'react-router-dom'
import agentService, { PERMISSION_LABELS, AgentPermission } from '../../services/agent.service'

// Map each permission to its UI metadata
const PERMISSION_META: Record<AgentPermission, { icon: string; color: string; path: string; group: string }> = {
  'view-clients':         { icon: 'fa-users',        color: '#3498db', path: '/agent/list-clients',                  group: 'Client Management' },
  'add-client':           { icon: 'fa-user-plus',    color: '#2ecc71', path: '/agent/add-user',                      group: 'Client Management' },
  'deposit-withdraw':     { icon: 'fa-exchange-alt', color: '#f39c12', path: '/agent/depositstatement',              group: 'Transactions' },
  'account-statement':    { icon: 'fa-file-invoice', color: '#9b59b6', path: '/agent/accountstatement',              group: 'Reports' },
  'profit-loss':          { icon: 'fa-chart-bar',    color: '#1abc9c', path: '/agent/profitloss',                    group: 'Reports' },
  'current-bets':         { icon: 'fa-clock',        color: '#e67e22', path: '/agent/unsettledbet',                  group: 'Reports' },
  'all-bets':             { icon: 'fa-list-alt',     color: '#34495e', path: '/agent/all-bets',                      group: 'Reports' },
  'deleted-bets':         { icon: 'fa-trash-alt',    color: '#e74c3c', path: '/agent/unsettledbet/deleted',          group: 'Reports' },
  'game-reports':         { icon: 'fa-gamepad',      color: '#8e44ad', path: '/agent/game-reports',                  group: 'Reports' },
  'block-markets':        { icon: 'fa-ban',           color: '#c0392b', path: '/agent/sports-list/active-matches',   group: 'Settings' },
  'add-match':            { icon: 'fa-plus-circle',  color: '#27ae60', path: '/agent/sports-list/matches',           group: 'Settings' },
  'casino-list':          { icon: 'fa-dice',         color: '#d35400', path: '/agent/casino-list',                   group: 'Settings' },
  'payment-method':       { icon: 'fa-credit-card',  color: '#2980b9', path: '/agent/payment-method',                group: 'Settings' },
  'contact-details':      { icon: 'fa-address-book', color: '#16a085', path: '/agent/Contact-details',               group: 'Settings' },
  'messages':             { icon: 'fa-envelope',     color: '#8e44ad', path: '/agent/messages',                      group: 'Settings' },
  'change-user-password': { icon: 'fa-key',          color: '#f39c12', path: '/agent/list-clients',                  group: 'Client Management' },
  'user-enable-disable':  { icon: 'fa-toggle-on',   color: '#27ae60', path: '/agent/list-clients',                  group: 'Client Management' },
}

const GROUP_COLORS: Record<string, string> = {
  'Client Management': '#3498db',
  'Transactions':      '#f39c12',
  'Reports':           '#9b59b6',
  'Settings':          '#e74c3c',
}

const AgentDashboard: React.FC = () => {
  const navigate = useNavigate()
  const permissions = agentService.getAgentPermissions()
  const username   = localStorage.getItem('agent-username') || 'Agent'
  const parentRole = localStorage.getItem('agent-parentRole') || ''

  // Group permissions, deduplicating by path within each group
  const grouped: Record<string, AgentPermission[]> = {}
  permissions.forEach((perm: AgentPermission) => {
    const meta = PERMISSION_META[perm]
    if (!meta) return
    if (!grouped[meta.group]) grouped[meta.group] = []
    const alreadyHasPath = grouped[meta.group].some(p => PERMISSION_META[p]?.path === meta.path)
    if (!alreadyHasPath) grouped[meta.group].push(perm)
  })

  return (
    <div className="container-fluid mt-4">
      {/* Welcome banner */}
      <div
        className="mb-4 p-4"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3 className="mb-1" style={{ color: '#fff', fontWeight: 700 }}>
            <i className="fas fa-user-secret mr-2" style={{ color: '#e74c3c' }} />
            Welcome, {username}
          </h3>
          <p className="mb-0" style={{ color: '#aaa', fontSize: 14 }}>
            Agent Dashboard &nbsp;&middot;&nbsp; {permissions.length} permissions granted
            {parentRole && (
              <span>
                &nbsp;&middot;&nbsp; Parent: <b style={{ color: '#f39c12' }}>{parentRole}</b>
              </span>
            )}
          </p>
        </div>
        <div
          style={{
            background: 'rgba(231,76,60,0.2)',
            border: '1px solid #e74c3c',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 13,
            color: '#e74c3c',
          }}
        >
          <i className="fas fa-shield-alt mr-1" />
          AGENT SESSION
        </div>
      </div>

      {permissions.length === 0 ? (
        <div className="alert alert-warning text-center py-5">
          <i className="fas fa-exclamation-triangle fa-3x mb-3 d-block" />
          <h5>No permissions assigned</h5>
          <p className="mb-0">Please contact your administrator to grant you access.</p>
        </div>
      ) : (
        <>
          {Object.entries(grouped).map(([group, perms]) => (
            <div key={group} className="mb-4">
              <h5
                className="mb-3"
                style={{
                  borderLeft: `4px solid ${GROUP_COLORS[group] || '#999'}`,
                  paddingLeft: 12,
                  fontWeight: 700,
                  color: '#333',
                }}
              >
                {group}
              </h5>
              <div className="row">
                {perms.map(perm => {
                  const meta = PERMISSION_META[perm]
                  if (!meta) return null
                  return (
                    <div key={perm} className="col-6 col-md-4 col-lg-3 mb-3">
                      <div
                        onClick={() => navigate(meta.path)}
                        style={{
                          background: '#fff',
                          border: '1px solid #e8e8e8',
                          borderRadius: 10,
                          padding: '20px 16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLDivElement
                          el.style.transform = 'translateY(-3px)'
                          el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                          el.style.borderColor = meta.color
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLDivElement
                          el.style.transform = 'translateY(0)'
                          el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
                          el.style.borderColor = '#e8e8e8'
                        }}
                      >
                        <div
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: '50%',
                            background: `${meta.color}18`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 12,
                          }}
                        >
                          <i className={`fas ${meta.icon}`} style={{ fontSize: 22, color: meta.color }} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 13, color: '#333', lineHeight: 1.3 }}>
                          {PERMISSION_LABELS[perm]}
                        </span>
                        <i className="fas fa-arrow-right mt-2" style={{ color: '#ccc', fontSize: 11 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default AgentDashboard
