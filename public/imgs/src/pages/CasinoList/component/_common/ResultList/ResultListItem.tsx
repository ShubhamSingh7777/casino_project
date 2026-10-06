import React from "react"
import { isMobile } from "react-device-detect"

const ResultListItem = (props: any) => {
  const { item, index, dateString, setPopupData } = props
  const getround = (ro: string) => {
    if (!ro) return ro;
    const sp = ro.split('.')
    return sp.length > 1 ? sp[1] : ro
  }
  return (
    <>
      <tr key={index}>
        {/* <td className='text-center'>{index + 1}</td>
        <td className='text-center'>
          {dateString}
        </td> */}
        <td className='text-start' style={{width: isMobile ? "150px" : "150px"}}>
          <a
            href='javascript:void(0);'
            style={{ color: 'black', textDecoration: 'none' }}
            onClick={() => {
              setPopupData(item)
            }}
          >
            {item.mid ? getround(item.mid) : null}
          </a>
        </td>

        <td className='text-start' style={{ color: 'black' }}>
        {item?.data?.winnerName}
        </td>
      </tr>
    </>
  )
}
export default React.memo(ResultListItem)