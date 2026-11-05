const PaymentQRCode = ({ upiId, name, amount, transactionId }: any) => {
  if (!upiId) return null;

  // ✅ Construct the dynamic UPI payment URL
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    name || ''
  )}&am=${amount || ''}&tn=${transactionId || ''}&cu=INR`;

  // ✅ Encode the full UPI string for QR generation
  const encodedUPI = encodeURIComponent(upiString);

  // ✅ Generate the QR using external API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=225x225&data=${encodedUPI}`;

  return (
    <div style={{ textAlign: 'center' }}>
      <h5 style={{ marginBottom: '10px', color: '#333' }}>Scan to Pay</h5>
      <img
        src={qrCodeUrl}
        alt="UPI Payment QR Code"
        style={{
          width: '270px',
          height: '271px',
          border: '2px solid #116257',
          borderRadius: '10px',
          background: '#fff',
          padding: '8px',
        }}
      />
      <p style={{ fontSize: '12px', marginTop: '6px', color: '#555' }}>
        UPI ID: <b>{upiId}</b>
      </p>
    </div>
  );
};

export default PaymentQRCode;
