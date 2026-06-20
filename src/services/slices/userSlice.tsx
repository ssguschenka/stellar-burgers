import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  updateUserApi,
  TRegisterData,
  logoutApi,
  loginUserApi,
  TLoginData,
  forgotPasswordApi
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TUSerState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isUserLoading: boolean;
  error: string | null;
};

const initialState: TUSerState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  isUserLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();

  localStorage.clear();
  deleteCookie('accessToken');
});

export const userSlice = createSlice({
  name: 'user',

  initialState,

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isUserLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = (action.payload as string) || 'Ошибка входа';
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(getUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isUserLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error =
          (action.payload as string) || 'Не получилось обовить данные';
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isUserLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = (action.payload as string) || 'Не получилось выйти';
      });
  }
});

export default userSlice.reducer;
