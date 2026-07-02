import { expect, test, describe, jest } from '@jest/globals';
import reducer, {
  initialState,
  clearCurrentIngredient,
  fetchIngredients
} from '../services/slices/ingredientsSlice';

const mockIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    id: '1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0945',
    id: '3',
    name: 'Соус с шипами Антарианского плоскоходца',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  }
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('тесты для слайса ингредиентов', () => {
  describe('тесты редьюсеров', () => {
    test('тест редьюсера clearCurrentIngredient', () => {
      const initialStateMock = {
        ...initialState,
        ingredients: mockIngredients,
        currentIngredient: {
          _id: '643d69a5c3f7b9001cfa093c',
          id: '2',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
        }
      };

      const action = clearCurrentIngredient();

      const newState = reducer(initialStateMock, action);

      expect(newState.currentIngredient).toBeNull();
    });

    test('должен вернуть initialState для неизвестного экшена', () => {
      expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
    });
  });

  describe('тесты асинхронных экшенов', () => {
    test('тест для асинхронного экшена fetchIngredients fulfilled', async () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = reducer(initialState, action);

      expect(state.isIngredientsLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
    });

    test('тест для асинхронного экшена fetchIngredients rejected', async () => {
      const action = { type: fetchIngredients.rejected.type };
      const state = reducer(initialState, action);

      expect(state.isIngredientsLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ингридиентов');
    });

    test('тест для асинхронного экшена fetchIngredients pending', async () => {
      const action = { type: fetchIngredients.pending.type };
      const state = reducer(initialState, action);

      expect(state.isIngredientsLoading).toBe(true);
      expect(state.error).toBe(null);
    });
  });
});
