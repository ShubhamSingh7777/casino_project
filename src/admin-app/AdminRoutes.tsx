import React from 'react'
import { useAppSelector } from '../redux/hooks'
import User, { RoleType } from '../models/User'
import { selectUserData } from '../redux/actions/login/loginSlice'
import { effectiveRole, useAdminDemo } from './dev-auth'
const ActiveMarkets = React.lazy(() => import('../admin-app/pages/active-matches/active-markets'))
const ActiveMatches = React.lazy(() => import('../admin-app/pages/active-matches/active-matches'))
const GetAllFancy = React.lazy(() => import('../admin-app/pages/active-matches/get-all-fancy'))
const MatchesPage = React.lazy(() => import('../admin-app/pages/add-matches/matches'))
const SeriesPage = React.lazy(() => import('../admin-app/pages/add-matches/series'))
const SportsPage = React.lazy(() => import('../admin-app/pages/add-matches/sports'))
// redesigned admin UI (layout/, ui/, features/) — remaining pages are legacy, shown inside the new shell
const AdminShell = React.lazy(() => import('./layout/AdminShell'))
const AgentListing = React.lazy(() => import('./features/agents/AgentListing'))
const MarketAnalysis = React.lazy(() => import('./features/market-analysis/MarketAnalysis'))
const AccountStatement = React.lazy(() => import('./features/reports/AccountStatement'))
const ProfitLoss = React.lazy(() => import('./features/reports/ProfitLoss'))
const CasinoGrid = React.lazy(() => import('./features/casino/CasinoGrid'))
const CreateAccount = React.lazy(() => import('./features/agents/CreateAccount'))
const MultiLogin = React.lazy(() => import('./features/agents/MultiLogin'))
const CurrentBets = React.lazy(() => import('./features/reports/CurrentBets'))
const AdminEventPage = React.lazy(() => import('./features/event/AdminEventPage'))
const Transfer = React.lazy(() => import('./features/agents/Transfer'))
const GeneralLock = React.lazy(() => import('./features/agents/GeneralLock'))
const SecureAuth = React.lazy(() => import('./features/settings/SecureAuth'))
// spec pages without a backend endpoint yet (empty table + note)
const pending = (name: keyof typeof import('./features/reports/pending-pages')) =>
  React.lazy(() => import('./features/reports/pending-pages').then((m) => ({ default: m[name] })))
const UserHistory = pending('UserHistory')
const OurCasinoResult = pending('OurCasinoResult')
const LiveCasinoResult = pending('LiveCasinoResult')
const SportbookReport = pending('SportbookReport')
const TurnoverReport = pending('TurnoverReport')
const UserAuthentication = pending('UserAuthentication')
const FraudReport = pending('FraudReport')
const AssignAgent = pending('AssignAgent')
const Message = React.lazy(() => import('../admin-app/pages/settings/message'))
const Paymethod = React.lazy(() => import('../admin-app/pages/settings/paymethod'))
const Contact  = React.lazy(() => import('../admin-app/pages/settings/contact'))

const DepositStatementAdmin = React.lazy(
  () => import('../admin-app/pages/transaction-statement/DepositStatementAdmin'),
)
const WithdrawStatementAdmin = React.lazy(
  () => import('../admin-app/pages/transaction-statement/WithdrawStatementAdmin'))
const SettledBetHistoryAdmin = React.lazy(
  () => import('../admin-app/pages/SettledBetHistory/SettledBetHistoryAdmin'),
)
const ChangePassword = React.lazy(() => import('../pages/ChangePassword/ChangePassword'))
const AuthLayout = React.lazy(() => import('../pages/_layout/AuthLayout'))
const Login = React.lazy(() => import('./pages/login/login'))
const CasinoWrapper = React.lazy(() => import('../pages/CasinoList/CasinoWrapper'))
const CasinoList = React.lazy(() => import('./pages/casino-list/casino-list'))
const GameReportAdmin = React.lazy(() => import('./pages/GameReports/GameReportAdmin'))
const AgentLogin = React.lazy(() => import('./pages/agent-login/AgentLogin'))
const SystemLogs = React.lazy(() => import('../admin-app/pages/logs/SystemLogs'))


const AdminRoutes = () => {
  const userState = useAppSelector<{ user: User }>(selectUserData)
  const role = effectiveRole(userState.user, useAdminDemo())

  return [
    {
      path: '/admin',
      element: <AuthLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'agent-login', element: <AgentLogin /> },
        {
          path: '/admin',
          element: <AdminShell />,
          children: [
            { index: true, element: <AgentListing /> },
            { path: 'dashbaord', element: <MarketAnalysis /> },
            { path: 'market-analysis', element: <MarketAnalysis /> },
            { path: 'casinos/:type', element: <CasinoGrid /> },
            { path: 'odds/:matchId', element: <AdminEventPage /> },
            ...['list-clients', 'list-clients/:username'].map((path) => ({
              key: 'list-client',
              path: path,
              element: <AgentListing />,
            })),
            ...['add-user', 'add-user/:username'].map((path) => ({
              key: 'add-user',
              path: path,
              element: <CreateAccount />,
            })),
            ...(role === RoleType.admin || role === RoleType.sadmin
              ? [
                { path: 'sports-list/:url?', element: <SportsPage /> },
                { path: 'series/:sportId', element: <SeriesPage /> },
                { path: 'matches/:sportId', element: <MatchesPage /> },
                { path: 'active-matches/:sportId/:matchType?', element: <ActiveMatches /> },
                { path: 'active-markets/:matchId', element: <ActiveMarkets /> },
                { path: 'active-fancies/:matchId', element: <GetAllFancy /> },
                { path: 'messages', element: <Message /> },
              ]
              : []),
            // Agent Management — SuperAdmin and Admin
            ...(role === RoleType.admin || role === RoleType.sadmin
              ? [{ path: 'agent-management', element: <MultiLogin /> }]
              : []),
            { path: 'change-password', element: <ChangePassword /> },
            { path: 'accountstatement', element: <AccountStatement /> },
            { path: 'profitloss', element: <ProfitLoss /> },
            { path: 'unsettledbet', element: <CurrentBets /> },
            { path: 'unsettledbet/:type', element: <CurrentBets /> },
            { path: 'all-bets', element: <SettledBetHistoryAdmin /> },
            { path: 'casino/:gameCode', element: <CasinoWrapper /> },
            { path: 'casino-list', element: <CasinoList /> },
            { path: 'game-reports', element: <GameReportAdmin /> },
            { path: 'depositstatement', element: <DepositStatementAdmin /> },
            { path: 'withdrawstatement', element: <WithdrawStatementAdmin /> },
            { path: 'payment-method', element: <Paymethod /> },
            { path: 'Contact-details', element: <Contact /> },
            { path: 'system-logs', element: <SystemLogs /> },
            { path: 'transfer', element: <Transfer /> },
            { path: 'general-lock', element: <GeneralLock /> },
            { path: 'secureauth', element: <SecureAuth /> },
            { path: 'assign-agent', element: <AssignAgent /> },
            { path: 'userhistory', element: <UserHistory /> },
            { path: 'casinoresult', element: <OurCasinoResult /> },
            { path: 'livecasinoreport', element: <LiveCasinoResult /> },
            { path: 'sportbookreport', element: <SportbookReport /> },
            { path: 'turnover', element: <TurnoverReport /> },
            { path: 'authlist', element: <UserAuthentication /> },
            { path: 'fraud', element: <FraudReport /> },
          ]
        },
      ],
    },
  ]
}

export default AdminRoutes