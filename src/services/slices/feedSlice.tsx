import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type TFeedsResponse = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

type TFeedState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  total: number;
  totalToday: number;
  isFeedLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  currentOrder: null,
  total: 0,
  totalToday: 0,
  isFeedLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<TFeedsResponse>(
  'feeds/fetchFeeds',

  async (_, thunkAPI) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка загрузки заказов');
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'feed/fetchOrderByNumber',
  async (number: number, thunkAPI) => {
    try {
      const data = await getOrderByNumberApi(number);
      return data.orders[0];
    } catch {
      return thunkAPI.rejectWithValue('Щшибка загрузки заказа');
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',

  initialState,

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isFeedLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.isFeedLoading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки заказов';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isFeedLoading = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки заказа';
      });
  }
});

export default feedSlice.reducer;
