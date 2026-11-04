import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getMeRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
} from '../../services/authService'
import {
  changePasswordRequest,
  deactivateAccountRequest,
  updateProfileRequest,
  updateSettingsRequest,
} from '../../services/userService'

const TOKEN_KEY = 'nexora_token'

const persistToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await registerRequest(payload)
      return data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed. Please try again.',
      )
    }
  },
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await loginRequest(payload)
      return data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.',
      )
    }
  },
)

export const fetchCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getMeRequest()
      return data.data.user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Session expired. Please log in again.',
      )
    }
  },
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await logoutRequest()
  } catch {
    // Clear local session even if API logout fails
  }
})

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await updateProfileRequest(payload)
      return data.data.user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile',
      )
    }
  },
)

export const updateSettings = createAsyncThunk(
  'auth/updateSettings',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await updateSettingsRequest(payload)
      return data.data.user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update settings',
      )
    }
  },
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await changePasswordRequest(payload)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to change password',
      )
    }
  },
)

export const deactivateAccount = createAsyncThunk(
  'auth/deactivate',
  async (payload, { rejectWithValue }) => {
    try {
      await deactivateAccountRequest(payload)
      return true
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to deactivate account',
      )
    }
  },
)

const initialState = {
  user: null,
  token: localStorage.getItem(TOKEN_KEY),
  status: 'idle',
  error: null,
  initialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
    markAuthInitialized(state) {
      state.initialized = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.initialized = true
        persistToken(action.payload.token)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.initialized = true
        persistToken(action.payload.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        state.initialized = true
        state.error = null
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = 'idle'
        state.user = null
        state.token = null
        state.initialized = true
        persistToken(null)
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.status = 'idle'
        state.error = null
        state.initialized = true
        persistToken(null)
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.status = 'idle'
        persistToken(null)
      })
      .addCase(deactivateAccount.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.status = 'idle'
        persistToken(null)
      })
  },
})

export const { clearAuthError, markAuthInitialized } = authSlice.actions
export const selectAuth = (state) => state.auth
export const selectIsAuthenticated = (state) => Boolean(state.auth.user)
export default authSlice.reducer
