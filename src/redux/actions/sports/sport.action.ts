import { createAsyncThunk } from '@reduxjs/toolkit'
import sportsService from '../../../services/sports.service'

export const getSportListAction = createAsyncThunk(
  'sport/list',
  async (data, { rejectWithValue }) => {
    return sportsService
      .getSports()
      .then((res) => {
        return res.data.data
      })
      .catch((e) => {
        return rejectWithValue(e.response.data.message)
      })
  },
)

export const getMatchListAction = createAsyncThunk(
  'sport/matches',
  async (status: string | undefined, { rejectWithValue }) => {
    return sportsService
      .getMatchList('', status || 'all')
      .then((res) => {
        return res.data.data
      })
      .catch((e) => {
        return rejectWithValue(e.response?.data?.message || e.message)
      })
  },
)


