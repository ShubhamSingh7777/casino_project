import IBet, { IBetOn } from '../models/IBet'

/**
 * Profit / exposure for a bet slip, moved unchanged from the legacy place-bet-box so the
 * old and new betslips compute the same numbers.
 */
export const calculateBetPnl = (betValue: IBet) => {
  let pnl = 0,
    exposure = 0;
  if (Object.keys(betValue).length > 0) {
    // if (betValue.betOn == IBetOn.MATCH_ODDS || betValue.gtype === 'fancy1') {
    if (
      betValue.marketName == "MATCH_ODDS" ||
      betValue.marketName == "fancy1" ||
      betValue.marketName == "oddeven"
    ) {
      if (betValue.isBack) {
        pnl = betValue.odds * betValue.stack - betValue.stack;
        exposure = -1 * betValue.stack;
      } else {
        pnl = betValue.stack;
        exposure = -1 * (betValue.odds * betValue.stack - betValue.stack);
      }
    } else if (
      betValue.marketName == "Bookmaker" &&
      betValue.betOn != IBetOn.CASINO
    ) {
      if (betValue.isBack) {
        pnl = (betValue.odds * betValue.stack) / 100;
        exposure = -betValue.stack;
      } else {
        exposure = -((betValue.odds * betValue.stack) / 100);
        pnl = betValue.stack;
      }
    } else if (betValue.betOn != IBetOn.CASINO) {
      if (betValue.isBack) {
        pnl = (betValue.volume * betValue.stack) / 100;
        exposure = -betValue.stack;
      } else {
        exposure = -((betValue.volume * betValue.stack) / 100);
        pnl = betValue.stack;
      }
    } else if (betValue.betOn == IBetOn.CASINO) {
      if (betValue.matchId == 33) {
        //// specific condition for cmeter game
        pnl = 0;
        exposure = -50 * betValue.stack * 1.0;
        // } else if (betValue.matchId == 9) {
      } else if (betValue.matchId == 1000) {
        //// specific condition for tp1day game
        if (betValue.isBack) {
          pnl = (betValue.odds / 100) * betValue.stack;
          exposure = -betValue.stack;
        } else {
          pnl = betValue.stack;
          exposure = -1 * (betValue.odds * betValue.stack - betValue.stack);
        }
      } else if (betValue.fancystatus == "yes") {
        //// specific condition for cmeter game
        if (betValue.isBack) {
          pnl = (betValue.volume * betValue.stack) / 100;
          exposure = -betValue.stack;
        } else {
          exposure = -((betValue.volume * betValue.stack) / 100);
          pnl = betValue.stack;
        }
      } else {
        if (betValue.isBack) {
          pnl = betValue.odds * betValue.stack - betValue.stack;
          exposure = -1 * betValue.stack;
        } else {
          pnl = betValue.stack;
          exposure = -1 * (betValue.odds * betValue.stack - betValue.stack);
        }
      }
    }
  }
  return {
    pnl: parseInt(pnl.toFixed()),
    exposure: parseInt(exposure.toFixed()),
  };
};
