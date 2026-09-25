import { createAsyncThunk } from '@reduxjs/toolkit'
import IBet from '../../../models/IBet'
import betService from '../../../services/bet.service'
import { setExposer } from '../balance/balanceSlice'
import { setbetlist, setBookMarketList } from './betSlice'
import { cssTransition, toast } from 'react-toastify'
import axios from 'axios'
    const slideDownUp = cssTransition({
  enter: "toast-slide-down",
  exit: "toast-slide-up",
  appendPosition: false,
  collapse: true,
});
export const getPlaceBetAction = createAsyncThunk(
  'bet/placebet',
  async (data: IBet, { rejectWithValue, dispatch }) => {


    console.log('calling api of bet')
    return betService
      .getPlaceBet(data)
      .then((res) => {
        // console.log('api call------>')
        // console.log('data from placebet ----->',res.data.data.bet);
  //        console.log("========== PLACE BET RESPONSE ==========");
  // console.log("Bet response:", res.data);
  // console.log("Profitlist:", res.data?.data?.profitlist);
  // console.log(
  //   "Profitlist keys:",
  //   Object.keys(res.data?.data?.profitlist || {})
  // );
        dispatch(setExposer(res.data.data.exposer))
        dispatch(setBookMarketList(res.data.data.profitlist))
        dispatch(setbetlist(res.data.data.bet))
        toast.success('Bet Placed Successfully',{
          className: "error-toast-old success-toast",
          bodyClassName: "error-toast-body",
          autoClose: 1000,
          icon: "✓",
          transition: slideDownUp,
        })
        return res.data.data.bet
      })
      .catch((e) => {
        const DEFAULT_ERROR = "Something went wrong while placing bet";

        const errorMsg = axios.isAxiosError(e)
          ? e.response?.data?.message || DEFAULT_ERROR
          : DEFAULT_ERROR;

        toast.error(errorMsg, {
          className: "error-toast-old error-toast",
          bodyClassName: "error-toast-body",
          autoClose: 1000,
          icon: "⚠️",
          transition: slideDownUp,
        });

        return rejectWithValue(errorMsg);
      })
  },
)