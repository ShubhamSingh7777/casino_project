import { RootState } from '../../store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { loginAction, getUserInfoAction,loginUserAction,getContact, getContactFixed} from './login.action'
import User, { RoleType } from '../../../models/User'

export type UserState = {
  userData: { user: User; status: string; error: any;isAuthenticated: boolean}
  welcome: { status: boolean },
  contact: {whatsapp:string,telegram:string},
  contactFixed: {whatsapp:string,telegram:string}
}

const initialState: UserState = {
  userData: {
    user: { _id: '', username: '' },
    status: '',
    error: '',
    isAuthenticated: false,
  },
  welcome: { status: false },
  contact:{whatsapp:'',telegram:''},
  contactFixed:{whatsapp:'',telegram:''}
}


const loginSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    restoreAuth: (state) => {
     state.userData.isAuthenticated = true
    },
    userUpdate: (state, action: PayloadAction<User>) => {
      console.log(action.payload,'data')
      localStorage.setItem('login-session', action.payload.sessionId)
      state.userData.user = action.payload
    },
    updateMessage: (state, action: PayloadAction<any>) => {
      state.welcome = action.payload
    },
    logout: (state) => {
      state.userData = initialState.userData
      if (window.location.pathname.includes('admin')) {
        localStorage.removeItem('token-admin')
        localStorage.removeItem('refreshToken-admin')
        localStorage.removeItem('userType-admin')
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userType')
         localStorage.removeItem('isAuthenticated')
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.pending, (state) => {
        state.userData.status = 'loading'
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        //state.userData.user = action.payload.data
        state.userData.error = ''
        state.userData.status = 'done'
         state.userData.isAuthenticated = true 
        localStorage.setItem('isAuthenticated', 'true')
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.userData.error = action.payload
        state.userData.status = 'failed'
      })
       .addCase(loginUserAction.pending, (state) => {
        state.userData.status = 'loading'
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        //state.userData.user = action.payload.data
        state.userData.error = ''
        state.userData.status = 'done'
        state.userData.isAuthenticated = true
        localStorage.setItem('isAuthenticated', 'true')
      })
      .addCase(loginUserAction.rejected, (state, action) => {
        state.userData.error = action.payload
        state.userData.status = 'failed'
      })
      .addCase(getUserInfoAction.fulfilled, (state, action) => {
        const user = action.payload?.data?.user
        // a response without a user (e.g. no session) must not crash the store
        if (!user) return
        if (user.role === RoleType.user) localStorage.setItem('userType', user.role)
        else localStorage.setItem('userType-admin', user.role)
        state.userData.user = user
        state.userData.error = ''
        state.userData.status = 'done'
      })
      .addCase(getContact.fulfilled, (state, action) => {
        state.contact = action.payload.data
      })
       .addCase(getContactFixed.fulfilled, (state, action) => {
        state.contactFixed = action.payload.data
      })
  },
})

export const { logout, userUpdate, updateMessage,restoreAuth } = loginSlice.actions

export const selectSinglePost = (state: RootState) => state.userReducer.userData

export const selectUserData = (state: RootState) => state.userReducer.userData

export const selectUserContact = (state: RootState) => state.userReducer.contact

export const selectUserContactFixed = (state: RootState) => state.userReducer.contactFixed

export const selectWelcomeMessage = (state: RootState) => state.userReducer.welcome

export default loginSlice
