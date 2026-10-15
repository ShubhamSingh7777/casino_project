import React from 'react'
import { isMobile } from 'react-device-detect';
import ReactModal from 'react-modal';
const CasinoRulesDetail = (props:any) => {
    const { title, gameId, isOpen, setIsOpen } = props;
      // Console all received props
  console.log("CasinoRulesDetail Props:", props);

  // Console individual values
  console.log("Title:", title);
  console.log("Game ID:", gameId);
  console.log("Is Open:", isOpen);
  console.log("Set Is Open:", setIsOpen);
  return (
    <>
        {/* @ts-ignore Server Component */}
        <ReactModal
        isOpen={isOpen}
        onRequestClose={(e: any) => {
          setIsOpen(false)
        }}
        contentLabel='Set Max Bet Limit'
         className="modal-dialog casino-rules-modal"
        ariaHideApp={false}
      
      >
        <div className='modal-content'>
          <div className='modal-header' style={{padding:isMobile?'12px 10px':''}}>
            <h5 style={{marginBottom:'0px',fontSize:isMobile?'16px':''}}>{title} Rules</h5>
            <button onClick={() => setIsOpen(false)} className='close float-right' style={{padding:isMobile?"0rem 8px":""}}>
              {/* <i className='fa fa-times-circle' aria-hidden='true'></i> */}
              <img className='closeIconModalWelcome' src='/imgs/closeIcon.svg' alt='close' style={{width:'12px',height:'12px'}}/>
            </button>
          </div>
          <div className='modal-body'>
         <img
  src={`/imgs/rules/${gameId}.jpg`}
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = `/imgs/rules/${gameId}.jpeg`;
  }}
  className="wd-100"
  alt="Game rules"
/>
          </div>
        </div>
      </ReactModal>
    
    </>
  )
}
export default React.memo(CasinoRulesDetail)
