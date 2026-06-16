import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

type TIngredientState = {
  ingredients: TIngredient[];
  currentIngredient: TIngredient | null;
  isIngredientsLoading: boolean;
  error: string | null;
};

const initialState: TIngredientState = {
  ingredients: [],
  currentIngredient: null,
  isIngredientsLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',

  async (_, thunkAPI) => {
    try {
      const data = await getIngredientsApi();

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка загрузки ингредиентов');
    }
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',

  initialState,

  reducers: {
    //закрыть ингридиент
    clearCurrentIngredient: (state) => {
      state.currentIngredient = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isIngredientsLoading = false;
          state.ingredients = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error =
          (action.payload as string) || 'Ошибка загрузки ингридиентов';
      });
  }
});

export const { clearCurrentIngredient } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
