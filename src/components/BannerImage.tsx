import React from 'react'
import { useNavigate } from 'react-router-dom'

export const BannerImage = () => {
  const navigate = useNavigate();
  return (
      <div className='bannerImageContainer'>
         <img src="/imgs/aviator.gif" alt="Banner 1" style={{ width: '100%'}} onClick={()=>navigate('/casino-int/all?category=Spribe')}/>
         <img src="/imgs/mines.gif" alt="Banner 2" style={{ width: '100%'}} onClick={()=>navigate('/casino-int/all?type=Mines')}/>
         <img src="/imgs/bikini-games.gif" alt="Banner 3" style={{ width: '100%'}} onClick={()=>navigate('/casino-int/all?category=SAGaming')}/>
         <img src="/imgs/wingogames.gif" alt="Banner 4" style={{ width: '100%'}} onClick={()=>navigate('/casino-int/all?type=wingo')}/>
      </div>
    )
}