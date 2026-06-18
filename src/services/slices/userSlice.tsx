import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserApi, updateUserApi, TRegisterData, logoutApi } from '@api';
import { TUser } from '@utils-types';
import { deleteCookie } from '../../utils/cookie';

type TUSerState = {
  user: TUser;
  isUserLoading: boolean;
  error: string | null;
};

const initialState: TUSerState = {
  user: {
    name: '',
    email: ''
  },
  isUserLoading: false,
  error: null
};

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

export const userSlice = createSlice({
  name: 'user',

  initialState,

  reducers: {
    // userLogout: (state) => {
    //   state.user = {
    //     name: '',
    //     email: ''
    //   };
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isUserLoading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error =
          (action.payload as string) || 'Ошибка загрузки пользователя';
      })
      .addCase(updateUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error =
          (action.payload as string) || 'Не получилось обовить данные';
      });
  }
});

// export const { userLogout } = userSlice.actions;

export default userSlice.reducer;

// export const logoutUser = createAsyncThunk(
//   'user/logoutUser',
//   (_, { dispatch }) => {
//     logoutApi()
//       .then(() => {
//         localStorage.clear();
//         deleteCookie('accessToken');
//         dispatch(userLogout());
//       })
//       .catch(() => {
//         console.log('Ошибка выполнения выхода');
//       });
//   }
// );
