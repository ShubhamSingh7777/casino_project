import React from 'react'
import {
  IconType,
  GiBoxingGlove,
  GiChessKnight,
  GiCycling,
  GiDart,
  GiHorseHead,
  GiPingPongBat,
  GiPoolTriangle,
  GiRunningShoe,
  GiShuttlecock,
  GiSittingDog,
  LuDices,
  MdHowToVote,
  MdSportsBaseball,
  MdSportsBasketball,
  MdSportsCricket,
  MdSportsEsports,
  MdSportsFootball,
  MdSportsGolf,
  MdSportsHandball,
  MdSportsHockey,
  MdSportsKabaddi,
  MdSportsMma,
  MdSportsMotorsports,
  MdSportsRugby,
  MdSportsScore,
  MdSportsSoccer,
  MdSportsTennis,
  MdSportsVolleyball,
} from '../icons'

// Matched against the sport name (lower-case), first hit wins — order matters
// ("table tennis" before "tennis", "american football" before "football").
const ICONS_BY_KEYWORD: Array<[string, IconType]> = [
  ['casino', LuDices],
  ['horse', GiHorseHead],
  ['greyhound', GiSittingDog],
  ['cricket', MdSportsCricket],
  ['table tennis', GiPingPongBat],
  ['tennis', MdSportsTennis],
  ['american football', MdSportsFootball],
  ['football', MdSportsSoccer],
  ['soccer', MdSportsSoccer],
  ['futsal', MdSportsSoccer],
  ['politic', MdHowToVote],
  ['badminton', GiShuttlecock],
  ['basketball', MdSportsBasketball],
  ['volleyball', MdSportsVolleyball],
  ['snooker', GiPoolTriangle],
  ['esport', MdSportsEsports],
  ['e games', MdSportsEsports],
  ['rugby', MdSportsRugby],
  ['baseball', MdSportsBaseball],
  ['hockey', MdSportsHockey],
  ['golf', MdSportsGolf],
  ['mixed martial', MdSportsMma],
  ['boxing', GiBoxingGlove],
  ['handball', MdSportsHandball],
  ['motor', MdSportsMotorsports],
  ['formula', MdSportsMotorsports],
  ['kabaddi', MdSportsKabaddi],
  ['darts', GiDart],
  ['chess', GiChessKnight],
  ['cycling', GiCycling],
  ['athletic', GiRunningShoe],
]

export const getSportIcon = (name = ''): IconType => {
  const key = name.toLowerCase()
  return ICONS_BY_KEYWORD.find(([keyword]) => key.includes(keyword))?.[1] || MdSportsScore
}

const SportIcon = ({ name, className }: { name?: string; className?: string }) => {
  const Icon = getSportIcon(name)
  return <Icon className={className} aria-hidden />
}

export default SportIcon
