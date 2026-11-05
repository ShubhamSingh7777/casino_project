import { isMobile } from "react-device-detect"

const InputComponent = ({ btnName, valName, changeHandler, btnValue, errorMsg, ...props }: any) => {
  const btnObj: any = btnValue ? btnValue : {}
  return (
    <div className='row row5 mb-3'>
      <div className='col-6 col-lg-6' style={{maxWidth:'50%'}}>
        <div className='form-group mb-0' style={{paddingRight:isMobile?'3px':'4px'}}>
          <input
            placeholder='Button Name'
            name={btnName}
            type='text'
            maxLength={7}
            className='form-control'
            value={btnObj?.[btnName] || ''}
            onChange={changeHandler}
            style={{fontSize: '16px',padding:'5px',color:'#000000'}}
          />
          {!btnObj[btnName] && errorMsg?.[btnName] && (
            <span id='username-required' className='error'>
              {errorMsg?.[btnName]}
            </span>
          )}
        </div>
      </div>
      <div className='col-6 col-lg-6' style={{maxWidth:'50%'}}>
        <div className='form-group mb-0' style={{paddingLeft:isMobile?'3px':'4px'}}>
          <input
            placeholder='Button Value'
            name={valName}
            type='number'
            min={1}
            max={99999999}
            maxLength={9}
            className='form-control'
            value={btnObj?.[valName] || ''}
            onChange={changeHandler}
            style={{fontSize: '16px',padding:'5px',color:'#000000'}}
          />
          {!btnObj[valName] && errorMsg?.[valName] && (
            <span id='username-required' className='error'>
              {errorMsg?.[valName]}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default InputComponent
