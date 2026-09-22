import React, { useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import ReactModal from 'react-modal'

const images = [
  "/imgs/B4.png",
  "/imgs/B5.png",
  "/imgs/B6.png",
];

const Welcome = (props: any) => {
  const [isOpen, setIsOpen] = React.useState(true)
  const [currentImage, setCurrentImage] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <>
     {/* @ts-ignore Server Component */}
      <ReactModal
        isOpen={isOpen}
        onRequestClose={(e: any) => {
          setIsOpen(false)
        }}
        contentLabel='Set Max Bet Limit'
        className={'modal-dialog modal-lg margin-modal'}
        ariaHideApp={false}
        >
        <div className='modal-content' style={{margin:!isMobile?"0px 8px":"0px"}}>
          <div className='modal-header'>
            <h5 style={{marginBottom:'0px',marginTop:'0px',fontWeight:'bold',fontSize:isMobile?"16px":"",lineHeight:isMobile?"1.5":""}}>⚠️ Beware Of Phishing Websites Before Login. Enable Security Auth To Secure Your ID.</h5>
            <button onClick={() => setIsOpen(false)} className='close float-right text-end' style={{width:isMobile?'3%':'2%',padding:'0px',margin:'0px'}}>
              {/* <i className='fa fa-times-circle' aria-hidden='true'></i> */}
              <img className='closeIconModalWelcome' src='/imgs/closeIcon.svg' alt='' style={{width:isMobile?'12px':'16px',height:isMobile?'12px':'16px'}}/>
            </button>
          </div>
          <div className='modal-body p0' style={{ height:"89vh"}}>
            <img  src={images[currentImage]} className="img-fluid" style={{width:'100%'}}></img>
          </div>
        </div>
      </ReactModal>
    </>
  )
}
export default React.memo(Welcome)