import { createAsyncThunk } from '@reduxjs/toolkit'
import User from '../../../models/User'
import authService from '../../../services/auth.service'
import { updateMessage, userUpdate } from './loginSlice'
import { setInitApp } from '../common/commonSlice'

export const loginAction = createAsyncThunk(
  'user/login',
  async (user: User, { rejectWithValue, dispatch }) => {
    const successCallback = (res: any) => {
      dispatch(userUpdate(res.data.data))
      dispatch(updateMessage({ status: true }))
       dispatch(setInitApp(false))
      dispatch(getUserInfoAction({} as User))
      return res.data
    }
    if (user.admin) {
      return authService
        .loginAdmin(user)
        .then(successCallback)
        .catch((e) => {
          return rejectWithValue(e.response.data.message)
        })
    }
    return authService
      .login(user)
      .then(successCallback)
      .catch((e) => {
        return rejectWithValue(e.response.data.message)
      })
  },
)

export const loginUserAction = createAsyncThunk(
  'api/user-register',
  async (user: User, { rejectWithValue, dispatch }) => {
    const successCallback = (res: any) => {
      console.log(res.data.data,'at login user')
      dispatch(userUpdate(res.data.data))
      dispatch(updateMessage({ status: true }))
      dispatch(getUserInfoAction({} as User))
      return res.data
    }
    // if (user.admin) {
    //   return authService
    //     .loginAdmin(user)
    //     .then(successCallback)
    //     .catch((e) => {
    //       return rejectWithValue(e.response.data.message)
    //     })
    // }
    return authService
      .registerUser(user)
      .then(successCallback)
      .catch((e) => {
        return rejectWithValue(e.response.data.message)
      })
  },
)

export const getUserInfoAction = createAsyncThunk(
  'user/user-info',
  async (user: User, { rejectWithValue }) => {
    if (authService.getRefreshToken()) {
      return authService
        .getUser()
        .then((res: any) => res.data)
        .catch((e: any) => {
          return rejectWithValue(e.response.data.message)
        })
    }
    return rejectWithValue('Token not exist')
  },
)

export const getContact = createAsyncThunk(
  'get-Usercontact',
  async (_, { rejectWithValue }) => {
    if (authService.getRefreshToken()) {
      return authService
        .getUserContact()
        .then((res: any) => {
          console.log("GET CONTACT API RESPONSE:", res.data);
          return res.data;
        })
        .catch((e: any) => {
          console.log("GET CONTACT ERROR:", e.response?.data);
          return rejectWithValue(e.response?.data?.message);
        });
    }

    console.log("No refresh token");
    return rejectWithValue('Token not exist');
  },
);

export const getContactFixed = createAsyncThunk(
  'get-UsercontactFixed',
  async (_, { rejectWithValue }) => {
    return authService
      .getUserContactFixed()
      .then((res: any) => {
        console.log("GET CONTACT FIXED API RESPONSE:", res.data);
        return res.data;
      })
      .catch((e: any) => {
        console.log("GET CONTACT FIXED ERROR:", e.response?.data);
        return rejectWithValue(e.response?.data?.message);
      });
  },
);