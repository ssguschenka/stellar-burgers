import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

type TFeedsResponse = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isFeedLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
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
        state.error = (action.payload as string) || 'Ошибка закгрузки заказов';
      });
  }
});

export default feedSlice.reducer;
