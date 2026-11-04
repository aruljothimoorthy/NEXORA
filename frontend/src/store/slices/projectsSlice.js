import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createProjectRequest,
  deleteProjectRequest,
  getProjectRequest,
  listProjectsRequest,
  updateProjectRequest,
} from '../../services/projectService'

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await listProjectsRequest(params)
      return data.data.projects
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load projects')
    }
  },
)

export const fetchProjectDetails = createAsyncThunk(
  'projects/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await getProjectRequest(id)
      return data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load project')
    }
  },
)

export const createProject = createAsyncThunk(
  'projects/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await createProjectRequest(payload)
      return data.data.project
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project')
    }
  },
)

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await updateProjectRequest(id, payload)
      return data.data.project
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project')
    }
  },
)

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteProjectRequest(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project')
    }
  },
)

const initialState = {
  items: [],
  current: null,
  taskStats: null,
  recentActivities: [],
  recentTasks: [],
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
  },
  status: 'idle',
  detailStatus: 'idle',
  mutationStatus: 'idle',
  error: null,
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjectFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearProjectError(state) {
      state.error = null
    },
    clearCurrentProject(state) {
      state.current = null
      state.taskStats = null
      state.recentActivities = []
      state.recentTasks = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchProjectDetails.pending, (state) => {
        state.detailStatus = 'loading'
        state.error = null
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded'
        state.current = action.payload.project
        state.taskStats = action.payload.taskStats
        state.recentActivities = action.payload.recentActivities
        state.recentTasks = action.payload.recentTasks
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.detailStatus = 'failed'
        state.error = action.payload
      })
      .addCase(createProject.pending, (state) => {
        state.mutationStatus = 'loading'
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items.unshift(action.payload)
      })
      .addCase(createProject.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items = state.items.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        )
        if (state.current?.id === action.payload.id) {
          state.current = action.payload
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload)
        if (state.current?.id === action.payload) {
          state.current = null
        }
      })
  },
})

export const { setProjectFilters, clearProjectError, clearCurrentProject } =
  projectsSlice.actions
export const selectProjects = (state) => state.projects
export default projectsSlice.reducer
