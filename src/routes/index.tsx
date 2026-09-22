import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import AdminRoutes from '../admin-app/AdminRoutes'
import AgentRoutes from '../agent-panel/AgentRoutes'
import Casino from '../pages/casino/casino'
import CasinoOther from '../pages/casino/casinoOther'
import Deposit from '../pages/deposit/deposit'
import Withdraw from '../pages/withdraw/withdraw'
import DepositStatement from '../pages/depositstatement/depositstatement'
import WithdrawStatement from '../pages/withdrawstatement/withdrawstatement'
import Ragistration from '../pages/login/ragister'
import Maintenance from '../pages/maintanance'
import OurVipCasino from '../components/OurVipCasino'
import OurPremiumCasino from '../components/OurPremiumcasino'
import OurVirtualCasino from '../components/OurVirtualCasino'
import { Termsandcondition } from '../pages/Terms&conditions/Termsandcondition'
import { Responsiblegaming } from '../pages/Terms&conditions/Responsiblegaming'

const AccountStatement = React.lazy(() => import('../pages/AccountStatement/AccountStatement'))
const BetHistory = React.lazy(() => import('../pages/BetHistory/BetHistory'))
const ButtonValues = React.lazy(() => import('../pages/button-values/button-values'))
const CasinoReport = React.lazy(() => import('../pages/CasinoReport/CasinoReport'))
const ChangePassword = React.lazy(() => import('../pages/ChangePassword/ChangePassword'))
const Dashboard = React.lazy(() => import('../pages/dashboard/dashboard'))
const Login = React.lazy(() => import('../pages/login/login'))
const Odds = React.lazy(() => import('../pages/odds/odds'))
const ProfitLoss = React.lazy(() => import('../pages/PlReport/ProfitLoss'))
const UnsetteleBetHistory = React.lazy(
  () => import('../pages/UnsetteleBetHistory/UnsetteleBetHistory'),
)
const AuthLayout = React.lazy(() => import('../pages/_layout/AuthLayout'))
const Main = React.lazy(() => import('../pages/_layout/Main'))
const CasinoList = React.lazy(() => import('../pages/CasinoList/CasinoList'))
const Rules = React.lazy(() => import('../pages/Rules/rules'))
const TransactionPassword = React.lazy(
  () => import('../admin-app/pages/transaction-password/transaction-password'),
)
const CheckTransactionPassword = React.lazy(
  () => import('../pages/_layout/CheckTransactionPassword'),
)
const Page404 = React.lazy(() => import('../pages/404/404'))
const CasinoWrapper = React.lazy(() => import('../pages/CasinoList/CasinoWrapper'))
const ResultList = React.lazy(() => import('../pages/CasinoList/component/_common/ResultList'))
const SecurityAuth = React.lazy(() => import('../pages/Rules/SecurityAuth'))

const Routers = () => {
  const isLoggedIn = localStorage.getItem('token');
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
          element: isLoggedIn ? <Main /> : <Navigate to="/login" replace />,
          children: [
            //  { index: true, element: <Navigate to="/match/4" replace /> },
            {
              index: true, element: <Navigate
                to={isLoggedIn ? "/match/4" : "/login"}
                replace
              />
            },
            { path: 'dashbaord', element: <Dashboard /> },
            { path: 'match/:sportId', element: <Dashboard /> },
            { path: 'match/:sportId/:status?', element: <Dashboard /> },
            { path: 'odds/:matchId', element: <Odds /> },
            { path: 'button-values', element: <ButtonValues /> },
            { path: '/changepassword', element: <ChangePassword /> },
            { path: '/bethistory', element: <BetHistory /> },
            { path: '/deposit', element: <Deposit /> },
            { path: '/withdraw', element: <Withdraw /> },
            { path: '/accountstatement', element: <AccountStatement /> },
            { path: '/unsettledbet', element: <UnsetteleBetHistory /> },
            { path: '/casinoreport', element: <CasinoReport /> },
            { path: '/profitloss', element: <ProfitLoss /> },
            { path: '/casino-games', element: <CasinoList /> },
            { path: '/casino-in/:type', element: <Casino /> },
            { path: '/casino-in/our-vip', element: <OurVipCasino /> },
            { path: '/casino-in/our-premium', element: <OurPremiumCasino /> },
            { path: '/casino-in/our-virtual', element: <OurVirtualCasino /> },
            { path: '/casino-int/:type', element: <CasinoOther /> },
            { path: '/rules', element: <Rules /> },
            { path: '/casino/:gameCode/:matchId', element: <CasinoWrapper /> },
            { path: '/casino/result', element: <ResultList /> },
            { path: '/casino/result/:matchid', element: <ResultList /> },
            { path: 'settings/security-auth', element: <SecurityAuth /> },
            { path: '/depositstatement', element: <DepositStatement /> },
            { path: '/withdrawstatement', element: <WithdrawStatement /> },
            { path: '/terms-conditions', element: <Termsandcondition /> },
            { path: '/responsible-gaming', element: <Responsiblegaming /> },
          ],
        },
        ...AdminRoutes(),
        ...AgentRoutes(),
      ],
    },
    { path: '*', element: <Page404 /> },
  ]
  return useRoutes(routes)
}

export default Routers
