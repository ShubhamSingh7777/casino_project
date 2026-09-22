import { RootState } from '../../store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getSportListAction, getMatchListAction } from './sport.action'
import ISport from '../../../models/ISport'
import IMatch from '../../../models/IMatch'
import { IApiStatus } from '../../../models/IApiStatus'

export type SportState = {
  sportsList: { sports: ISport[]; status: string; error: any }
  allMatches: { matches: IMatch[]; status: string; error: any }
  currentMatch: IMatch
}

const initialState: SportState = {
  sportsList: {
    sports: [],
    status: '',
    error: '',
  },
  allMatches: {
    matches: [],
    status: '',
    error: '',
  },
  currentMatch: {} as IMatch,
}

const sportSlice = createSlice({
  name: 'sport',
  initialState,
  reducers: {
    setCurrentMatch: (state, action: PayloadAction<IMatch>) => {
      state.currentMatch = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSportListAction.pending, (state) => {
        state.sportsList.status = IApiStatus.Loading
      })
      .addCase(getSportListAction.fulfilled, (state, action) => {
        state.sportsList.sports = action.payload
        state.sportsList.error = ''
        state.sportsList.status = IApiStatus.Done
      })
      .addCase(getSportListAction.rejected, (state, action) => {
        state.sportsList.error = action.payload
        state.sportsList.status = IApiStatus.Fail
      })
      .addCase(getMatchListAction.pending, (state) => {
        state.allMatches.status = IApiStatus.Loading
      })
      .addCase(getMatchListAction.fulfilled, (state, action) => {
        state.allMatches.matches = action.payload
        state.allMatches.error = ''
        state.allMatches.status = IApiStatus.Done
      })
      .addCase(getMatchListAction.rejected, (state, action) => {
        state.allMatches.error = action.payload
        state.allMatches.status = IApiStatus.Fail
      })
  },
})

export const { setCurrentMatch } = sportSlice.actions

export const selectSportList = (state: RootState) => state.sportReducer.sportsList

export const selectCurrentMatch = (state: RootState) => state.sportReducer.currentMatch

export const selectAllMatches = (state: RootState) => state.sportReducer.allMatches

export default sportSlice

