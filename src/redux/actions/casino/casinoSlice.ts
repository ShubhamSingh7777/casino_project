import { RootState } from "../../store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ICasinoMatch from "../../../models/ICasinoMatch";
export type CasinoState = {
  currentMatch: ICasinoMatch;
  homePageCasino: Array<ICasinoMatch>;
  premiumCasino: Array<ICasinoMatch>;
  virtualCasino: Array<ICasinoMatch>;
};

const initialState: CasinoState = {
  currentMatch: {} as ICasinoMatch,
  homePageCasino: [],
  premiumCasino: [],
  virtualCasino: [],
};

const casinoSlice = createSlice({
  name: "casino",
  initialState,
  reducers: {
    setCasinoCurrentMatch: (state, action: PayloadAction<any>) => {
      state.currentMatch = action.payload;
    },
    setHomePageCasinoMatch: (state, action: PayloadAction<any>) => {
      state.homePageCasino = action.payload;
    },
    setPremiumCasinoMatch: (state, action: PayloadAction<ICasinoMatch[]>) => {
      state.premiumCasino = action.payload;
    },
    setVirtualCasinoMatch: (state,action: PayloadAction<ICasinoMatch  []>)=>{
      state.virtualCasino = action.payload;
    }
  },
});

export const {
  setCasinoCurrentMatch,
  setHomePageCasinoMatch,
  setPremiumCasinoMatch,
  setVirtualCasinoMatch
} = casinoSlice.actions;
export const selectCasinoCurrentMatch = (state: RootState) =>
  state.casinoReducer.currentMatch;
export const selectCasinoMatchList = (state: RootState) =>
  state.casinoReducer.homePageCasino;
export const selectPremiumCasinoList = (state: RootState) =>
  state.casinoReducer.premiumCasino;
export const selectVirtualCasinoList = (state: RootState) =>
  state.casinoReducer.virtualCasino;
export default casinoSlice;