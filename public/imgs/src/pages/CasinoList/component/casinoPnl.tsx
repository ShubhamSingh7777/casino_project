// import { useAppSelector } from '../../../redux/hooks'
// import { selectMarketBook } from '../../../redux/actions/bet/betSlice';

// const CasinoPnl = (props: any) => {
//   const { sectionId, matchId, clsName, slug } = props
//   const getMarketBook: any = useAppSelector(selectMarketBook);
  
//   if (!getMarketBook[`${matchId}_${sectionId}`]) {
//     return null;
//   }

//   return (
//     <p className={`m-b-0 m-t-2 ${clsName}`}>
//       {getMarketBook[`${matchId}_${sectionId}`] ? (
//         <span
//           className={
//             getMarketBook[`${matchId}_${sectionId}`] > 0
//               ? `green ${clsName}`
//               : `red`
//           }
//         >
//           {getMarketBook[`${matchId}_${sectionId}`].toLocaleString()}
//         </span>
//       ) : (
//         <span className={clsName} style={{ color: '#333', fontWeight: '400', fontSize: '13px' }}>0</span>
//       )}
//     </p>
//   )
// }
// export default CasinoPnl

import { useAppSelector } from '../../../redux/hooks'
import {
  selectMarketBook,
  selectBetPopup,
} from '../../../redux/actions/bet/betSlice'

const CasinoPnl = (props: any) => {
  const {
    sectionId,
    matchId,
    clsName,
    slug,
  } = props

  const getMarketBook: any = useAppSelector(selectMarketBook)
  const betValues: any = useAppSelector(selectBetPopup)

  const marketKey = `${matchId}_${sectionId}`
  const marketValue = getMarketBook[marketKey]
  console.log("SICBO PNL BOOK:", getMarketBook);
 console.log("CASINO PNL FROM BACKBUTTON-------------before", {
    slug,
    matchId,
    sectionId,
    marketKey,
    marketValue,
    getMarketBook,
  });

  if (marketValue === undefined || marketValue === null) {
    return null
  }
const negativeSlugs = [
  'dt20',
  'lucky5',
  'lucky7',
  'lucky7eu',
  'lucky7eu2',
  'plucky7',
  'vlucky7',
]

  // DT20 ONLY
let displayValue = Number(marketValue)


  // Apply negative logic ONLY when slug is provided
  if (slug && negativeSlugs.includes(slug)) {
    displayValue = -Math.abs(displayValue)
  }
 console.log("CASINO PNL FROM BACKBUTTON-------------after", {
    slug,
    matchId,
    sectionId,
    marketKey,
    marketValue,
    getMarketBook,
  });
  return (
    <p className={`m-b-0 m-t-2 ${clsName || ''}`}>
      <span
        className={
          displayValue > 0
            ? `green ${clsName || ''}`
            : displayValue < 0
              ? `red ${clsName || ''}`
              : ''
        }
        style={
          displayValue === 0
            ? {
                color: '#333',
                fontWeight: '400',
                fontSize: '13px',
              }
            : undefined
        }
      >
        {displayValue.toLocaleString()}
      </span>
    </p>
  )
}

export default CasinoPnl