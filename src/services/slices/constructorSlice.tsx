import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

type TConstructorIngredientState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

export const initialState: TConstructorIngredientState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

export const createOrderThunk = createAsyncThunk(
  'constructor/createOrder',

  async (ingredients: string[], thunkAPI) => {
    try {
      const data = await orderBurgerApi(ingredients);

      return data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка создания заказа');
    }
  }
);

export const constructorSlice = createSlice({
  name: 'constructor',

  initialState,

  reducers: {
    setBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.ingredients.push(action.payload);
    },
    removeIngredients(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveUp(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index <= 0) return;
      const item = state.ingredients[index];
      state.ingredients[index] = state.ingredients[index - 1];
      state.ingredients[index - 1] = item;
    },
    moveDown(state, action: PayloadAction<number>) {
      const index = action.payload;

      if (index >= state.ingredients.length - 1) return;

      const item = state.ingredients[index];

      state.ingredients[index] = state.ingredients[index + 1];
      state.ingredients[index + 1] = item;
    },
    clearModal(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = {
          _id: '',
          status: '',
          name: '',
          createdAt: '',
          updatedAt: '',
          ingredients: [],
          number: action.payload.number
        };
        state.ingredients = [];
        state.bun = null;
      })
      .addCase(createOrderThunk.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});
export const {
  removeIngredients,
  setBun,
  addIngredient,
  moveUp,
  moveDown,
  clearModal
} = constructorSlice.actions;

export default constructorSlice.reducer;
