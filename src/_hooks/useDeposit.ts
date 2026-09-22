import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import depositWithdrawService from '../services/deposit-withdraw.service'

type DepositInput = {
  amount: number
  imageUrl_upi?: string
  imageUrl_bank?: string
  utrno_upi?: number
  utrno_bank?: number
}

const useDeposit = () => {
  const [amount, setAmount] = useState<number | null>(null)
  const [bankUpiLists, setBankUpiLists] = useState<any>({})
  const [preview, setPreview] = useState({
    type: '', // "upi" or "bank"
    imagePath: '',
    utrno_upi: '',
    utrno_bank: ''
  })

  // ✅ Dynamic validation schema
  const validationSchema = useMemo(() => {
    return Yup.object().shape({
       amount: Yup.number()
  .required('Amount is required')
  .min(300, 'Amount must be at least 300'),


      utrno_upi: Yup.mixed().when([], {
        is: () => preview.type === 'upi',
        then: (schema) => Yup.number()
          .typeError('UTR is required')
          .required('UTR is required'),
        otherwise: (schema) => Yup.mixed().notRequired(),
      }),

      utrno_bank: Yup.mixed().when([], {
        is: () => preview.type === 'bank',
        then: (schema) => Yup.number()
          .typeError('UTR is required')
          .required('UTR is required'),
        otherwise: (schema) => Yup.mixed().notRequired(),
      }),

      imageUrl_upi: Yup.mixed().when([], {
        is: () => preview.type === 'upi',
        then: (schema) => Yup.string().required('Image required'),
        otherwise: (schema) => Yup.mixed().notRequired(),
      }),

      imageUrl_bank: Yup.mixed().when([], {
        is: () => preview.type === 'bank',
        then: (schema) => Yup.string().required('Image required'),
        otherwise: (schema) => Yup.mixed().notRequired(),
      }),
    })
  }, [preview.type])

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<DepositInput>({
    resolver: yupResolver(validationSchema),
  })

  useEffect(() => {
    depositWithdrawService
      .getPaymentSetting()
   
      .then((res) => {
           console.log("Fetched Payment Settings:", res?.data?.data)
        setBankUpiLists(res?.data?.data)})
  }, [])

  const handleChange = (e: any) => {
    e.preventDefault()
    setAmount(e.target.value)
  }

  const handleUploadedFile = (event: any, type: string) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (!file) return
    setPreview(prev => ({
      ...prev,
      type,
      imagePath: file
    }))
  }

  const handleUploadedUTR = (event: any, type: string) => {
    event.preventDefault()
    const value = event.target.value
    setPreview(prev => ({
      ...prev,
      type,
      utrno_upi: type === 'upi' ? value : prev.utrno_upi,
      utrno_bank: type === 'bank' ? value : prev.utrno_bank,
    }))
  }

  const onSubmit = async () => {
    if (!preview.imagePath) return toast.error('Image is required field')

    const formData = new FormData()
    const amt = getValues('amount')

    formData.append('remark', 'ok')
    formData.append('type', 'deposit')
    formData.append('imageUrl', preview.imagePath)
    formData.append('accountType', preview.type)
    formData.append('amount', amt.toString())

    const utrValue =
      preview.type === 'upi' ? preview.utrno_upi : preview.utrno_bank

    formData.append('utrno', utrValue.toString())

    const response = await depositWithdrawService.addDepositWithdraw(formData)
    if (response?.data?.message) {
      toast.success(response?.data?.message)
      reset()
      setAmount(null)
      setPreview({
        type: '',
        imagePath: '',
        utrno_upi: '',
        utrno_bank: ''
      })
    }
  }

  const generateTransactionId = () => {
    return Math.floor(100000 + Math.random() * 900000)
  }

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    amount,
    handleChange,
    bankUpiLists,
    handleUploadedFile,
    preview,
    generateTransactionId,
    handleUploadedUTR
  }
}

export default useDeposit
