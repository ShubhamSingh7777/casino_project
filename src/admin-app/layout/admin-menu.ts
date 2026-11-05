import { RoleType } from '../../models/User'

export type MenuLink = { label: string; to: string; badge?: string; roles?: RoleType[] }
export type MenuGroup = { label: string; children: MenuLink[]; roles?: RoleType[] }
export type MenuEntry = MenuLink | MenuGroup

export const isGroup = (e: MenuEntry): e is MenuGroup => 'children' in e

const ADMIN = [RoleType.admin]
const ADMIN_SADMIN = [RoleType.admin, RoleType.sadmin]

/**
 * Sidebar (admin spec §1.3) mapped onto this app's pages. Items marked `soon` are spec pages
 * whose backend endpoint does not exist yet — they open with an empty table and a note.
 * Role rules are the ones the legacy admin header used.
 */
export const ADMIN_MENU: MenuEntry[] = [
  { label: 'Market Analysis', to: '/admin/market-analysis' },
  {
    label: 'Multi Login',
    roles: ADMIN_SADMIN,
    children: [{ label: 'Create Account', to: '/admin/agent-management' }],
  },
  {
    label: 'Agency Management',
    children: [
      { label: 'Agent Listing', to: '/admin/list-clients' },
      { label: 'Create Account', to: '/admin/add-user' },
      { label: 'Transfer', to: '/admin/transfer' },
    ],
  },
  { label: 'Assign Agent', to: '/admin/assign-agent', badge: 'Soon' },
  {
    label: 'Reports',
    children: [
      { label: 'Account Statement', to: '/admin/accountstatement' },
      { label: 'Profit & Loss', to: '/admin/profitloss' },
      { label: 'Current Bets', to: '/admin/unsettledbet' },
      { label: 'User History', to: '/admin/userhistory', badge: 'Soon' },
      { label: 'General Lock', to: '/admin/general-lock' },
      { label: 'Our Casino Result', to: '/admin/casinoresult', badge: 'Soon' },
      { label: 'Live Casino Result', to: '/admin/livecasinoreport', badge: 'Soon' },
      { label: 'Sportbook Report', to: '/admin/sportbookreport', badge: 'Soon' },
      { label: 'Turn Over', to: '/admin/turnover', badge: 'Soon' },
      { label: 'User Authentication', to: '/admin/authlist', badge: 'Soon' },
      { label: 'Fraud Report', to: '/admin/fraud', badge: 'Soon' },
      { label: 'All Bets', to: '/admin/all-bets' },
      { label: 'Deleted Bets', to: '/admin/unsettledbet/deleted', roles: ADMIN },
      { label: 'Game Reports', to: '/admin/game-reports' },
      { label: 'Deposit Statement', to: '/admin/depositstatement' },
      { label: 'Withdraw Statement', to: '/admin/withdrawstatement' },
      { label: 'System Logs', to: '/admin/system-logs', roles: ADMIN },
    ],
  },
  { label: 'Our Casino', to: '/admin/casinos/our' },
  { label: 'Virtual Casino', to: '/admin/casinos/virtual', badge: 'New' },
  { label: 'Premium Casino', to: '/admin/casinos/premium', badge: 'New' },
  {
    label: 'Settings',
    children: [
      { label: 'Active Matches', to: '/admin/sports-list/active-matches', roles: ADMIN },
      { label: 'Add Matches', to: '/admin/sports-list/matches', roles: ADMIN },
      { label: 'Casino List', to: '/admin/casino-list', roles: ADMIN },
      { label: 'Messages', to: '/admin/messages', roles: ADMIN },
      { label: 'Payment Method', to: '/admin/payment-method' },
      { label: 'Contact Details', to: '/admin/Contact-details' },
      { label: 'Secure Auth', to: '/admin/secureauth' },
    ],
  },
]

export const allowed = (roles: RoleType[] | undefined, role?: RoleType) => !roles || (!!role && roles.includes(role))
