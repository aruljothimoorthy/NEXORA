import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  checkDeadlinesRequest,
  listNotificationsRequest,
  markAllNotificationsReadRequest,
  markNotificationReadRequest,
} from '../../services/notificationService'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await listNotificationsRequest()
      return data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load notifications',
      )
    }
  },
)

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id, { rejectWithValue }) => {
    try {
      await markNotificationReadRequest(id)
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update notification',
      )
    }
  },
)

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      await markAllNotificationsReadRequest()
      return true
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update notifications',
      )
    }
  },
)

export const checkDeadlineReminders = createAsyncThunk(
  'notifications/checkDeadlines',
  async (_, { dispatch }) => {
    try {
      await checkDeadlinesRequest()
      await dispatch(fetchNotifications())
    } catch {
      // Non-blocking
    }
  },
)

const initialState = {
  items: [],
  unreadCount: 0,
  status: 'idle',
  error: null,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    pushNotification(state, action) {
      state.items.unshift(action.payload)
      state.unreadCount += 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.notifications
        state.unreadCount = action.payload.unreadCount
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const item = state.items.find((n) => n.id === action.payload)
        if (item && !item.read) {
          item.read = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, read: true }))
        state.unreadCount = 0
      })
  },
})

export const { pushNotification } = notificationsSlice.actions
export const selectNotifications = (state) => state.notifications
export default notificationsSlice.reducer
