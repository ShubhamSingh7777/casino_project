import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import agentService from '../services/agent.service'

const AgentMain    = React.lazy(() => import('./pages/_layout/AgentMain'))
const AgentDashboard = React.lazy(() => import('./pages/AgentDashboard'))

// Admin page components reused for agents
const ListClients  = React.lazy(() => import('../admin-app/pages/list-clients/list-clients'))
const AddUser      = React.lazy(() => import('../admin-app/pages/add-user/add-user'))
const AccountStatementAdmin = React.lazy(() => import('../admin-app/pages/AccountStatement/AccountStatementAdmin'))
const ProfitLossAdmin       = React.lazy(() => import('../admin-app/pages/PlReport/ProfitLossAdmin'))
const UnsetteleBetHistoryAdmin = React.lazy(() => import('../admin-app/pages/UnsetteleBetHistory/UnsetteleBetHistoryAdmin'))
const SettledBetHistoryAdmin   = React.lazy(() => import('../admin-app/pages/SettledBetHistory/SettledBetHistoryAdmin'))
const GameReportAdmin          = React.lazy(() => import('../admin-app/pages/GameReports/GameReportAdmin'))
const CasinoList               = React.lazy(() => import('../admin-app/pages/casino-list/casino-list'))
const Paymethod                = React.lazy(() => import('../admin-app/pages/settings/paymethod'))
const Contact                  = React.lazy(() => import('../admin-app/pages/settings/contact'))
const Message                  = React.lazy(() => import('../admin-app/pages/settings/message'))
const DepositStatementAdmin    = React.lazy(() => import('../admin-app/pages/transaction-statement/DepositStatementAdmin'))
const WithdrawStatementAdmin   = React.lazy(() => import('../admin-app/pages/transaction-statement/WithdrawStatementAdmin'))
const SportsPage               = React.lazy(() => import('../admin-app/pages/add-matches/sports'))

/**
 * PermissionRoute — only renders if agent has the given permission
 */
const PermissionRoute: React.FC<{ permission: string; element: React.ReactNode }> = ({
  permission,
  element,
}) => {
  if (!agentService.hasPermission(permission as any)) {
    return <Navigate to="/agent" replace />
  }
  return <>{element}</>
}

const AgentRoutes = () => {
  return [
    {
      path: '/agent',
      element: <AgentMain />,
      children: [
        { index: true, element: <AgentDashboard /> },

        // Client Management
        {
          path: 'list-clients',
          element: <PermissionRoute permission="view-clients" element={<ListClients />} />,
        },
        {
          path: 'list-clients/:username',
          element: <PermissionRoute permission="view-clients" element={<ListClients />} />,
        },
        {
          path: 'add-user',
          element: <PermissionRoute permission="add-client" element={<AddUser />} />,
        },
        {
          path: 'add-user/:username',
          element: <PermissionRoute permission="add-client" element={<AddUser />} />,
        },

        // Reports
        {
          path: 'accountstatement',
          element: <PermissionRoute permission="account-statement" element={<AccountStatementAdmin />} />,
        },
        {
          path: 'profitloss',
          element: <PermissionRoute permission="profit-loss" element={<ProfitLossAdmin />} />,
        },
        {
          path: 'unsettledbet',
          element: <PermissionRoute permission="current-bets" element={<UnsetteleBetHistoryAdmin />} />,
        },
        {
          path: 'unsettledbet/:type',
          element: <PermissionRoute permission="deleted-bets" element={<UnsetteleBetHistoryAdmin />} />,
        },
        {
          path: 'all-bets',
          element: <PermissionRoute permission="all-bets" element={<SettledBetHistoryAdmin />} />,
        },
        {
          path: 'game-reports',
          element: <PermissionRoute permission="game-reports" element={<GameReportAdmin />} />,
        },

        // Transactions
        {
          path: 'depositstatement',
          element: <PermissionRoute permission="deposit-withdraw" element={<DepositStatementAdmin />} />,
        },
        {
          path: 'withdrawstatement',
          element: <PermissionRoute permission="deposit-withdraw" element={<WithdrawStatementAdmin />} />,
        },

        // Settings / Tools
        {
          path: 'casino-list',
          element: <PermissionRoute permission="casino-list" element={<CasinoList />} />,
        },
        {
          path: 'payment-method',
          element: <PermissionRoute permission="payment-method" element={<Paymethod />} />,
        },
        {
          path: 'Contact-details',
          element: <PermissionRoute permission="contact-details" element={<Contact />} />,
        },
        {
          path: 'messages',
          element: <PermissionRoute permission="messages" element={<Message />} />,
        },
        {
          path: 'sports-list/:url?',
          element: <PermissionRoute permission="block-markets" element={<SportsPage />} />,
        },
      ],
    },
  ]
}

export default AgentRoutes
