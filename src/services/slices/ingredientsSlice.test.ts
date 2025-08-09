import ingredientsReducer, { fetchIngredients, IngredientsState } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';


const mockIngredients: TIngredient[] = [
  {
    _id: '60666c42cc7b410027a1a9b1',
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
  },
  {
    _id: '60666c42cc7b410027a1a9b5',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  },
  {
    _id: '60666c42cc7b410027a1a9b6',
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

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

describe('ingredientsSlice', () => {
  describe('initial state', () => {
    test('should return the initial state', () => {
      expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('fetchIngredients async actions', () => {
    test('should set isLoading to true when fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    test('should set isLoading to true and clear error when fetchIngredients.pending with existing error', () => {
      const stateWithError: IngredientsState = {
        ingredients: [],
        isLoading: false,
        error: 'Previous error'
      };

      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    test('should set isLoading to false and populate ingredients when fetchIngredients.fulfilled', () => {
      const stateWithLoading: IngredientsState = {
        ingredients: [],
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };

      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredients).toHaveLength(3);
    });

    test('should replace existing ingredients when fetchIngredients.fulfilled', () => {
      const stateWithIngredients: IngredientsState = {
        ingredients: [mockIngredients[0]],
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };

      const state = ingredientsReducer(stateWithIngredients, action);

      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredients).toHaveLength(3);
    });

    test('should set isLoading to false and set error when fetchIngredients.rejected', () => {
      const stateWithLoading: IngredientsState = {
        ingredients: mockIngredients,
        isLoading: true,
        error: null
      };

      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngredients.rejected.type,
        payload: errorMessage
      };

      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual(mockIngredients);
    });

    test('should handle fetchIngredients.rejected without payload', () => {
      const stateWithLoading: IngredientsState = {
        ingredients: [],
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.rejected.type,
        payload: undefined
      };

      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeUndefined();
      expect(state.ingredients).toEqual([]);
    });
  });

  describe('state transitions', () => {
    test('should handle complete fetch cycle: pending -> fulfilled', () => {
      let state = initialState;

      const pendingAction = { type: fetchIngredients.pending.type };
      state = ingredientsReducer(state, pendingAction);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();

      const fulfilledAction = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      state = ingredientsReducer(state, fulfilledAction);
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    test('should handle complete fetch cycle: pending -> rejected', () => {
      let state = initialState;

      const pendingAction = { type: fetchIngredients.pending.type };
      state = ingredientsReducer(state, pendingAction);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();

      const errorMessage = 'Network error';
      const rejectedAction = {
        type: fetchIngredients.rejected.type,
        payload: errorMessage
      };
      state = ingredientsReducer(state, rejectedAction);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual([]);
    });

    test('should handle retry after error', () => {
      const stateWithError: IngredientsState = {
        ingredients: [],
        isLoading: false,
        error: 'Previous network error'
      };

      const pendingAction = { type: fetchIngredients.pending.type };
      let state = ingredientsReducer(stateWithError, pendingAction);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();

      const fulfilledAction = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      state = ingredientsReducer(state, fulfilledAction);
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });
  });
});
