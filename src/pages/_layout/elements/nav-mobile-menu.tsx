import { CustomLink } from './custom-link'
import { useLocation, useParams } from 'react-router-dom'
import axios, { AxiosResponse } from 'axios'
import React from 'react'
import { isMobile } from 'react-device-detect'
import Fav from './fav'

const NavMobileMenu = (props: any) => {
  const location = useLocation()
  const [headerMessage, setHeaderMessage] = React.useState<any>()
  const { sportId, status } = useParams()
  const [matchList, setMatchList] = React.useState([])
//   const hideFavRoutes = [
//   "/casino-in/live-dmd",
//   "/casino-int/virtual-casino",
//   "/casino-int/live-casino",
//   "/casino/"

// ];
const hideFav =
  location.pathname.startsWith("/casino/") ||
  location.pathname === "/casino-in/live-dmd" ||
  location.pathname === "/casino-int/virtual-casino" ||
  location.pathname === "/casino-int/live-casino" || location.pathname === "/casino-in/our-premium" || location.pathname === "/casino-in/our-vi" || location.pathname === "/accountstatement" ;

  React.useEffect(() => {
    axios.get(`headerMessage.json?v=${Date.now()}`).then((res: AxiosResponse) => {
      setHeaderMessage(res.data)
    })
  }, [])

  return (
    <div className='header-mobile'>
      {!hideFav && <Fav />}
      {/* <div className=' header-b-menu'>
        <a href={headerMessage?.headerMessageLink}>{headerMessage?.headerMessage}</a>
      </div> */}
      {isMobile && !location.pathname.includes('/odds') 
      // && !location.pathname.includes('/casino') 

      && <ul className='list-unstyled navbarnav'>
           <li className={'nav-item'} style={{flex:'none',width:'21%'}}>
          
             <CustomLink
  className={`${
    location.pathname === '/casino-int/all' &&
    new URLSearchParams(location.search).get('category') === 'Spribe'
      ? 'active'
      : ''
  } `}
  to="/casino-int/all?category=Spribe"
>
     <img className='aviator-zoom-main' src='/imgs/aviator.webp' alt=''/>
  CRASH
</CustomLink>
           </li>
           <li className={'nav-item'}>
             <CustomLink
              className={location.pathname.includes('') ? '' : ''}
              to=''
            >
              Lottery
           </CustomLink>
        </li>
        {/* <li className={'nav-item'}>
          <CustomLink
            className={location.pathname.includes('in-play') ? 'active' : ''}
            to='/match/4/in-play'
          >
            In-play
          </CustomLink>
        </li> */}
       
        <li className={'nav-item'}>
          <CustomLink
            className={location.pathname.includes('sports') ? 'active' : ''}
            to='/match/4/sports'
          >
            Sports
          </CustomLink>
        </li>
        <li className={'nav-item'} style={{width:'13%'}}>
          <CustomLink
            className={`${location.pathname == '/casino-in/live-dmd' ? 'active' : ''} two-line-css`}
            to='/casino-in/live-dmd'
          >
           <span>Our</span>
           <span>Casino</span>

          </CustomLink>
        </li>
        <li className={'nav-item'}>
          <CustomLink
            className={`${location.pathname == '/casino-int/live-casino' ? 'active' : ''} two-line-css`}
            to='/casino-int/live-casino'
          >
           <span>Live</span>  
           <span>Casino</span>
          </CustomLink>
        </li>
        <li className={'nav-item'}>
          <CustomLink
            className={location.pathname == '/casino-int/slots' ? 'active' : ''}
            to='/casino-int/slots'
          >
            Slots
          </CustomLink>
        </li>
        <li className={'nav-item'}>
          <CustomLink
            className={location.pathname == '' ? '' : ''}
            to=''
          >
            Fantasy
          </CustomLink>
        </li>
        {/* <li className={'nav-item'}>
          <CustomLink
            className={location.pathname == '/casino-int/virtual-casino' ? 'active' : ''}
            to='/casino-int/virtual-casino'
          >
            Our virtual
          </CustomLink>
        </li> */}
        {/* <li className='nav-item'>
          <CustomLink to='#'>Others</CustomLink>
        </li> */}
      </ul>}
    </div>
  )
}
export default NavMobileMenu