import api, { fancyApi } from '../utils/api'
import IBet from '../models/IBet'

class BetService {
  getPlaceBet(betData: IBet) {
    // return fancyApi.post('placebet', betData)
    return api.post('placebet', betData)
  }
  getBets(matchId: number) {
    return api.get(`bets?matchId=${matchId}`)
  }
  getMarketAnalysis() {
    return api.get(`get-market-analysis`)
  }
  getBetListByIds(betIds: Array<string>, page: number) {
    return api.post(`get-bet-list-by-ids`, { betIds, page })
  }
     getundobet(marketId: number) {
    return api.post(`/undobet`,{marketId})
  }
   getclearbets(marketId: number) {
    return api.post(`/clearbets`,{marketId})
  }
  deleteCurrentBet(id: string) {
    return api.delete(`delete-current-bet/${id}`)
  }
  updateBetMarket(data: any) {
    return api.put(`update-market`, data)
  }

  updateSettledBet(data: any) {
    return api.put(`update-settled-bet`, data)
  }
  betLock(data: any) {
    return api.post(`bet-lock`, data)
  }
  getChildUserList(matchId: number, username?: string) {
    return api.get(`get-child-user-list?username=${username}&matchId=${matchId}`)
  }
  deleteBets(data: { ids: Array<string> }) {
    return api.post(`delete-bets`, data)
  }

  usersLockClientList(data: { ids: Array<string>; lock: boolean; type: string }) {
    return api.post(`users-lock`, data)
  }
}
export default new BetService()
