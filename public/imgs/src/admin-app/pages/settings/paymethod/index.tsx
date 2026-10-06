import React, { useEffect, useState, FormEvent } from 'react'
import { toast } from 'react-toastify'
import authService from '../../../../services/auth.service'

interface IUpiMethod {
  _id?: string
  upiName: string
  upiId: string
  active: boolean
  type: string
}

interface IBankMethod {
  _id?: string
  bankName: string
  accountHolder: string
  accountNumber: string
  ifscCode: string
  active: boolean
  type: string
}

const PaymentSettings = () => {
  const [upiMethods, setUpiMethods] = useState<IUpiMethod[]>([])
  const [bankMethods, setBankMethods] = useState<IBankMethod[]>([])
  const [loading, setLoading] = useState(false)
  const [editPopup, setEditPopup] = useState<{
    open: boolean
    type: 'upi' | 'bank' | ''
    method: IUpiMethod | IBankMethod | null
  }>({ open: false, type: '', method: null })

  // Fetch existing payment methods
  const getPayments = async () => {
    try {
      const res = await authService.getpymentSettingsList()
      if (res?.data?.data) {
        const data = res.data.data

         // ✅ Log the full fetched data
      console.log("Fetched Data:", data)
      console.log("Fetched UPI Methods:", data.upiMethods)
      console.log("Fetched Bank Methods:", data.bankMethods)
        setUpiMethods(data.upiMethods || [])
        setBankMethods(data.bankMethods || [])
      }
    } catch (err: any) {
      toast.error(err.message || 'Error fetching payment settings')
    }
  }

  useEffect(() => {
    getPayments()
  }, [])

  // Add new UPI method
  const handleAddUpi = () => {
    setBankMethods([]) // only one form at a time
    setUpiMethods([{ upiName: '', upiId: '', active: true, type: 'upi' }])
  }

  // Add new Bank method
  const handleAddBank = () => {
    setUpiMethods([])
    setBankMethods([
      {
        bankName: '',
        accountHolder: '',
        accountNumber: '',
        ifscCode: '',
        active: true,
        type: 'bank',
      },
    ])
  }

  // Change handlers
  const handleChangeUpi = <K extends keyof IUpiMethod>(
    index: number,
    key: K,
    value: IUpiMethod[K]
  ) => {
    const list = [...upiMethods]
    list[index] = { ...list[index], [key]: value }
    setUpiMethods(list)
  }

  const handleChangeBank = <K extends keyof IBankMethod>(
    index: number,
    key: K,
    value: IBankMethod[K]
  ) => {
    const list = [...bankMethods]
    list[index] = { ...list[index], [key]: value }
    setBankMethods(list)
  }

  // Delete existing method
  const handleDelete = async (id: string, type: 'upi' | 'bank', index: number) => {
    if (!window.confirm('Are you sure you want to delete this method?')) return
    try {
      await authService.deletepaymentSetting({ id, type })
      toast.success('Deleted successfully!')
      getPayments()
    } catch (err: any) {
      toast.error(err.message || 'Error deleting method')
    }
  }

  // Save newly added payment methods
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload: any = {}
      if (upiMethods.length && !upiMethods[0]._id) payload.upiMethods = upiMethods
      if (bankMethods.length && !bankMethods[0]._id) payload.bankMethods = bankMethods

      if (!Object.keys(payload).length) {
        toast.warn('No new payment method to save!')
        return
      }

      await authService.savepaymentSettingList(payload)
      toast.success('Payment methods added successfully!')
      getPayments()
      setUpiMethods([])
      setBankMethods([])
    } catch (err: any) {
      toast.error(err.message || 'Error saving payment methods')
    } finally {
      setLoading(false)
    }
  }

  // Update existing payment method
  const handleUpdate = async () => {
    if (!editPopup.method || !editPopup.type) return
    try {
      await authService.updatePaymentMethod({
        id: (editPopup.method as any)._id,
        type: editPopup.type,
        data: editPopup.method,
      })
      toast.success('Updated successfully!')
      setEditPopup({ open: false, type: '', method: null })
      getPayments()
    } catch (err: any) {
      toast.error(err.message || 'Error updating method')
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Payment Methods</h4>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={handleAddUpi}>
            Add UPI
          </button>
          <button className="btn btn-outline-success" onClick={handleAddBank}>
            Add Bank
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* UPI Methods */}
          {upiMethods.map((upi, index) => (
            <div key={upi._id || index} className="col-lg-6">
              <div className="card p-3 mb-3 shadow-sm">
                <div className="form-group mb-2">
                  <label>UPI Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={upi.upiName}
                    disabled={!!upi._id}
                    onChange={(e) => handleChangeUpi(index, 'upiName', e.target.value)}
                  />
                </div>
                <div className="form-group mb-2">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={upi.upiId}
                    disabled={!!upi._id}
                    onChange={(e) => handleChangeUpi(index, 'upiId', e.target.value)}
                  />
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={upi.active}
                    disabled={!!upi._id}
                    onChange={(e) => handleChangeUpi(index, 'active', e.target.checked)}
                  />
                  <label className="form-check-label">Active</label>
                </div>

                <div className="text-end mt-2">
                  {upi._id ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => setEditPopup({ open: true, type: 'upi', method: { ...upi } })}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(upi._id!, 'upi', index)}
                      >
                        Delete
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ))}

          {/* Bank Methods */}
          {bankMethods.map((bank, index) => (
            <div key={bank._id || index} className="col-lg-6">
              <div className="card p-3 mb-3 shadow-sm">
                <div className="form-group mb-2">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bank.bankName}
                    disabled={!!bank._id}
                    onChange={(e) => handleChangeBank(index, 'bankName', e.target.value)}
                  />
                </div>
                <div className="form-group mb-2">
                  <label>Account Holder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bank.accountHolder}
                    disabled={!!bank._id}
                    onChange={(e) =>
                      handleChangeBank(index, 'accountHolder', e.target.value)
                    }
                  />
                </div>
                <div className="form-group mb-2">
                  <label>Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bank.accountNumber}
                    disabled={!!bank._id}
                    onChange={(e) => handleChangeBank(index, 'accountNumber', e.target.value)}
                  />
                </div>
                <div className="form-group mb-2">
                  <label>IFSC Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bank.ifscCode}
                    disabled={!!bank._id}
                    onChange={(e) => handleChangeBank(index, 'ifscCode', e.target.value)}
                  />
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={bank.active}
                    disabled={!!bank._id}
                    onChange={(e) => handleChangeBank(index, 'active', e.target.checked)}
                  />
                  <label className="form-check-label">Active</label>
                </div>

                <div className="text-end mt-2">
                  {bank._id ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm me-2"
                        onClick={() =>
                          setEditPopup({ open: true, type: 'bank', method: { ...bank } })
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(bank._id!, 'bank', index)}
                      >
                        Delete
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ))}

          {/* Submit Button */}
          {(upiMethods.some((m) => !m._id) || bankMethods.some((m) => !m._id)) && (
            <div className="col-lg-12 text-end mt-4">
              <button disabled={loading} type="submit" className="btn btn-primary">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </form>

      {/* EDIT POPUP */}
      {editPopup.open && editPopup.method && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit {editPopup.type.toUpperCase()} Method</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditPopup({ open: false, type: '', method: null })}
                ></button>
              </div>
              <div className="modal-body">
                {editPopup.type === 'upi' ? (
                  <>
                    <div className="form-group mb-2">
                      <label>UPI Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={(editPopup.method as IUpiMethod).upiName}
                        onChange={(e) =>
                          setEditPopup({
                            ...editPopup,
                            method: { ...(editPopup.method as IUpiMethod), upiName: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="form-group mb-2">
                      <label>UPI ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={(editPopup.method as IUpiMethod).upiId}
                        onChange={(e) =>
                          setEditPopup({
                            ...editPopup,
                            method: { ...(editPopup.method as IUpiMethod), upiId: e.target.value },
                          })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group mb-2">
                      <label>Bank Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={(editPopup.method as IBankMethod).bankName}
                        onChange={(e) =>
                          setEditPopup({
                            ...editPopup,
                            method: { ...(editPopup.method as IBankMethod), bankName: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="form-group mb-2">
                      <label>Account Holder Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={(editPopup.method as IBankMethod).accountHolder}
                        onChange={(e) =>
                          setEditPopup({
                            ...editPopup,
                            method: {
                              ...(editPopup.method as IBankMethod),
                              accountHolder: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="form-group mb-2">
                      <label>Account Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={(editPopup.method as IBankMethod).accountNumber}
                        onChange={(e) =>
                          setEditPopup({
                            ...editPopup,
                            method: {
                              ...(editPopup.method as IBankMethod),
                              accountNumber: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="form-group mb-2">
                      <label>IFSC Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={(editPopup.method as IBankMethod).ifscCode}
                        onChange={(e) =>
                          setEditPopup({
                            ...editPopup,
                            method: {
                              ...(editPopup.method as IBankMethod),
                              ifscCode: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditPopup({ open: false, type: '', method: null })}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentSettings
