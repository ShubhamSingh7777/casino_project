// react-icons v5 types its components as returning ReactNode, which TS 4.7 rejects as a JSX
// element type. Re-export the icons the admin panel uses with a JSX-compatible signature.
import React from 'react'
import { IconBaseProps } from 'react-icons'
import {
  LuChartBar as _LuChartBar,
  LuUsers as _LuUsers,
  LuUserPlus as _LuUserPlus,
  LuArrowLeftRight as _LuArrowLeftRight,
  LuUserCheck as _LuUserCheck,
  LuFileText as _LuFileText,
  LuDices as _LuDices,
  LuCrown as _LuCrown,
  LuTrophy as _LuTrophy,
  LuChevronDown as _LuChevronDown,
  LuChevronUp as _LuChevronUp,
  LuSearch as _LuSearch,
  LuSettings as _LuSettings,
  LuLogOut as _LuLogOut,
  LuRefreshCw as _LuRefreshCw,
  LuFileSpreadsheet as _LuFileSpreadsheet,
  LuFileDown as _LuFileDown,
  LuPlus as _LuPlus,
  LuNetwork as _LuNetwork,
  LuLock as _LuLock,
  LuLockOpen as _LuLockOpen,
  LuX as _LuX,
  LuMenu as _LuMenu,
  LuChevronsLeft as _LuChevronsLeft,
  LuChevronLeft as _LuChevronLeft,
  LuChevronRight as _LuChevronRight,
  LuChevronsRight as _LuChevronsRight,
  LuArrowUpDown as _LuArrowUpDown,
  LuShieldCheck as _LuShieldCheck,
  LuKeyRound as _LuKeyRound,
  LuMonitor as _LuMonitor,
  LuWallet as _LuWallet,
  LuCreditCard as _LuCreditCard,
  LuMessageSquare as _LuMessageSquare,
  LuPhone as _LuPhone,
  LuList as _LuList,
  LuCalendar as _LuCalendar,
  LuCheck as _LuCheck,
  LuCircleCheck as _LuCircleCheck,
} from 'react-icons/lu'

export type IconType = React.FC<IconBaseProps>
const icon = (c: unknown) => c as IconType

export const LuChartBar = icon(_LuChartBar)
export const LuUsers = icon(_LuUsers)
export const LuUserPlus = icon(_LuUserPlus)
export const LuArrowLeftRight = icon(_LuArrowLeftRight)
export const LuUserCheck = icon(_LuUserCheck)
export const LuFileText = icon(_LuFileText)
export const LuDices = icon(_LuDices)
export const LuCrown = icon(_LuCrown)
export const LuTrophy = icon(_LuTrophy)
export const LuChevronDown = icon(_LuChevronDown)
export const LuChevronUp = icon(_LuChevronUp)
export const LuSearch = icon(_LuSearch)
export const LuSettings = icon(_LuSettings)
export const LuLogOut = icon(_LuLogOut)
export const LuRefreshCw = icon(_LuRefreshCw)
export const LuFileSpreadsheet = icon(_LuFileSpreadsheet)
export const LuFileDown = icon(_LuFileDown)
export const LuPlus = icon(_LuPlus)
export const LuNetwork = icon(_LuNetwork)
export const LuLock = icon(_LuLock)
export const LuLockOpen = icon(_LuLockOpen)
export const LuX = icon(_LuX)
export const LuMenu = icon(_LuMenu)
export const LuChevronsLeft = icon(_LuChevronsLeft)
export const LuChevronLeft = icon(_LuChevronLeft)
export const LuChevronRight = icon(_LuChevronRight)
export const LuChevronsRight = icon(_LuChevronsRight)
export const LuArrowUpDown = icon(_LuArrowUpDown)
export const LuShieldCheck = icon(_LuShieldCheck)
export const LuKeyRound = icon(_LuKeyRound)
export const LuMonitor = icon(_LuMonitor)
export const LuWallet = icon(_LuWallet)
export const LuCreditCard = icon(_LuCreditCard)
export const LuMessageSquare = icon(_LuMessageSquare)
export const LuPhone = icon(_LuPhone)
export const LuList = icon(_LuList)
export const LuCalendar = icon(_LuCalendar)
export const LuCheck = icon(_LuCheck)
export const LuCircleCheck = icon(_LuCircleCheck)
