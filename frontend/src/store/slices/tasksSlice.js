import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createTaskRequest,
  deleteTaskRequest,
  listTasksRequest,
  moveTaskRequest,
  updateTaskRequest,
} from '../../services/taskService'

const emptyBoard = () => ({
  todo: [],
  in_progress: [],
  review: [],
  completed: [],
})

export const fetchBoard = createAsyncThunk(
  'tasks/fetchBoard',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await listTasksRequest(projectId)
      return data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load board')
    }
  },
)

export const createTask = createAsyncThunk(
  'tasks/create',
  async ({ projectId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await createTaskRequest(projectId, payload)
      return data.data.task
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task')
    }
  },
)

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await updateTaskRequest(id, payload)
      return data.data.task
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task')
    }
  },
)

export const moveTask = createAsyncThunk(
  'tasks/move',
  async ({ id, status, order }, { rejectWithValue }) => {
    try {
      const { data } = await moveTaskRequest(id, { status, order })
      return data.data.task
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to move task')
    }
  },
)

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTaskRequest(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task')
    }
  },
)

const rebuildBoard = (tasks) => {
  const board = emptyBoard()
  tasks.forEach((task) => {
    if (board[task.status]) {
      board[task.status].push(task)
    }
  })
  Object.keys(board).forEach((key) => {
    board[key].sort((a, b) => a.order - b.order)
  })
  return board
}

const initialState = {
  tasks: [],
  board: emptyBoard(),
  projectId: null,
  status: 'idle',
  error: null,
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    optimisticMove(state, action) {
      const { id, status, order } = action.payload
      const task = state.tasks.find((t) => t.id === id)
      if (!task) return
      task.status = status
      task.order = order
      state.board = rebuildBoard(state.tasks)
    },
    clearTasks(state) {
      state.tasks = []
      state.board = emptyBoard()
      state.projectId = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.tasks = action.payload.tasks
        state.board = action.payload.board
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload)
        state.board = rebuildBoard(state.tasks)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        )
        state.board = rebuildBoard(state.tasks)
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        )
        state.board = rebuildBoard(state.tasks)
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload)
        state.board = rebuildBoard(state.tasks)
      })
  },
})

export const { optimisticMove, clearTasks } = tasksSlice.actions
export const selectTasks = (state) => state.tasks
export default tasksSlice.reducer
