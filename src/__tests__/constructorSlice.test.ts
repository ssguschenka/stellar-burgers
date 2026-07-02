import { expect, test, describe, jest } from '@jest/globals';
import reducer, {
  initialState,
  moveUp,
  moveDown,
  setBun,
  addIngredient,
  removeIngredients,
  clearModal,
  createOrderThunk
} from '../services/slices/constructorSlice';
import * as api from '@api';
import { store } from '../services/store';

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

const sortedIngredientsMoveDown = [
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
  },
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
  }
];

const bunMock = {
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
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('тесты для слайса конструктора', () => {
  describe('тесты редьюсеров', () => {
    test('тест редьюсера moveDown', () => {
      const initialStateMock = {
        ...initialState,
        ingredients: mockIngredients
      };

      const action = moveDown(0);

      const newState = reducer(initialStateMock, action);

      expect(newState.ingredients).toEqual(sortedIngredientsMoveDown);
    });

    test('тест редьюсера moveUp', () => {
      const initialStateMock = {
        ...initialState,
        ingredients: sortedIngredientsMoveDown
      };

      const action = moveUp(1);
      const newState = reducer(initialStateMock, action);

      expect(newState.ingredients).toEqual(mockIngredients);
    });

    test('тест редьюсера setBun', () => {
      const initialStateMock = {
        ...initialState,
        ingredients: mockIngredients
      };

      const action = setBun(bunMock);
      const newState = reducer(initialStateMock, action);
      expect(newState.bun).toEqual(bunMock);
    });

    test('тест редьюсера addIngredient', () => {
      const initialStateMock = {
        ...initialState,
        ingredients: mockIngredients
      };

      const action = addIngredient(bunMock);
      const newState = reducer(initialStateMock, action);

      expect(newState.ingredients).toHaveLength(mockIngredients.length + 1);
    });

    test('тест редьюсера removeIngredients', () => {
      const initialStateMock = {
        ...initialState,
        ingredients: mockIngredients
      };

      const action = addIngredient(bunMock);
      const newState = reducer(initialStateMock, action);

      const stateAfterRemove = reducer(newState, removeIngredients('2'));

      expect(stateAfterRemove.ingredients).toEqual(mockIngredients);
    });

    test('тест редьюсера clearModal', () => {
      const initialStateMock = {
        ...initialState,
        orderModalData: {
          _id: '123',
          status: 'done',
          name: 'Тестовый заказ',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          ingredients: [],
          number: 12345
        }
      };

      const action = clearModal();
      const newState = reducer(initialStateMock, action);

      expect(newState.orderModalData).toBeNull();
    });

    test('должен вернуть initialState для неизвестного экшена', () => {
      expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
    });
  });

  describe('тесты асинхронных экшенов', () => {
    test('тест для асинхронного экшена createOrderThunk fulfilled', async () => {
      const orderModalData = {
        _id: '123',
        status: 'done',
        name: 'Тестовый заказ',
        createdAt: '2026-07-01',
        updatedAt: '2026-07-01',
        owner: {
          name: 'Иван',
          email: 'ivan@test.ru',
          createdAt: '2026-07-01',
          updatedAt: '2026-07-01'
        },
        number: 12345,
        price: 1000
      };

      const action = {
        type: createOrderThunk.fulfilled.type,
        payload: orderModalData
      };

      const state = reducer(initialState, action);
      
      expect(state.orderModalData?.number).toBe(action.payload.number);
      expect(state.ingredients).toEqual([]);
      expect(state.bun).toBeNull();
      expect(state.orderRequest).toBe(false);
    });

    test('тест для асинхронного экшена createOrderThunk rejected', async () => {
      const action = {type: createOrderThunk.rejected.type}
      const state = reducer(initialState, action);

      expect(state.orderRequest).toBe(false);

    });

    test('тест для асинхронного экшена createOrderThunk pending', async () => {
      const action = { type: createOrderThunk.pending.type };
      const state = reducer(initialState, action);

      expect(state.orderRequest).toBe(true);
    });
  });
});
