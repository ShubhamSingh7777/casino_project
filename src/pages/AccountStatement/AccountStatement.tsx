import moment from 'moment'
import React, { MouseEvent, useState } from 'react'
// import ReactPaginate from 'react-paginate'
import { toast } from 'react-toastify'
import accountService from '../../services/account.service'
import { dateFormat } from '../../utils/helper'
import { isMobile } from 'react-device-detect'
import mobileSubheader from '../_layout/elements/mobile-subheader'
import { AccoutStatement } from '../../models/AccountStatement'
import { AxiosResponse } from 'axios'
import betService from '../../services/bet.service'
import ReactModal from 'react-modal'
import BetListComponent from '../../admin-app/pages/UnsetteleBetHistory/bet-list.component'
import { useAppSelector } from '../../redux/hooks'
import { selectLoader } from '../../redux/actions/common/commonSlice'
import ReactPaginate from 'react-paginate'

const AccountStatement = () => {
  const loadingState = useAppSelector(selectLoader)

  const [accountStmt, setAccountStmt] = React.useState<any>([])
  const [parseAccountStmt, setparseAccountStmt] = React.useState<any>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [betHistory, setBetHistory] = React.useState<any>({})
  const [selectedStmt, setSelectedStmt] = React.useState<AccoutStatement>({} as AccoutStatement)
  const [pageBet, setPageBet] = React.useState(1)
  const [openBalance, setOpenBalance] = React.useState(0)
  const [closeBalance, setCloseBalance] = React.useState(0)
  const [filterdata, setfilterdata] = React.useState<any>({
    startDate: '',
    endDate: '',
    reportType: 'All',
  })
  const [page, setPage] = React.useState(0)

  const [currentItems, setCurrentItems] = useState<any>([])
  const [pageCount, setPageCount] = useState<any>(0)
  const [itemOffset, setItemOffset] = useState<any>(0)
  const [itemsPerPage] = useState<any>(50)
  React.useEffect(() => {
    const filterObj = filterdata
    filterObj.startDate = moment().subtract(7, 'days').format('YYYY-MM-DD')
    filterObj.endDate = moment().format('YYYY-MM-DD')
    setfilterdata(filterObj)
    getAccountStmt(0)
  }, [])

  React.useEffect(() => {
    const endOffset = itemOffset + itemsPerPage
    setCurrentItems(parseAccountStmt.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(parseAccountStmt.length / itemsPerPage))
  }, [itemOffset, itemsPerPage, parseAccountStmt])

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % parseAccountStmt.length
    setItemOffset(newOffset)
    setPage(event.selected)
  }
  const getAccountStmt = (page: number) => {
    accountService
      .getAccountList(page, filterdata)
      .then((res) => {
        if (res?.data?.data) setAccountStmt(res?.data?.data?.items || [])
        if (res?.data?.data?.items && page == 0)
          setOpenBalance(res?.data?.data?.openingBalance || 0)
        setparseAccountStmt(
          dataformat(res?.data?.data?.items || [], res?.data?.data?.openingBalance || 0),
        )
        setPage(page)
      })
      .catch((e) => {
        console.log(e)
        // const error = e.response.data.message
        toast.error('error')
      })
  }
  const handleformchange = (event: any) => {
    const filterObj = filterdata
    filterObj[event.target.name] = event.target.value
    setfilterdata(filterObj)
  }
  const handleSubmitform = (event: any) => {
    event.preventDefault()
    getAccountStmt(0)
  }

  const createSrNo = (index: number) => {
    return (page - 1) * itemsPerPage || 0 + index + 1
  }

  const handlePageClickBets = (event: any) => {
    getBetsData(selectedStmt, event.selected + 1)
  }

  React.useEffect(() => {
    if (isOpen) getBetsData(selectedStmt, pageBet)
  }, [selectedStmt, pageBet, isOpen])

  const getBetsData = (stmt: any, pageNumber: number) => {
    const allBetsid: any = []
    const allbets = stmt?.allBets || []
    if (allbets.length > 0) {
      allbets.map((Item: any) => {
        allBetsid.push(Item.betId)
      })
      const betIds = allBetsid
      betService.getBetListByIds(betIds, pageNumber).then((res: AxiosResponse) => {
        setBetHistory(res.data.data)
        setPageBet(pageNumber)
      })
    }
  }
  const getBets = (e: MouseEvent<HTMLTableCellElement>, stmt: AccoutStatement) => {
    e.preventDefault()
    setSelectedStmt(stmt)
    setPageBet(1)
    setIsOpen(true)
  }
  const getAcHtml = () => {
    let closingbalance: number = page == 1 ? openBalance : closeBalance
    const achtml =
      currentItems &&
      currentItems.map((stmt: any, index: number) => {
        closingbalance = closingbalance + stmt.amount
        return (
          <tr key={`${stmt._id}${index}`} style={{background:'#f2f2f2'}}>
            <td className='wnwrap'> {moment(stmt.date).format("DD/MM/YYYY HH:mm:ss")}</td>
            <td>{stmt.sr_no}</td>
            <td className='green wnwrap'>{stmt.credit >= 0 && stmt.credit.toFixed(2)}</td>
            <td className='red wnwrap'>{stmt.credit < 0 && stmt.credit.toFixed(2)}</td>
            <td className='green wnwrap'>{stmt.closing}</td>
            <td
              className=''
              onClick={(e: MouseEvent<HTMLTableCellElement>) => getBets(e, stmt.stmt)}
            >
              {stmt.narration}
            </td>
          </tr>
        )
      })
    return achtml
  }

  const dataformat = (response: any, closingbalance: any) => {
    const aryNewFormat: any = []

    response &&
      response.map((stmt: any, index: number) => {
        closingbalance = closingbalance + stmt.amount
        aryNewFormat.push({
          _id: stmt._id,
          // eslint-disable-next-line camelcase
          sr_no: index + 1,
          date: moment(stmt.createdAt).format('lll'),
          credit: stmt.amount,
          debit: stmt.amount,
          closing: closingbalance.toFixed(2),
          narration: stmt.narration,
          stmt: stmt,
        })
      })
    return aryNewFormat
  }

  return (
    <>
      {mobileSubheader.subheader('Account Statement')}
      <div className={!isMobile ? ' mt-1' : 'padding-custom casinoListCustom'}>
        <div className='' style={{boxShadow:!isMobile?'0 0 5px #a4a4a4':'',borderRadius: '4px'}}>
          {mobileSubheader.subheaderdesktop('Account Statement')}
          <div className='card-body' style={{padding: isMobile ? '0px' : '0px 7px'}}> 
            <form
              className='ng-pristine ng-valid ng-touched mb-0'
              method='post'
              onSubmit={handleSubmitform}
            >
              <div className='row row5'>
                <div className='col-6 col-lg-2 mbc-5' style={{maxWidth:isMobile?'50%':'',paddingRight:isMobile?'7px':''}}>
                  <div className='form-group mb-0'>
                    <div className='mx-datepicker'>
                      <div className='mx-input-wrapper dateInputAcc'>
                        <input
                          name='startDate'
                          type='date'
                          autoComplete='off'
                          onChange={handleformchange}
                          defaultValue={filterdata.startDate}
                          placeholder='Select Date'
                          className='mx-input ng-pristine ng-valid ng-touched'
                        
                        />
                         <i className="far fa-calendar"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-6 col-lg-2 mbc-5' style={{maxWidth:isMobile?'50%':''}}>
                  <div className='form-group mb-0'>
                    <div className='mx-datepicker'>
                      <div className='mx-input-wrapper dateInputAcc'>
                        <input
                          name='endDate'
                          type='date'
                          autoComplete='off'
                          defaultValue={filterdata.endDate}
                          onChange={handleformchange}
                          placeholder='Select Date'
                          className='mx-input ng-untouched ng-pristine ng-valid'
                        />
                        <i className="far fa-calendar"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-lg-3 mbc-5'>
                  <div className='form-group mb-0 selectAccStmt'>
                    <select
                      name='reportType'
                      onChange={handleformchange}
                      className='custom-select ng-untouched ng-pristine ng-valid'
                    >
                      <option value='ALL'>All </option>
                      <option value='chip'>Deposite/Withdraw Reports </option>
                      <option value='game'>Game Report </option>
                    </select>
                    <i className="fas fa-chevron-down"></i>
                  </div>
                </div>
                <div className='col-12 col-lg-2 mbc-5'>
                  <button type='submit' className='btn btn-primary btn-block'>
                    Submit
                  </button>
                </div>
                <div className='col-12 col-lg-12 mbc-5 d-flex'>
                   <div className='col-lg-6 col-6' style={{paddingLeft:isMobile?'0px':'0px',paddingRight:isMobile?'0px':'0px',maxWidth:isMobile?'50%':''}}>
                      <div className='mb-2 input-group input-group-showentries selectAccStmt position-relative'>
                        <span className='me-2'>Show</span>
                        <select className='form-select'>
                            <option value='10'>10</option>
                            <option value='20'>20</option>
                            <option value='30'>30</option>
                            <option value='40'>40</option>
                            <option value='50'>50</option>
                        </select>
                        <img src='/imgs/dropdownicon.svg' alt='' style={{left:isMobile?'105px':'80px',right:'0px',width:'12px'}}/>
                        <span className='ms-2'>Entries</span>
                      </div>
                   </div>
                    <div className='col-lg-6 col-6 d-flex' style={{paddingLeft:isMobile?'0px':'0px',paddingRight:isMobile?'0px':'0px',maxWidth:isMobile?'50%':'',justifyContent:!isMobile?'end':'',alignItems:isMobile?'center':'center',marginBottom:isMobile?'4px':''}}>
                        <span className='me-2' style={{marginRight:isMobile?'.5rem':'.5rem'}}>Search:</span>
                        <input type="search" className="form-control" placeholder="0 records..." style={{width:isMobile?'75%':'20%'}}/>
                   </div>
                </div>
              </div>
            </form>
            <div className='table-responsive'>
              <table className='text-center' id='customers1'>
                <thead>
                  <tr style={{borderWidth:'1px 0'}}>
                    <th className={`${isMobile?'table-Head-mob' : 'table-Head-desk'}`} style={{ width: isMobile?'21%':'19%', textAlign:isMobile?'start': 'start', whiteSpace: 'nowrap'}}>
                      Date{' '} 
                    </th>
                    <th className={`${isMobile?'table-Head-mob' : 'table-Head-desk'}`} style={{ width:isMobile?'10%': '7%', textAlign:isMobile?'end': 'end', whiteSpace: 'nowrap',}}>
                      Sr no
                    </th>
                    <th className={`${isMobile?'table-Head-mob' : 'table-Head-desk'} bet-event-name`} style={{ width:isMobile? '10%':'10%', textAlign:isMobile? 'center':'end' }}>Credit </th>
                    <th className={`${isMobile?'table-Head-mob' : 'table-Head-desk'} bet-event-name`} style={{ width:isMobile? '10%':'10%', textAlign:isMobile? 'center':'end'}}>Debit</th>
                    <th className={`${isMobile?'table-Head-mob' : 'table-Head-desk'} bet-event-name`} style={{ width:isMobile? '9%':'10%', textAlign: isMobile? 'center':'end'}}>Balance</th>
                    <th className={`${isMobile?'table-Head-mob' : 'table-Head-desk'} bet-event-name`} style={{ width:isMobile? '9%':'45%', textAlign:isMobile? 'center':'start'}}>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {parseAccountStmt.length <= 0 ||
                    (parseAccountStmt.length > 0 && parseAccountStmt.length <= 0 && (
                      <tr>
                        <td colSpan={8} className='text-center'>
                          No Result Found
                        </td>
                      </tr>
                    ))}
                  {/* {parseAccountStmt.length > 0 && parseAccountStmt.length > 0 && page == 0 && (
                    <tr key={parseAccountStmt[0]._id}>
                      
                      <td className='wnwrap'> */}
                        {/* {moment(parseAccountStmt[0].createdAt).format(dateFormat)} */}
                        {/* {moment(parseAccountStmt[0].createdAt).format("DD/MM/YYYY HH:mm:ss")} */}
                      {/* </td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td className='wnwrap'>{openBalance?.toFixed(2)}</td>
                      <td className='wnwrap'>Opening Balance</td>
                    </tr>
                  )} */}

                  {getAcHtml()}
                </tbody>
              </table>
            </div>
            <ReactPaginate
              breakLabel='...'
              nextLabel='>>'
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              containerClassName={'pagination'}
              activeClassName={'active'}
              previousLabel={'<<'}
              breakClassName={'break-me'}
            />
          </div>
        </div>
      </div>
      {/* @ts-ignore Server Component */}
      <ReactModal
        isOpen={isOpen}
        onAfterClose={() => setIsOpen(false)}
        onRequestClose={(e: any) => {
          setIsOpen(false)
        }}
        contentLabel='Set Max Bet Limit'
        className={'col-md-12'}
        ariaHideApp={false}
      >
        <div className='modal-content'>
          <div className='modal-header'>
            <h5>Bets</h5>
            <button onClick={() => setIsOpen(false)} className='close float-right'>
              <i className='fa fa-times-circle'></i>
            </button>
          </div>
          <div className='modal-body'>
            {!loadingState && (
              <BetListComponent
                bethistory={betHistory}
                handlePageClick={handlePageClickBets}
                page={page}
                isTrash={false}
              />
            )}
          </div>
        </div>
      </ReactModal>
    </>
  )
}
export default AccountStatement
