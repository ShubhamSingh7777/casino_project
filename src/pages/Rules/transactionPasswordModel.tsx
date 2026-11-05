import React from 'react'
import { isMIUI, isMobile } from 'react-device-detect'
import ReactModal from 'react-modal'

const TransactionPasswordModel = (props: any) => {
  return (
    <>
     {/* @ts-ignore Server Component */}
      <ReactModal
        isOpen={props.isOpen}
        onRequestClose={(e: any) => {
          props.setIsOpen(false)
        }}
        contentLabel='Set Max Bet Limit'
        className={'modal-dialog modal-dialogTransa'}
        ariaHideApp={false}
      style={{
  content: {
    maxWidth: isMobile ? "100%" : undefined,
    margin: isMobile ? "0px":""
  },
}}
      >
        <div className='modal-content' style={{marginTop: isMobile?'0px':'',height: isMobile?'100vh':'',display:'flex',justifyContent:'center',alignItems:'center'}}>
          {/* <div className='modal-header'>
            <h5>Transaction Password</h5>
            <button onClick={() => props.setIsOpen(false)} className='close float-right'>
              <i className='fa fa-times-circle' aria-hidden='true'></i>
            </button>
          </div> */}
          <div className='modal-body' style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',width:isMobile?'74%':''}}>
            <p style={{ fontSize: '24px', marginBottom:isMobile?'20px': '10px', color: 'green' }}>
              Success! Your password has been updated successfully
            </p>
            <p style={{ fontSize: '24px', marginBottom: '14px' }}>
              Your Transaction Password is {' '}
              <strong style={{ color: '#75A7D2' }}>{props.transpass}</strong>
            </p>
            <p style={{ fontSize:isMobile? '23px':'18px', marginBottom: '10px',lineHeight:isMobile?'28px':'',textAlign: 'center' }}>
              Please remember this transaction password, from now on all transaction of the website
              can be done only with this password and keep one thing in mind, do not share this
              password with anyone.{' '}
            </p>
            <p style={{ fontSize: '22px', marginBottom: '45px' }}>
              Thank you, Team {'jmdbook.online'}
            </p>
            <p style={{ fontSize: '24px', marginBottom:isMobile?'20px': '10px', color: 'green' }}>
              Success! आपका पासवर्ड बदला जा चुका है |
            </p>
            <p style={{ fontSize: '24px', marginBottom: '14px' }}>
              आपका लेनदेन पासवर्ड  <strong style={{ color: '#75A7D2' }}>{props.transpass}</strong> है |
            </p>
            <p style={{ fontSize:isMobile? '23px':'18px', marginBottom: '12px',lineHeight:isMobile?'28px':'',textAlign: 'center' }}>
              कृपया इस लेन-देन के पासवर्ड को याद रखे, अब से वैबसाइट के सभी हसतानंतरण इस पासवर्ड से
              किए जा सकते है और एक बात का ध्यान रखे, इस पासवर्ड को किसी के साथ सांझा ना करे|{' '}
            </p>
            <p style={{ fontSize: '22px', marginBottom: '45px' }}>
              धन्यवाद, टीम {'jmdbook.online'}
            </p>
            <button onClick={() => props.setIsOpen(false)} className='back-btn float-right'>
             <span className="back-arrow">←</span>
  Back
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  )
}
export default React.memo(TransactionPasswordModel)
