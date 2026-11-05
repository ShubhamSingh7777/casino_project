import React, { useState } from 'react'
import moment from 'moment'
import ReactPaginate from 'react-paginate'
import IBet from '../../../models/IBet'
import User, { RoleType } from '../../../models/User'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import { useAppSelector } from '../../../redux/hooks'
import { CONSTANTS } from '../../../utils/constants'
import EditSettledBetModal from './EditSettledBetModal'

interface BetListProps {
  bethistory: any
  page: number
  onTrash?: (e: any, bet: IBet) => void
  handlePageClick: (event: any) => void
  isTrash?: boolean
  handleSelectAll?: () => void
  selectAll?: boolean
  handleSelectItem?: (bet: IBet) => void
  onRefresh?: () => void
}

const getsportsname = (sportsId: any) => {
  return sportsId != ''
    ? CONSTANTS.SPORT_NAME.filter((Item: any) => Item.id == sportsId)[0]?.name || 'Casino'
    : ''
}
const BetListComponent = ({
  bethistory,
  onTrash,
  handlePageClick,
  isTrash,
  handleSelectAll,
  selectAll,
  handleSelectItem,
  onRefresh,
}: BetListProps) => {
  const userState = useAppSelector<{ user: User }>(selectUserData)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editBet, setEditBet] = useState<IBet | null>(null)

  const trrepeat = (Item: IBet, index: number) => {
    const classdata = Item.isBack ? 'back' : 'lay'
    return (
      <tr key={index} className={classdata}>
        {handleSelectAll && (
          <td>
            <input
              type={'checkbox'}
              checked={Item.selected || false}
              onChange={() => handleSelectItem?.(Item)}
            />
          </td>
        )}
        {userState?.user?.role !== RoleType.user && (
          <td className='text-center wnwrap'>{Item.parentNameStr}</td>
        )}
        <td className='text-center wnwrap'>{Item.userName}</td>
        <td className='text-center wnwrap'>{Item.matchName}</td>
        <td className='text-center wnwrap'>
          {Item.selectionName} /{' '}
          {Item.marketName === 'Fancy' && Item.gtype !== 'fancy1' ? Item.volume : Item.odds}{' '}
        </td>
        <td className='text-center wnwrap'>{getsportsname(Item.sportId)}</td>
        <td className='text-center wnwrap'>{Item.marketName}</td>
        <td className='text-center wnwrap'>{Item.odds}</td>
        <td className='text-center wnwrap'>{Item.stack}</td>
        <td className='text-center wnwrap'>{Item.status=='completed'?Item?.profitLoss?.toFixed(2):Item.pnl?.toFixed(2)}</td>
        <td className='text-center wnwrap'>
          {Item.createdAt &&
            moment(Item?.createdAt).format(
              'YYYY-MM-DD HH:mm:ss',
            )}
        </td>
        {isTrash && (
          <td className='text-center wnwrap'>
            {Item.status == 'completed' && userState?.user?.role === RoleType.admin && (
              <>
                <a onClick={(e) => { e.preventDefault(); setEditBet(Item); setShowEditModal(true); }} href='#' style={{ marginRight: '10px' }}>
                  <i className='fa fa-edit' />
                </a>
                <a onClick={(e) => onTrash && onTrash(e, Item)} href='#'>
                  <i className='fa fa-trash' />
                </a>
              </>
            )}
          </td>
        )}
      </tr>
    )
  }

  const TransactionData =
    bethistory && bethistory.docs && bethistory.docs.length ? (
      bethistory.docs.map((item: IBet, index: number) => {
        return trrepeat(item, index)
      })
    ) : (
      <tr>
        <td colSpan={11} style={{ textAlign: 'center' }}>
          No Result Found
        </td>
      </tr>
    )

  return (
    <>
      <div className='table-responsive'>
        <table id='customers1'>
          <thead>
            <tr>
              {handleSelectAll && (
                <th className='text-start text-greyNew wnwrap' style={{borderRight:'unset',borderBottom:'1px solid #111'}}>
                  <input
                    type={'checkbox'}
                    checked={selectAll || false}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {userState?.user?.role !== RoleType.user && (
                <th className='text-start text-greyNew wnwrap' style={{borderRight:'unset',borderBottom:'1px solid #111',whiteSpace: 'nowrap'}}>
                  Uplevel
                </th>
              )}
              <th className='text-start text-greyNew  wnwrap' style={{borderRight:'unset',borderBottom:'1px solid #111',borderLeft:'unset'}}>
                User Name
              </th>
              <th className='text-start text-greyNew  wnwrap' style={{borderRight:'unset',borderBottom:'1px solid #111',borderLeft:'unset'}}>
                Event Name
              </th>
              <th className='text-start text-greyNew  wnwrap' style={{borderRight:'unset',borderBottom:'1px solid #111',borderLeft:'unset'}}>
                Nation
              </th>
              <th className='text-start text-greyNew  wnwrap' style={{borderRight:'unset',borderBottom:'1px solid #111',borderLeft:'unset'}}>
                Event Type
              </th>
              <th className='text-start text-greyNew  wnwrap' style={{borderRight:'unset',borderBottom:'1px solid #111',borderLeft:'unset'}}>
                Type
              </th>
              <th className='text-start text-greyNew  wnwrap' style={{borderRight:'unset',borderBottom:'1px solid #111',borderLeft:'unset'}}>
                Rate{' '}
              </th>
              <th className='text-start text-greyNew  wnwrap' style={{borderRight:'unset',borderBottom:'1px solid #111',borderLeft:'unset'}}>Amount</th>
              <th className='text-start text-greyNew  wnwrap' style={{borderRight:'unset',borderBottom:'1px solid #111',borderLeft:'unset'}}>P/L</th>
              <th className='text-start text-greyNew  wnwrap' style={{borderRight:'unset',borderBottom:'1px solid #111',borderLeft:'unset'}}>
                Place Date
              </th>
              {isTrash && (
                <th className='text-start text-greyNew  wnwrap' style={{borderBottom:'1px solid #111',borderLeft:'unset'}}>
                  Action
                </th>
              )}
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
        pageCount={bethistory.totalPages || 0}
        containerClassName={'pagination'}
        activeClassName={'active'}
        previousLabel={'<<'}
        breakClassName={'break-me'}
      />
      <EditSettledBetModal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        bet={editBet} 
        onUpdate={() => {
          if (onRefresh) onRefresh()
          else window.location.reload()
        }}
      />
    </>
  )
}

export default BetListComponent
