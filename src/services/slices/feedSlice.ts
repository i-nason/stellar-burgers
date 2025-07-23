import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';

export type FeedState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
  currentOrder: TOrder | null;
  currentOrderLoading: boolean;
  currentOrderError: string | null;
};

const initialState: FeedState = {
  orders: [],
  isLoading: false,
  error: null,
  total: 0,
  totalToday: 0,
  currentOrder: null,
  currentOrderLoading: false,
  currentOrderError: null
};

export const fetchFeeds = createAsyncThunk<TFeedsResponse>(
  'feed/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки заказов');
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, string>(
  'feed/fetchOrderByNumber',
  async (number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(Number(number));
      if (data && data.orders && data.orders.length > 0) {
        return data.orders[0];
      }
      return rejectWithValue('Заказ не найден');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки заказа');
    }
  }
);

type TFeedsResponse = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true;
        state.currentOrderError = null;
        state.currentOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrderError = action.payload as string;
        state.currentOrder = null;
      });
  }
});

export default feedSlice.reducer;
