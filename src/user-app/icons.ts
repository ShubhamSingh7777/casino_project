// react-icons v5 types its components as returning ReactNode, which TS 4.7 rejects as a JSX
// element type. Re-export the icons we use with a JSX-compatible signature.
import React from 'react'
import { IconBaseProps } from 'react-icons'
import {
  LuArrowDownToLine as _LuArrowDownToLine,
  LuArrowLeftRight as _LuArrowLeftRight,
  LuArrowUpFromLine as _LuArrowUpFromLine,
  LuBookOpen as _LuBookOpen,
  LuChartLine as _LuChartLine,
  LuCherry as _LuCherry,
  LuChevronDown as _LuChevronDown,
  LuChevronLeft as _LuChevronLeft,
  LuChevronRight as _LuChevronRight,
  LuClock as _LuClock,
  LuDices as _LuDices,
  LuDownload as _LuDownload,
  LuFileText as _LuFileText,
  LuHistory as _LuHistory,
  LuKeyRound as _LuKeyRound,
  LuLogOut as _LuLogOut,
  LuMenu as _LuMenu,
  LuRocket as _LuRocket,
  LuSearch as _LuSearch,
  LuSettings as _LuSettings,
  LuShieldCheck as _LuShieldCheck,
  LuSparkles as _LuSparkles,
  LuTicket as _LuTicket,
  LuTrophy as _LuTrophy,
  LuTv as _LuTv,
  LuUser as _LuUser,
  LuX as _LuX,
  LuEye as _LuEye,
  LuEyeOff as _LuEyeOff,
  LuLogIn as _LuLogIn,
  LuPlay as _LuPlay,
  LuCompass as _LuCompass,
  LuArrowLeft as _LuArrowLeft,
  LuHouse as _LuHouse,
  LuLayoutGrid as _LuLayoutGrid,
  LuTrash as _LuTrash,
  LuInbox as _LuInbox,
  LuExternalLink as _LuExternalLink,
  LuCheck as _LuCheck,
  LuBell as _LuBell,
  LuLock as _LuLock,
  LuWallet as _LuWallet,
} from 'react-icons/lu'
import {
  MdHowToVote as _MdHowToVote,
  MdSportsBaseball as _MdSportsBaseball,
  MdSportsBasketball as _MdSportsBasketball,
  MdSportsCricket as _MdSportsCricket,
  MdSportsEsports as _MdSportsEsports,
  MdSportsFootball as _MdSportsFootball,
  MdSportsGolf as _MdSportsGolf,
  MdSportsHandball as _MdSportsHandball,
  MdSportsHockey as _MdSportsHockey,
  MdSportsKabaddi as _MdSportsKabaddi,
  MdSportsMma as _MdSportsMma,
  MdSportsMotorsports as _MdSportsMotorsports,
  MdSportsRugby as _MdSportsRugby,
  MdSportsScore as _MdSportsScore,
  MdSportsSoccer as _MdSportsSoccer,
  MdSportsTennis as _MdSportsTennis,
  MdSportsVolleyball as _MdSportsVolleyball,
} from 'react-icons/md'
import {
  GiBoxingGlove as _GiBoxingGlove,
  GiChessKnight as _GiChessKnight,
  GiCycling as _GiCycling,
  GiDart as _GiDart,
  GiHorseHead as _GiHorseHead,
  GiPingPongBat as _GiPingPongBat,
  GiPoolTriangle as _GiPoolTriangle,
  GiRunningShoe as _GiRunningShoe,
  GiShuttlecock as _GiShuttlecock,
  GiSittingDog as _GiSittingDog,
} from 'react-icons/gi'

export type IconType = React.FC<IconBaseProps>
const icon = (c: unknown) => c as IconType

export const LuArrowDownToLine = icon(_LuArrowDownToLine)
export const LuArrowLeftRight = icon(_LuArrowLeftRight)
export const LuArrowUpFromLine = icon(_LuArrowUpFromLine)
export const LuBookOpen = icon(_LuBookOpen)
export const LuChartLine = icon(_LuChartLine)
export const LuCherry = icon(_LuCherry)
export const LuChevronDown = icon(_LuChevronDown)
export const LuChevronLeft = icon(_LuChevronLeft)
export const LuChevronRight = icon(_LuChevronRight)
export const LuClock = icon(_LuClock)
export const LuDices = icon(_LuDices)
export const LuDownload = icon(_LuDownload)
export const LuFileText = icon(_LuFileText)
export const LuHistory = icon(_LuHistory)
export const LuKeyRound = icon(_LuKeyRound)
export const LuLogOut = icon(_LuLogOut)
export const LuMenu = icon(_LuMenu)
export const LuRocket = icon(_LuRocket)
export const LuSearch = icon(_LuSearch)
export const LuSettings = icon(_LuSettings)
export const LuShieldCheck = icon(_LuShieldCheck)
export const LuSparkles = icon(_LuSparkles)
export const LuTicket = icon(_LuTicket)
export const LuTrophy = icon(_LuTrophy)
export const LuTv = icon(_LuTv)
export const LuUser = icon(_LuUser)
export const LuX = icon(_LuX)
export const MdHowToVote = icon(_MdHowToVote)
export const MdSportsBaseball = icon(_MdSportsBaseball)
export const MdSportsBasketball = icon(_MdSportsBasketball)
export const MdSportsCricket = icon(_MdSportsCricket)
export const MdSportsEsports = icon(_MdSportsEsports)
export const MdSportsFootball = icon(_MdSportsFootball)
export const MdSportsGolf = icon(_MdSportsGolf)
export const MdSportsHandball = icon(_MdSportsHandball)
export const MdSportsHockey = icon(_MdSportsHockey)
export const MdSportsKabaddi = icon(_MdSportsKabaddi)
export const MdSportsMma = icon(_MdSportsMma)
export const MdSportsMotorsports = icon(_MdSportsMotorsports)
export const MdSportsRugby = icon(_MdSportsRugby)
export const MdSportsScore = icon(_MdSportsScore)
export const MdSportsSoccer = icon(_MdSportsSoccer)
export const MdSportsTennis = icon(_MdSportsTennis)
export const MdSportsVolleyball = icon(_MdSportsVolleyball)
export const GiBoxingGlove = icon(_GiBoxingGlove)
export const GiChessKnight = icon(_GiChessKnight)
export const GiCycling = icon(_GiCycling)
export const GiDart = icon(_GiDart)
export const GiHorseHead = icon(_GiHorseHead)
export const GiPingPongBat = icon(_GiPingPongBat)
export const GiPoolTriangle = icon(_GiPoolTriangle)
export const GiRunningShoe = icon(_GiRunningShoe)
export const GiShuttlecock = icon(_GiShuttlecock)
export const GiSittingDog = icon(_GiSittingDog)
export const LuEye = icon(_LuEye)
export const LuEyeOff = icon(_LuEyeOff)
export const LuLogIn = icon(_LuLogIn)
export const LuPlay = icon(_LuPlay)
export const LuCompass = icon(_LuCompass)
export const LuArrowLeft = icon(_LuArrowLeft)
export const LuHouse = icon(_LuHouse)
export const LuLayoutGrid = icon(_LuLayoutGrid)
export const LuTrash = icon(_LuTrash)
export const LuInbox = icon(_LuInbox)
export const LuExternalLink = icon(_LuExternalLink)
export const LuCheck = icon(_LuCheck)
export const LuBell = icon(_LuBell)
export const LuLock = icon(_LuLock)
export const LuWallet = icon(_LuWallet)
