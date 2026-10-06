import React from 'react'
import { isMobile } from 'react-device-detect'
import AutoCompleteComponent from '../../../../components/AutocompleteComponent'
import IMatch from '../../../../models/IMatch'
import matchService from '../../../../services/match.service'
import { useLocation } from 'react-router-dom'
const Marqueemessge = (props: any) => {
  const [showAuto, setShowAuto] = React.useState<boolean>(false)
  const location = useLocation()
  const isAdminRoute = location.pathname.includes('/admin')

  const suggestion = ({ value }: any) => {
    return matchService.getMatchListSuggestion({ name: value })
  }

  const onMatchClick = (match: IMatch | null) => {
    if (match) {
      window.location.href = `/odds/${match.matchId}`
    }
  }

 return (
    <div className='marqueeheader'>
      {isMobile && !isAdminRoute && (
        <span className='search float-left'>
           <AutoCompleteComponent<IMatch>
            className={`search-input-show col-md-10 ${showAuto ? 'show' : ''}`}
            label={'Search here'}
            optionKey={'name'}
            api={suggestion}
            onClick={onMatchClick}
          />
          <a
            href='#'
            className='search-input'
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              e.preventDefault()
              setShowAuto(!showAuto)
            }}
          >
            <i className='fas fa-search-plus' style={{ fontSize: '24px' }} />
          </a>

         
        </span>
      ) }
      <div className='marqueeN' style={{ color: "#fff", }} >
         {/* <p>{props.message}</p> */}
         <p>Newly Launched Matka Market In Our Exchange</p>
      </div>
    </div>
  )
}
export default Marqueemessge
