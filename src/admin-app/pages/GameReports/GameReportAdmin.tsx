import React from 'react'
import ReactPaginate from 'react-paginate'
import { toast } from 'react-toastify'
import mobileSubheader from '../_layout/elements/mobile-subheader'
import { isMobile } from 'react-device-detect'
import moment from 'moment'
import accountService from '../../../services/account.service'
import CustomAutoComplete from '../../components/CustomAutoComplete'
import userService from '../../../services/user.service'
import { SportName } from '../../../models/SportTypes'
import SubmitButton from '../../../components/SubmitButton'
import { useLocation } from 'react-router-dom'

const GameReportAdmin = () => {
  const [filterdata, setfilterdata] = React.useState<any>({ startDate: '', endDate: '' })
  const [bethistory, setbethistory] = React.useState<any>({})
  const [page, setPage] = React.useState(1)
  const [pnlboxFinal, setPnlbox] = React.useState<any>({})
  const [submitClicked, setSubmitClicked] = React.useState(false)
  const autoRef = React.useRef<any>(null)
    const location = useLocation();

  const getDateTime = React.useMemo(() => {
    const filterObj = filterdata
    filterObj.startDate = moment().subtract(7, 'days').format('YYYY-MM-DD')
    filterObj.endDate = moment().format('YYYY-MM-DD')
    return filterObj
  }, [])

  React.useEffect(() => {
    setfilterdata(getDateTime)
    getAccountStmt(1)
  }, [])

  React.useEffect(() => {
    if (submitClicked) {
      getAccountStmt(1)
      setSubmitClicked(false) // Reset submitClicked state
    }
  }, [submitClicked])

  const getAccountStmt = (page: number) => {
    accountService
      .getProfitLoss(page, filterdata)
      .then((res) => {
        res && res.data && res.data.data && setbethistory(res.data.data)
        res && res.data && res.data.data && sportsPlBox(res.data.data)

        setPage(page)
      })
      .catch((e) => {
        const error = e.response.data.message
        toast.error(error)
      })
  }
  const handleformchange = (event: any) => {
    const filterObj = filterdata
    filterObj[event.target.name] = event.target.value
    setfilterdata(filterObj)
  }
  const handleSubmitform = (event: any) => {
    event.preventDefault()
    setSubmitClicked(true)
  }
  const handlePageClick = (event: any) => {
    getAccountStmt(event.selected + 1)
  }

  const onSuggestionsFetchRequested = ({ value }: any) => {
    return userService.getUserListSuggestion({ username: value })
  }

  const onSelectUser = (user: any) => {
    setfilterdata({ ...filterdata, userId: user._id })
  }

  const reset = () => {
    autoRef.current.resetValue()
    setfilterdata(getDateTime)
    setSubmitClicked(true)
  }

  const trrepeat = (Item: any, index: number) => {
    const classdata = Item.total > 0 ? 'green' : 'red'
    const splitname = Item.narration != '' ? Item.narration.split('/')[0] : ''
    return (
      <>
        <tr key={index}>
          <td className='text-start'>{SportName[Item.sportId]}</td>
          <td className='text-start wnwrap'>{splitname}</td>
          <td className={`text-start wnwrap ${classdata}`}>{Item?.total?.toFixed(2)}</td>
        </tr>
      </>
    )
  }
  const sportsPlBox = (bethistory: any) => {
    const pnlbox: any = {}
    bethistory && bethistory.items && bethistory.items.length && bethistory.items.map((item: any, index: number) => {
      const splitname = item.narration != '' ? item.narration.split('/')[0] : ''
      const sportsNameData = SportName[item.sportId]
      if (sportsNameData != 'Casino') {
        pnlbox[sportsNameData] = pnlbox?.[sportsNameData] || 0 + +item?.total?.toFixed(2) || 0
      } else {
        pnlbox[splitname] = pnlbox?.[splitname] || 0 + +item?.total?.toFixed(2) || 0
      }
    })
    setPnlbox(pnlbox)
  }
  const TransactionData =
    bethistory && bethistory.items && bethistory.items.length ? (
      bethistory.items.map((item: any, index: number) => {
        return trrepeat(item, index)
      })
    ) : (
      <tr>
        <td colSpan={8} style={{ textAlign: 'center' }}>
          No Result Found
        </td>
      </tr>
    )
  return (
    <>
      {mobileSubheader.subheaderdesktopadmin('Game Reports',"",location.pathname)}
      <div className='container-fluid' style={{ background: "#f9f9f9" }}>
        <div className='row'>
          <div className={!isMobile ? 'col-md-12 mt-1' : 'col-md-12 padding-custom'}>
            <div className=''>
              <div className='card-body mb-20'>
                <form
                  className='ng-pristine ng-valid ng-touched mb-0'
                  method='post'
                  onSubmit={handleSubmitform}
                >
                  <div className='row row5'>
                       <div className='col-6 col-lg-2 mbc-5'  style={{ paddingLeft: "6px" }}>
                      <div className='form-group mb-0'>
                        <label className='label'>From</label>
                        <div className='mx-datepicker'>
                          <div className='mx-input-wrapper'>
                            <input
                              name='startDate'
                              type='date'
                              autoComplete='off'
                              onChange={handleformchange}
                              defaultValue={filterdata.startDate}
                              placeholder='Select Date'
                              className='mx-input ng-pristine ng-valid ng-touched'
                              style={{background:'#e9ecef'}}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-6 col-lg-2 mbc-5'>
                      <div className='form-group mb-0'>
                        <label className='label'>To</label>
                        <div className='mx-datepicker'>
                          <div className='mx-input-wrapper'>
                            <input
                              name='endDate'
                              type='date'
                              autoComplete='off'
                              defaultValue={filterdata.endDate}
                              onChange={handleformchange}
                              placeholder='Select Date'
                              className='mx-input ng-untouched ng-pristine ng-valid'
                              style={{background:'#e9ecef'}}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-6 col-lg-2 mbc-5'>
                      <label className='label'>User</label>
                      <CustomAutoComplete
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSelectUser={onSelectUser}
                        ref={autoRef}
                      />
                    </div>
                 
                    <div className='col-12 col-lg-1 mbc-5'>
                      <label className='label'>&nbsp;</label>
                      <SubmitButton type='submit' className='btn btn-primary btn-block createuserBtn'>
                        Submit
                      </SubmitButton>
                    </div>
                    <div className='col-12 col-lg-1 mbc-5' style={{paddingLeft:'0px'}}>
                      <label className='label'>&nbsp;</label>
                      <button type='button' onClick={reset} className='btn btn-primary btn-block createuserBtn'>
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className='card-body'>

                <div className='table-responsive'>
                  <table id='customers1'>
                    <thead>
                      <tr>
                        <th className='text-start text-greyNew wnwrap' style={{borderRight:'unset',borderBottom:'1px solid #111'}}>Event Type</th>
                        <th className='text-start text-greyNew  wnwrap' style={{borderRight:'unset',borderBottom:'1px solid #111',borderLeft:'unset'}}>Event Name </th>
                        <th className='text-start text-greyNew wnwrap' style={{borderLeft:'unset',borderBottom:'1px solid #111'}}>Amount</th>
                      </tr>
                    </thead>
                    <tbody style={{background:'rgba(0, 0, 0, 0.05)'}}>{TransactionData}</tbody>
                  </table>
                </div>
                <ReactPaginate
                  breakLabel='...'
                  nextLabel='>>'
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={bethistory.totalPages}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                  previousLabel={'<<'}
                  breakClassName={'break-me'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default GameReportAdmin
