import api from '../utils/api'
import agentApi from '../utils/agentApi'

// ─── Types ────────────────────────────────────────────────────────────────────

export const AGENT_PERMISSIONS = [
  'view-clients',
  'add-client',
  'deposit-withdraw',
  'account-statement',
  'profit-loss',
  'current-bets',
  'all-bets',
  'deleted-bets',
  'game-reports',
  'block-markets',
  'add-match',
  'casino-list',
  'payment-method',
  'contact-details',
  'messages',
  'change-user-password',
  'user-enable-disable',
] as const

export type AgentPermission = typeof AGENT_PERMISSIONS[number]

export const PERMISSION_LABELS: Record<AgentPermission, string> = {
  'view-clients': 'Client List देखना',
  'add-client': 'नया Client Add करना',
  'deposit-withdraw': 'Deposit / Withdrawal',
  'account-statement': 'Account Statement',
  'profit-loss': 'Profit & Loss',
  'current-bets': 'Current Bets',
  'all-bets': 'All Bets',
  'deleted-bets': 'Deleted Bets',
  'game-reports': 'Game Reports',
  'block-markets': 'Block Markets',
  'add-match': 'Add Match',
  'casino-list': 'Casino List',
  'payment-method': 'Payment Method',
  'contact-details': 'Contact Details',
  'messages': 'Messages',
  'change-user-password': 'User Password Change',
  'user-enable-disable': 'User Enable / Disable',
}

export interface IAgent {
  _id: string
  username: string
  fullName?: string
  phone?: string
  permissions: AgentPermission[]
  isActive: boolean
  parentId: string
  parentRole: string
  lastLogin?: string
  createdAt: string
}

export interface IAgentLog {
  _id: string
  agentId: string
  agentUsername: string
  action: string
  section: string
  description: string
  targetUser?: string
  metadata?: any
  ip?: string
  createdAt: string
}

// ─── Service ──────────────────────────────────────────────────────────────────

class AgentService {
  // SuperAdmin: create agent
  createAgent(data: { username: string; password: string; fullName?: string; phone?: string; permissions: AgentPermission[] }) {
    return api.post('/create-agent', data)
  }

  // SuperAdmin: get agent list
  getAgents(page = 1, limit = 20) {
    return api.get(`/get-agents?page=${page}&limit=${limit}`)
  }

  // SuperAdmin: update agent
  updateAgent(id: string, data: Partial<{ permissions: AgentPermission[]; isActive: boolean; fullName: string; phone: string; password: string }>) {
    return api.put(`/update-agent/${id}`, data)
  }

  // SuperAdmin: delete agent
  deleteAgent(id: string) {
    return api.delete(`/delete-agent/${id}`)
  }

  // SuperAdmin: get agent activity logs
  getAgentLogs(filters: { agentId?: string; from?: string; to?: string; action?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params.append(k, String(v)) })
    return api.get(`/get-agent-logs?${params.toString()}`)
  }

  // Agent: login
  agentLogin(username: string, password: string) {
    return api.post('/agent-login', { username, password })
  }

  // Agent: get own info
  getAgentInfo() {
    return agentApi.get('/agent-info')
  }

  // Agent token helpers
  saveAgentSession(data: any) {
    localStorage.setItem('agent-token', data.token)
    localStorage.setItem('agent-refresh-token', data.refreshToken)
    localStorage.setItem('agent-username', data.username)
    localStorage.setItem('agent-permissions', JSON.stringify(data.permissions))
    localStorage.setItem('agent-parentId', data.parentId)
    localStorage.setItem('agent-parentRole', data.parentRole)
  }

  clearAgentSession() {
    localStorage.removeItem('agent-token')
    localStorage.removeItem('agent-refresh-token')
    localStorage.removeItem('agent-username')
    localStorage.removeItem('agent-permissions')
    localStorage.removeItem('agent-parentId')
    localStorage.removeItem('agent-parentRole')
  }

  getAgentToken() {
    return localStorage.getItem('agent-token')
  }

  isAgentLoggedIn() {
    return !!this.getAgentToken()
  }

  getAgentPermissions(): AgentPermission[] {
    try {
      return JSON.parse(localStorage.getItem('agent-permissions') || '[]')
    } catch {
      return []
    }
  }

  hasPermission(permission: AgentPermission): boolean {
    return this.getAgentPermissions().includes(permission)
  }
}

export default new AgentService()
