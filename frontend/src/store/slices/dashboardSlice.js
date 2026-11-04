import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getDashboardRequest,
  seedDemoDashboardRequest,
} from '../../services/dashboardService'

const emptyStats = {
  totalProjects: 0,
  activeProjects: 0,
  completedTasks: 0,
  pendingTasks: 0,
}

export const fetchDashboard = createAsyncThunk(
  'dashboard/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getDashboardRequest()
      return data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load dashboard',
      )
    }
  },
)

export const seedDemoDashboard = createAsyncThunk(
  'dashboard/seedDemo',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await seedDemoDashboardRequest()
      await dispatch(fetchDashboard())
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to seed demo data',
      )
    }
  },
)

const initialState = {
  stats: emptyStats,
  productivityChart: [],
  projectProgress: [],
  upcomingDeadlines: [],
  recentActivities: [],
  status: 'idle',
  seedStatus: 'idle',
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.stats = action.payload.stats || emptyStats
        state.productivityChart = action.payload.productivityChart || []
        state.projectProgress = action.payload.projectProgress || []
        state.upcomingDeadlines = action.payload.upcomingDeadlines || []
        state.recentActivities = action.payload.recentActivities || []
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(seedDemoDashboard.pending, (state) => {
        state.seedStatus = 'loading'
      })
      .addCase(seedDemoDashboard.fulfilled, (state) => {
        state.seedStatus = 'succeeded'
      })
      .addCase(seedDemoDashboard.rejected, (state, action) => {
        state.seedStatus = 'failed'
        state.error = action.payload
      })
  },
})

export const { clearDashboardError } = dashboardSlice.actions
export const selectDashboard = (state) => state.dashboard
export default dashboardSlice.reducer
