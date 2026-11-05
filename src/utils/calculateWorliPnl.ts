import IBet from "../models/IBet"

/**
 * ==============================
 * WORLI BASE ODDS (OPEN MARKET)
 * ==============================
 */
const WORLI_ODDS: Record<string, number> = {
  Jodi: 950,
  Single: 95,

  SP_PANA: 1500,
  DP_PANA: 3000,
  TP_PANA: 7000,

  SP: 1500,
  DP: 3000,
  Trio: 7000,

  Cycle: 1500,
  "Motor SP": 1500,

  "56 Charts": 950,
  "64 Charts": 950,

  ABR: 1500,
  "Common SP": 1500,
  "Common DP": 3000,
  "Color DP": 3000,
}

/**
 * ==============================
 * GET BASE ODDS
 * ==============================
 */
const getBaseOdds = (activeMenu: string, selectionName: string) => {
  if (activeMenu === "Pana") {
    const parts = selectionName.split(",") // PANA,TP_PANA,777
    const betType = parts[1]               // TP_PANA

    return WORLI_ODDS[betType] ?? 0
  }

  return WORLI_ODDS[activeMenu] ?? 0
}


/**
 * ==============================
 * FINAL WORLI PNL (OPEN / CLOSED)
 * ==============================
 */
export const calculateWorliPnl = (
  bet: IBet,
  activeMenu: string
) => {
  if (!bet || !bet.stack || bet.stack <= 0) {
    return { pnl: 0, exposure: 0, odds: 0 }
  }

  const baseOdds = getBaseOdds(activeMenu, bet.selectionName)

  if (!baseOdds) {
    return { pnl: 0, exposure: 0, odds: 0 }
  }

  // ✅ SEND ONLY MULTIPLIER (* VALUE)
  const odds =(baseOdds / 10)

  return {
    odds,
    pnl: bet.stack * (odds - 1),
    exposure: -bet.stack,
  }
}