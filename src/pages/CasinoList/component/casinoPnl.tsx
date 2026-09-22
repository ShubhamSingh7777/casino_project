import { useAppSelector } from '../../../redux/hooks'
import { selectMarketBook } from '../../../redux/actions/bet/betSlice';

const CasinoPnl = (props: any) => {
  const { sectionId, matchId, clsName } = props
  const getMarketBook: any = useAppSelector(selectMarketBook);
  console.log(getMarketBook, 'get market_book', matchId, sectionId)

  if (!getMarketBook[`${matchId}_${sectionId}`]) {
    return null;
  }

  return (
    <p className={`m-b-0 m-t-2 ${clsName}`}>
      {getMarketBook[`${matchId}_${sectionId}`] ? (
        <span
          className={
            getMarketBook[`${matchId}_${sectionId}`] > 0
              ? `green ${clsName}`
              : `red`
          }
        >
          {getMarketBook[`${matchId}_${sectionId}`].toLocaleString()}
        </span>
      ) : (
        <span className={clsName} style={{ color: '#333', fontWeight: '400', fontSize: '13px' }}>0</span>
      )}
    </p>
  )
}
export default CasinoPnl
