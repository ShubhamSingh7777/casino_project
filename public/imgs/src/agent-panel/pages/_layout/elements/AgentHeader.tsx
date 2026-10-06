import React from 'react'
import { useNavigate } from 'react-router-dom'
import agentService, { AgentPermission, PERMISSION_LABELS } from '../../../../services/agent.service'

// Map permission → nav entry
interface NavItem {
  permission: AgentPermission
  label: string
  icon: string
  path: string
  group?: string
}

const NAV_ITEMS: NavItem[] = [
  { permission: 'view-clients',       label: 'List of Clients',    icon: 'fa-users',          path: '/agent/list-clients',       group: 'clients' },
  { permission: 'add-client',         label: 'Add Client',         icon: 'fa-user-plus',      path: '/agent/add-user',           group: 'clients' },
  { permission: 'deposit-withdraw',   label: 'Deposit',            icon: 'fa-arrow-down',     path: '/agent/depositstatement',   group: 'transactions' },
  { permission: 'deposit-withdraw',   label: 'Withdrawal',         icon: 'fa-arrow-up',       path: '/agent/withdrawstatement',  group: 'transactions' },
  { permission: 'account-statement',  label: "Account's Statement",icon: 'fa-file-alt',       path: '/agent/accountstatement',   group: 'reports' },
  { permission: 'profit-loss',        label: 'Profit & Loss',      icon: 'fa-chart-line',     path: '/agent/profitloss',         group: 'reports' },
  { permission: 'current-bets',       label: 'Current Bets',       icon: 'fa-clock',          path: '/agent/unsettledbet',       group: 'reports' },
  { permission: 'all-bets',           label: 'All Bets',           icon: 'fa-list-alt',       path: '/agent/all-bets',           group: 'reports' },
  { permission: 'deleted-bets',       label: 'Deleted Bets',       icon: 'fa-trash-alt',      path: '/agent/unsettledbet/deleted', group: 'reports' },
  { permission: 'game-reports',       label: 'Game Reports',       icon: 'fa-gamepad',        path: '/agent/game-reports',       group: 'reports' },
  { permission: 'block-markets',      label: 'Block Markets',      icon: 'fa-ban',            path: '/agent/sports-list/active-matches', group: 'settings' },
  { permission: 'add-match',          label: 'Add Match',          icon: 'fa-plus-circle',    path: '/agent/sports-list/matches',group: 'settings' },
  { permission: 'casino-list',        label: 'Casino List',        icon: 'fa-dice',           path: '/agent/casino-list',        group: 'settings' },
  { permission: 'payment-method',     label: 'Payment Method',     icon: 'fa-credit-card',    path: '/agent/payment-method',     group: 'settings' },
  { permission: 'contact-details',    label: 'Contact Details',    icon: 'fa-address-book',   path: '/agent/Contact-details',    group: 'settings' },
  { permission: 'messages',           label: 'Messages',           icon: 'fa-envelope',       path: '/agent/messages',           group: 'settings' },
]

type DropdownKey = 'clients' | 'transactions' | 'reports' | 'settings' | null

const AgentHeader: React.FC = () => {
  const navigate = useNavigate()
  const [openDropdown, setOpenDropdown] = React.useState<DropdownKey>(null)
  const [showUserMenu, setShowUserMenu] = React.useState(false)

  const permissions = agentService.getAgentPermissions()
  const username    = localStorage.getItem('agent-username') || 'Agent'

  // Filter nav items to only those the agent has permission for (unique paths)
  const allowedItems = NAV_ITEMS.filter((item, idx, arr) =>
    permissions.includes(item.permission) &&
    arr.findIndex(i => i.path === item.path) === idx
  )

  const hasGroup = (group: string) => allowedItems.some(i => i.group === group)

  const handleLogout = () => {
    agentService.clearAgentSession()
    navigate('/admin/agent-login', { replace: true })
  }

  const handleNav = (path: string) => {
    setOpenDropdown(null)
    navigate(path)
  }

  // Close dropdown on outside click
  const wrapperRef = React.useRef<HTMLUListElement>(null)
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const renderGroup = (group: string, label: string, dropKey: DropdownKey) => {
    const items = allowedItems.filter(i => i.group === group)
    if (items.length === 0) return null
    return (
      <li className="nav-item dropdown custom-dropdown-header">
        <a
          href="#"
          onClick={e => { e.preventDefault(); setOpenDropdown(prev => prev === dropKey ? null : dropKey) }}
        >
          <b>{label}</b> <i className="fa fa-caret-down" />
        </a>
        <ul className={`dropdown-menu ${openDropdown === dropKey ? 'show' : ''}`}>
          {items.map(item => (
            <li key={item.path}>
              <a
                href="#"
                className="dropdown-item"
                onClick={e => { e.preventDefault(); handleNav(item.path) }}
              >
                <i className={`fas ${item.icon} mr-2`} />
                <b>{item.label}</b>
              </a>
            </li>
          ))}
        </ul>
      </li>
    )
  }

  return (
    <header>
      <div className="header-bottom">
        <div className="container-fluid">
          {/* Logo */}
          <a href="/agent" className="logo">
            <img src="/imgs/logo.png" style={{ maxHeight: '40px' }} alt="logo" />
          </a>

          <nav className="navbar navbar-expand-md btco-hover-menu">
            <div className="collapse navbar-collapse" style={{ overflowX: 'unset' }}>
              <ul className="list-unstyled navbar-nav" ref={wrapperRef}>
                {/* Home */}
                <li className="nav-item">
                  <a href="#" className="" onClick={e => { e.preventDefault(); handleNav('/agent') }}>
                    <b>Home</b>
                  </a>
                </li>

                {/* Clients group */}
                {renderGroup('clients', 'Clients', 'clients')}

                {/* Reports group */}
                {renderGroup('reports', 'Reports', 'reports')}

                {/* Transactions group */}
                {renderGroup('transactions', 'Transactions', 'transactions')}

                {/* Settings group */}
                {renderGroup('settings', 'Settings', 'settings')}
              </ul>
            </div>
          </nav>

          {/* User menu */}
          <ul className="user-search list-unstyled">
            <li className="username">
              <span onClick={() => setShowUserMenu(v => !v)}>
                <i className="fas fa-user-secret mr-1" style={{ color: '#e74c3c' }} />
                {username} <i className="fa fa-caret-down" />
              </span>
              <ul style={{ display: showUserMenu ? 'block' : 'none' }}>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); handleNav('/agent') }}>
                    <b>Dashboard</b>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); handleLogout() }}>
                    <b style={{ color: '#e74c3c' }}>Logout</b>
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          {/* Agent badge */}
          <div style={{ position: 'absolute', right: '200px', top: '50%', transform: 'translateY(-50%)' }}>
            <span className="badge badge-danger" style={{ fontSize: 11 }}>
              <i className="fas fa-user-secret mr-1" />
              AGENT SESSION
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AgentHeader
