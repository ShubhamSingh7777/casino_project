import { useEffect, useState } from 'react'
import useDeposit from '../../_hooks/useDeposit'
import PaymentQRCode from '../../components/PaymentQRCode'
import './deposit.css'
import { toast } from 'react-toastify'

const Deposit = () => {
  const [activeTabBank,setActiveTabBank] = useState<"upi" | "bank">("upi");
  const [selectedUpi, setSelectedUpi] = useState<any>(null);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  

  const {
    register,
    handleSubmit,
    amount,
    handleChange,
    onSubmit,
    bankUpiLists,
    handleUploadedFile,
    preview,
    generateTransactionId,
    handleUploadedUTR
  } = useDeposit()

  const [transactionId, setTransactionId] = useState(() => generateTransactionId());

  const copytoclipboard = (code: string) => {
    const textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = "0";
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success("Copied successfully");
    } catch (err) {
      console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
  }
  useEffect(() => {
  if (bankUpiLists?.upiMethods?.length > 0 && !selectedUpi) {
    const firstActive = bankUpiLists.upiMethods.find((u: any) => u.active);
    if (firstActive) setSelectedUpi(firstActive);
  }
}, [bankUpiLists]);

useEffect(() => {
  if (bankUpiLists?.bankMethods?.length > 0 && !selectedBank) {
    const firstActiveBank = bankUpiLists.bankMethods.find((b: any) => b.active);
    if (firstActiveBank) setSelectedBank(firstActiveBank);
  }
}, [bankUpiLists]);
function handlewhatsappclick() {
    const phone = "1234567890"; // E.164 format (country code + number)
    const url = `https://wa.me/${phone}`;
    window.open(url, "_blank"); //
  }
  return (
   <div className='mt-5'>
     <div className='card mb-10' style={{border:'none',boxShadow:'none'}}>
       <div className='card-header w-100' style={{display:"flex",justifyContent:'space-between',alignItems:'center'}}>
         <h4 className='mb-0'>Deposit</h4>
         <div className='btnTrnsactionType'>
           <button className='btnTransactionUPI' onClick={() => setActiveTabBank("upi")} style={{border: activeTabBank === "upi" ? "none" : "1px solid rgb(211, 211, 211)",background: activeTabBank === "upi" ? "rgb(211, 211, 211)" : "none",color: activeTabBank === "upi" ? "black" : "rgb(211, 211, 211)",fontSize:'14px',padding: '5px 10px',borderRadius:'4px',width:'45%',fontWeight:'bold',cursor:'pointer'}}>UPI</button> 
           <button onClick={() => setActiveTabBank("bank")} style={{border: activeTabBank === "bank" ? "none" : "1px solid rgb(211, 211, 211)",background: activeTabBank === "bank" ? "rgb(211, 211, 211)" : "none",color: activeTabBank === "bank" ? "black" : "rgb(211, 211, 211)",fontSize:'14px',padding: '5px 10px',borderRadius:'4px',width:'45%',fontWeight:'bold'}}>Bank</button>
         </div>
       </div>
       <button className='whatsapp-btnDeposit' onClick={handlewhatsappclick}>WHATSAPP DEPOSIT</button>

       <div className='card-body' style={{border:'none'}}>
          <div className='deposit-page deposit'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='deposit-form' style={{ padding: '0px' }}>
                <div className='row row5 mt-2'>
                  <div className='col-md-3 col-12'>
                    <label className='w-100 label-amount'>Enter Amount:</label>
                    <div className='form-group depo-amount'>
                      <input
                        type='number'
                        placeholder='Amount'
                        className='form-control'
                        {...register('amount')}
                        onChange={handleChange}
                      />
                    </div>
                    {amount && amount < 100 && <div style={{margin:'-0.6rem auto 0 auto',textAlign:'justify',color:'red'}}>Minimum amount must 100 or more</div>}
                  </div>
                </div>
              </div>
              <div className='payment-ions-container mt-3'>
                  
                {/* ---------------- UPI PAYMENT SECTION ---------------- */}
                {activeTabBank === "upi" && (
                 <div>
                   {/* UPI Tabs */}
                   <div className="upiTabs">
                     {bankUpiLists?.upiMethods?.map((upi: any, index: number) => (
                     <div
                       key={upi._id}
                       onClick={() => setSelectedUpi(upi)}
                       style={{
                         color: 'black',
                         background: selectedUpi?._id === upi._id ? 'rgb(211, 211, 211)' : 'transparent',
                         padding: '4px 30px',
                         fontSize: '12px',
                         fontWeight: 'bold',
                         cursor: 'pointer',
                         borderRadius: '4px'
                       }}
                     >
                       {`UPI${index + 1}`}
                     </div>
                    ))}
                 </div>
                 {/* Show Selected UPI */}
                 {selectedUpi && (
                   <div className='payment-icons'>
                     <div className='glass' />
                     <div className='content'>
          <div className='payment-icons-title'>
            <h4 className='mb-0'>
              <span>UPI Payment</span>
              <i className='fas fa-info-circle payment-rules' />
            </h4>
            <p>Make Sure You Attach Successful Payment Screenshot</p>
          </div>

          <div className='deposit-options'>
            <div className={`bank-detail ${amount && amount >= 100 ? '' : 'payment-disable'}`}>
              <div className='payment-detail-box'>
                <p>
                  {selectedUpi?.upiId}
                  <span className='ml-auto'>
                    <i
                      className='fas fa-copy mr-1'
                      onClick={() => copytoclipboard(selectedUpi?.upiId)}
                    />
                  </span>
                </p>
              </div>

              <div className='text-center qr-code'>
                <PaymentQRCode
                  upiId={selectedUpi?.upiId}
                  name={selectedUpi?.upiName}
                  amount={amount}
                 transactionId={transactionId}
                />
              </div>
            </div>
          </div>

          {/* UTR Input */}
          <div className='col-lg-12' style={{ padding: "7px" }}>
            <input
              type="number"
              className='form-control'
              placeholder='Enter UTR No'
              disabled={amount && amount >= 100 ? false : true}
              {...register('utrno_upi')}
              value={preview.utrno_upi}
              onChange={(e) => handleUploadedUTR(e, 'upi')}
            />
          </div>

          {/* Upload + Pay */}
          <div className='p-2 w-100 d-flex align-items-center justify-content-between'>
            <div className={`upload-ss ${amount && amount >= 100 ? '' : 'pay-disable'}`}>
              <input
                type='file'
                id='upload-upi'
                disabled={!(amount && amount >= 100)}
                hidden
                accept='image/png, image/jpg, image/jpeg'
                {...register('imageUrl_upi')}
                onChange={(e) => handleUploadedFile(e, 'upi')}
              />
              <label htmlFor='upload-upi'>
                <i className='fas fa-plus-circle mr-1' />
                upload payment screenshot
              </label>
            </div>
            <button
              className={`payment-pay-now d-flex flex-wrap justify-content-center ${preview?.imagePath && preview?.type === 'upi' ? '' : 'pay-disable'}`}
              type='submit'
            >
              <div className='w-100 text-center'>
                <span>Pay Now</span>
              </div>
              <small>(Range: 100 - 100000)</small>
            </button>
          </div>
                     </div>
                   </div>
                  )}
               </div>
                )}

                {/* ---------------- BANK TRANSFER SECTION ---------------- */}
                {/* ---------------- BANK TRANSFER SECTION ---------------- */}
{activeTabBank === "bank" && (
  <div>
    {/* Bank Buttons */}
    <div className="upiTabs"
    >
      {bankUpiLists?.bankMethods?.map((bank: any, index: number) => (
        <div
          key={bank._id}
          onClick={() => setSelectedBank(bank)}
          style={{
            color: "white",
            background:
              selectedBank?._id === bank._id ? "rgb(211, 211, 211)" : "transparent",
            padding: "4px 30px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "4px",
            transition: "0.3s",
          }}
        >
          {`Bank ${index + 1}`}
        </div>
      ))}
    </div>

    {/* Bank Details Section */}
    {selectedBank && (
      <div className="payment-icons">
        <div className="glass" />
        <div className="content">
          <div className="payment-icons-title">
            <h4 className="mb-0">
              <span>Account Transfer</span>
              <i className="fas fa-info-circle payment-rules" />
            </h4>
            <p>Make Sure You Attach Successful Payment Screenshot</p>
          </div>

          <div className="deposit-options">
            <div
              className={`bank-detail ${
                amount && amount >= 100 ? "" : "payment-disable"
              }`}
            >
              <div className="payment-detail-box">
                <p>
                  {selectedBank?.accountHolder}
                  <i
                    className="fas fa-copy mr-1"
                    onClick={() =>
                      copytoclipboard(selectedBank?.accountHolder)
                    }
                  />
                </p>
              </div>

              <div className="payment-detail-box">
                <p>
                  {selectedBank?.accountNumber}
                  <i
                    className="fas fa-copy mr-1"
                    onClick={() =>
                      copytoclipboard(selectedBank?.accountNumber)
                    }
                  />
                </p>
              </div>

              <div className="payment-detail-box">
                <p>
                  {selectedBank?.ifscCode}
                  <i
                    className="fas fa-copy mr-1"
                    onClick={() =>
                      copytoclipboard(selectedBank?.ifscCode)
                    }
                  />
                </p>
              </div>

              <div className="payment-detail-box">
                <p>
                  {selectedBank?.bankName}
                  <i
                    className="fas fa-copy mr-1"
                    onClick={() => copytoclipboard(selectedBank?.bankName)}
                  />
                </p>
              </div>
            </div>
          </div>

          {/* UTR Input */}
          <div className="col-lg-12" style={{ padding: "7px" }}>
            <input
              type="number"
              className="form-control"
              placeholder="Enter UTR No"
              disabled={amount && amount >= 100 ? false : true}
              {...register("utrno_bank")}
              value={preview.utrno_bank}
              onChange={(e) => handleUploadedUTR(e, "bank")}
            />
          </div>

          {/* Upload + Pay */}
          <div className="p-2 w-100 d-flex align-items-center justify-content-between">
            <div
              className={`upload-ss ${amount && amount >= 100 ? "" : "pay-disable"}`}
            >
              <input
                type="file"
                id="upload-bank"
                disabled={!(amount && amount >= 100)}
                hidden
                accept="image/png, image/jpg, image/jpeg"
                {...register("imageUrl_bank")}
                onChange={(e) => handleUploadedFile(e, "bank")}
              />
              <label htmlFor="upload-bank">
                <i className="fas fa-plus-circle mr-1" />
                upload payment screenshot
              </label>
            </div>

            <button
              className={`payment-pay-now d-flex flex-wrap justify-content-center ${
                preview?.imagePath && preview?.type === "bank"
                  ? ""
                  : "pay-disable"
              }`}
              type="submit"
            >
              <div className="w-100 text-center">
                <span>Pay Now</span>
              </div>
              <small>(Range: 100 - 100000)</small>
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

               </div>
             </form>
           </div>
         </div>
       </div>
     </div>
  )
}

export default Deposit
