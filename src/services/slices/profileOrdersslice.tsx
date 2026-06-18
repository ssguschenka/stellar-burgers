import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TProfileOrdersState = {
  orders: TOrder[];
  isProfileOrdersLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isProfileOrdersLoading: false,
  error: null
};

export const fetchOrders = createAsyncThunk<TOrder[]>(
  'profileOrders/fetchProfileOrders',

  async (_, thunkAPI) => {
    try {
      const data = await getOrdersApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка загрузки Ваших заказов');
    }
  }
);

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',

  initialState,

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isProfileOrdersLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isProfileOrdersLoading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isProfileOrdersLoading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки заказов';
      });
  }
});

export default profileOrdersSlice.reducer;
