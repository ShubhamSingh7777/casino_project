import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import AdminRoutes from '../admin-app/AdminRoutes'
import AgentRoutes from '../agent-panel/AgentRoutes'
import Casino from '../pages/casino/casino'
import CasinoOther from '../pages/casino/casinoOther'
import Deposit from '../pages/deposit/deposit'
import Withdraw from '../pages/withdraw/withdraw'
import Ragistration from '../pages/login/ragister'
import Maintenance from '../pages/maintanance'
import OurVipCasino from '../components/OurVipCasino'
import OurPremiumCasino from '../components/OurPremiumcasino'
import OurVirtualCasino from '../components/OurVirtualCasino'
import { MatchRedirect } from '../user-app/layout/LegacyRedirects'
import { Termsandcondition } from '../pages/Terms&conditions/Termsandcondition'
import { Responsiblegaming } from '../pages/Terms&conditions/Responsiblegaming'

const Login = React.lazy(() => import('../pages/login/login'))
const AuthLayout = React.lazy(() => import('../pages/_layout/AuthLayout'))
const AppShell = React.lazy(() => import('../user-app/layout/AppShell'))
const HomePage = React.lazy(() => import('../user-app/features/home/HomePage'))
const RequireAuth = React.lazy(() => import('../user-app/layout/RequireAuth'))
const ExchangeHub = React.lazy(() => import('../user-app/features/exchange/ExchangeHub'))
const SportListingPage = React.lazy(() => import('../user-app/features/exchange/SportListingPage'))
const CasinoLobby = React.lazy(() => import('../user-app/features/casino/CasinoLobby'))
const StaticPage = React.lazy(() => import('../user-app/features/pages/StaticPage'))
const NotFoundPage = React.lazy(() => import('../user-app/features/pages/NotFoundPage'))
const CasinoDetailSignIn = React.lazy(() => import('../user-app/features/pages/CasinoDetailSignIn'))
const EventPage = React.lazy(() => import('../user-app/features/event/EventPage'))
const ReportLayout = React.lazy(() => import('../user-app/features/report/ReportLayout'))
const AccountStatementReport = React.lazy(() => import('../user-app/features/report/AccountStatementReport'))
const ProfitLossReport = React.lazy(() => import('../user-app/features/report/ProfitLossReport'))
const BetsReport = React.lazy(() => import('../user-app/features/report/BetsReport'))
const DepositWithdrawReport = React.lazy(() => import('../user-app/features/report/DepositWithdrawReport'))
const LegacyCasinoResult = React.lazy(() => import('../user-app/features/report/LegacyCasinoResult'))
const ProviderGameShell = React.lazy(() => import('../user-app/features/casino/ProviderGameShell'))
const SettingsHub = React.lazy(() => import('../user-app/features/settings/SettingsPages').then((m) => ({ default: m.SettingsHub })))
const SecurityPage = React.lazy(() => import('../user-app/features/settings/SettingsPages').then((m) => ({ default: m.SecurityPage })))
const ChangePasswordPage = React.lazy(() => import('../user-app/features/settings/SettingsPages').then((m) => ({ default: m.ChangePasswordPage })))
const StakesPage = React.lazy(() => import('../user-app/features/settings/SettingsPages').then((m) => ({ default: m.StakesPage })))

/** Old user URLs → redesigned report / settings pages. */
const LEGACY_REDIRECTS: Array<[string, string]> = [
  ['accountstatement', '/report/account-statement'],
  ['profitloss', '/report/profit-loss'],
  ['bethistory', '/report/bet-history'],
  ['unsettledbet', '/report/current-bets'],
  ['casinoreport', '/report/casino-bets'],
  ['depositstatement', '/report/deposit-statement'],
  ['withdrawstatement', '/report/withdraw-statement'],
  ['changepassword', '/settings/change-password'],
  ['button-values', '/settings/stakes'],
  ['settings/security-auth', '/settings/security'],
]
const CasinoList = React.lazy(() => import('../pages/CasinoList/CasinoList'))
const Rules = React.lazy(() => import('../pages/Rules/rules'))
const TransactionPassword = React.lazy(
  () => import('../admin-app/pages/transaction-password/transaction-password'),
)
const CheckTransactionPassword = React.lazy(
  () => import('../pages/_layout/CheckTransactionPassword'),
)
const CasinoWrapper = React.lazy(() => import('../pages/CasinoList/CasinoWrapper'))
const ResultList = React.lazy(() => import('../pages/CasinoList/component/_common/ResultList'))

const Routers = () => {
  const routes = [
    {
      path: '/login',
      element: <AuthLayout />,
      children: [{ index: true, element: <Login /> }],
    },
    {
      path: '/register',
      element: <AuthLayout />,
      children: [{ index: true, element: <Ragistration /> }],
    },
    {
      path: '/transaction-password',
      element: <TransactionPassword />,
    },
    {
      path: '/admin/transaction-password',
      element: <TransactionPassword />,
    },
    {
      path: '/',
      element: <CheckTransactionPassword />,
      children: [
        { path: 'maintenance', element: <Maintenance /> },
        {
          path: '/',
          element: <AppShell />,
          children: [
            // public: browsable without login (their APIs don't need a token)
            { index: true, element: <HomePage /> },
            { path: 'exchange', element: <ExchangeHub /> },
            { path: 'exchange/:sportId', element: <SportListingPage /> },
            { path: 'casino/:type', element: <CasinoLobby /> },
            { path: 'page/:slug', element: <StaticPage /> },
            { path: '/rules', element: <Rules /> },
            { path: '/terms-conditions', element: <Termsandcondition /> },
            { path: '/responsible-gaming', element: <Responsiblegaming /> },
            {
              // login required: logged-out visitors see a Sign-In card instead
              element: <RequireAuth />,
              children: [
                // event pages (market APIs need a token); /odds/:id is the old URL
                { path: 'exchange/:sportId/:matchId', element: <EventPage /> },
                { path: 'virtual/:sportId/:matchId', element: <EventPage variant='virtual' /> },
                { path: 'tp-virtual/:sportId/:matchId', element: <EventPage variant='tp-virtual' /> },
                { path: 'odds/:matchId', element: <EventPage /> },
                { path: '/deposit', element: <Deposit /> },
                { path: '/withdraw', element: <Withdraw /> },
                { path: '/casino-games', element: <CasinoList /> },
                { path: '/casino-in/:type', element: <Casino /> },
                { path: '/casino-in/our-vip', element: <OurVipCasino /> },
                { path: '/casino-in/our-premium', element: <OurPremiumCasino /> },
                { path: '/casino-in/our-virtual', element: <OurVirtualCasino /> },
                { path: '/casino-int/:type', element: <CasinoOther /> },
                { path: '/casino/:gameCode/:matchId', element: <CasinoWrapper /> },
                { path: '/casino/result', element: <ResultList /> },
                { path: '/casino/result/:matchid', element: <ResultList /> },
                // settings hub (v3 §15)
                { path: 'settings', element: <SettingsHub /> },
                { path: 'settings/security', element: <SecurityPage /> },
                { path: 'settings/change-password', element: <ChangePasswordPage /> },
                { path: 'settings/stakes', element: <StakesPage /> },
              ],
            },
            // old URLs → v2 routes
            { path: 'dashbaord', element: <Navigate to='/' replace /> },
            { path: 'match/:sportId', element: <MatchRedirect /> },
            { path: 'match/:sportId/:status', element: <MatchRedirect /> },
            { path: 'casino-int/live-casino', element: <Navigate to='/casino/live' replace /> },
            { path: 'casino-int/slots', element: <Navigate to='/casino/slots' replace /> },
            ...LEGACY_REDIRECTS.map(([from, to]) => ({ path: from, element: <Navigate to={to} replace /> })),
            { path: '*', element: <NotFoundPage /> },
          ],
        },
        ...AdminRoutes(),
        ...AgentRoutes(),
      ],
    },
    // standalone (no app shell): logged-out game link
    { path: '/casino-detail/:gameCode/:matchId', element: <CasinoDetailSignIn /> },
    // standalone: provider game frame
    { path: '/casino-play', element: <ProviderGameShell /> },
    // report shell (own header, no site header / bottom nav)
    {
      path: '/report',
      element: <ReportLayout />,
      children: [
        {
          element: <RequireAuth />,
          children: [
            { index: true, element: <Navigate to='/report/account-statement' replace /> },
            { path: 'account-statement', element: <AccountStatementReport /> },
            { path: 'profit-loss', element: <ProfitLossReport /> },
            { path: 'bet-history', element: <BetsReport variant='history' /> },
            { path: 'current-bets', element: <BetsReport variant='current' /> },
            { path: 'casino-bets', element: <BetsReport variant='casino' /> },
            { path: 'deposit-statement', element: <DepositWithdrawReport type='deposit' /> },
            { path: 'withdraw-statement', element: <DepositWithdrawReport type='withdraw' /> },
            { path: 'casino-result', element: <LegacyCasinoResult /> },
          ],
        },
      ],
    },
  ]
  return useRoutes(routes)
}

export default Routers
