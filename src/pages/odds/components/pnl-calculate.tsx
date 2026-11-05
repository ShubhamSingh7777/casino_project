import React, { useMemo } from 'react'
import { selectBetPopup } from '../../../redux/actions/bet/betSlice'
import { useAppSelector } from '../../../redux/hooks'
import { IBetOn } from '../../../models/IBet'

const PnlCalculate = ({
  selectionId,
  marketId,
}: {
  selectionId: number | string
  marketId: string
}) => {
  const betValues = useAppSelector(selectBetPopup)
  const pnl = useMemo(() => {
    const betValue = betValues.betData
    let current = 0,
      oppsite = 0,
      colorVal = ''
    if (Object.keys(betValue).length > 0) {
      if (selectionId == betValue.selectionId) {
        console.log('bet lagi h')
        if (betValue.isBack) {
          current =
            betValue.marketName == IBetOn.MATCH_ODDS || betValue.betOn == IBetOn.CASINO || betValue.eventId != 4
              ? betValue.odds * betValue.stack - betValue.stack
              : (betValue.odds * betValue.stack) / 100
          colorVal = current > 0 ? 'green' : 'red'
        } else {
          console.log('opposite h')
          current =
            betValue.marketName == IBetOn.MATCH_ODDS || betValue.gtype === 'fancy1' || betValue.betOn == IBetOn.CASINO
              ? -1 * (betValue.odds * betValue.stack - betValue.stack)
              : -((betValue.odds * betValue.stack) / 100)
          colorVal = 'red'
        }
      } else {
        if (betValue.isBack) {
          oppsite = -1 * betValue.stack
          colorVal = 'red'
        } else {
          oppsite = betValue.stack
          colorVal = 'green'
        }
      }
    }
    console.log(current, oppsite, 'pnl ')
    return { current: current.toFixed(), oppsite: oppsite.toFixed(), colorVal }
  }, [betValues])

  if (marketId !== betValues.betData.marketId) return null
  return (
    <span
      className='float-right'
      style={{
        color:
          (pnl.current === '0' && selectionId === betValues.betData.selectionId) ||
            (pnl.oppsite === '0' && selectionId !== betValues.betData.selectionId)
            ? 'black'
            : pnl.colorVal,
      }}
    >
      {betValues.betData.selectionId === selectionId ? pnl.current : pnl.oppsite}
    </span>
  )
}

export default React.memo(PnlCalculate)

