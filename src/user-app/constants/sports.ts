export type SportTemplate = 'sport' | 'racing' | 'casino'
export type SportEntry = { id: number | 'casino'; name: string; template: SportTemplate; to: string }

export const SPORT_IDS = {
  CRICKET: 4,
  FOOTBALL: 1,
  TENNIS: 2,
  HORSE_RACING: 10,
  GREYHOUND_RACING: 65,
} as const

/** "Virtual sports" (§4 #17) */
export const VIRTUAL_SPORT_ID = 38

export const RACING_SPORT_IDS: number[] = [SPORT_IDS.HORSE_RACING, SPORT_IDS.GREYHOUND_RACING]
export const isRacingSport = (id: number | string) => RACING_SPORT_IDS.includes(Number(id))

/** Sports whose events are outrights (one name, many runners) — their names are not split into teams. */
export const OUTRIGHT_SPORT_IDS: number[] = [40, 5, 23, 52, 32, 16, 29, 33, 38]

/** Home: these sports, in this order, in-play events only (v2 §5.1). */
export const HOME_SPORTS: number[] = [SPORT_IDS.CRICKET, SPORT_IDS.FOOTBALL, SPORT_IDS.TENNIS]

const sport = (id: number, name: string): SportEntry => ({
  id,
  name,
  template: isRacingSport(id) ? 'racing' : 'sport',
  to: `/exchange/${id}`,
})

/** Sidebar → page mapping (v2 §4). Drawer, xl sidebar and the /exchange chip row all read this list. */
export const SPORTS: SportEntry[] = [
  { id: 'casino', name: 'Live Casino', template: 'casino', to: '/casino/live' },
  sport(10, 'Horse Racing'),
  sport(65, 'Greyhound Racing'),
  sport(4, 'Cricket'),
  sport(1, 'Football'),
  sport(2, 'Tennis'),
  sport(40, 'Politics'),
  sport(8, 'Table Tennis'),
  sport(22, 'Badminton'),
  sport(15, 'Basketball'),
  sport(18, 'Volleyball'),
  sport(59, 'Snooker'),
  sport(64, 'Esports'),
  sport(62, 'Soccer'),
  sport(54, 'Rugby Union'),
  sport(53, 'Baseball'),
  sport(38, 'Virtual sports'),
  sport(37, 'Sumo'),
  sport(35, 'Basketball 3X3'),
  sport(33, 'Athletics'),
  sport(32, 'Motorbikes'),
  sport(29, 'Cycling'),
  sport(25, 'Hockey'),
  sport(23, 'Formula 1'),
  sport(17, 'Chess'),
  sport(16, 'MotoGP'),
  sport(39, 'Handball'),
  sport(7, 'Beach Volleyball'),
  sport(55, 'Rugby League'),
  sport(5, 'Golf'),
  sport(66, 'Kabaddi'),
  sport(52, 'Motor Sports'),
  sport(9, 'Futsal'),
  sport(19, 'Ice Hockey'),
  sport(11, 'E Games'),
  sport(58, 'American Football'),
  sport(3, 'Mixed Martial Arts'),
  sport(6, 'Boxing'),
  sport(57, 'Darts'),
  sport(69, 'Wrestling'),
  sport(68, 'Esoccer'),
]

export const getSportName = (id: number | string) =>
  SPORTS.find((s) => String(s.id) === String(id))?.name || 'Sport'

export const MAIN_MARKET = 'MATCH_ODDS'
