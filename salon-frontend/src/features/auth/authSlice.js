import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../api/auth.api';
import { readStoredAuth, writeStoredAuth } from '../../api/axiosClient';

const stored = readStoredAuth();

const initialState = {
  token: stored?.token || null,
  user: stored?.user || null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    return await authApi.login(payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    return await authApi.register(payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await authApi.getMe();
    return res.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateMyProfile = createAsyncThunk('auth/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.updateProfile(payload);
    return res.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedOut(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      writeStoredAuth(null);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        writeStoredAuth({ token: action.payload.token, user: action.payload.user });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to sign in';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        writeStoredAuth({ token: action.payload.token, user: action.payload.user });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to create account';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        writeStoredAuth({ token: state.token, user: state.user });
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.token = null;
        state.user = null;
        writeStoredAuth(null);
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        writeStoredAuth({ token: state.token, user: state.user });
      });
  },
});

export const { loggedOut, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
