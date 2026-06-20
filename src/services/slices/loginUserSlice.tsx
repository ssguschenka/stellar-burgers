import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUserApi, TLoginData } from '@api';
import { setCookie } from '../../utils/cookie';

type TLoginState = {
  isLoginLoading: boolean;
  error: string | null;
};

const initialState: TLoginState = {
  isLoginLoading: false,
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

export const loginUserSlice = createSlice({
  name: 'loginUser',

  initialState,

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoginLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoginLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.error = (action.payload as string) || 'Ошибка входа';
      });
  }
});

export default loginUserSlice.reducer;
