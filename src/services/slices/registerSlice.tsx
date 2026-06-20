import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUserApi, TRegisterData } from '@api';
import { TUser } from '@utils-types';
import { setCookie } from '../../utils/cookie';

type TRegisterState = {
  isRegisterLoading: boolean;
  error: string | null;
};

const initialState: TRegisterState = {
  isRegisterLoading: false,
  error: null
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response;
  }
);

export const registerserSlice = createSlice({
  name: 'registerUser',

  initialState,

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isRegisterLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isRegisterLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegisterLoading = false;
        state.error = (action.payload as string) || 'Ошибка регистрации';
      });
  }
});

export default registerserSlice.reducer;
