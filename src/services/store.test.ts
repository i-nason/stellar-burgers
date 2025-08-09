import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import feedReducer from './slices/feedSlice';
import userReducer from './slices/userSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';
import store, { RootState } from './store';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  user: userReducer,
  profileOrders: profileOrdersReducer
});

describe('Store initialization', () => {
  describe('rootReducer', () => {
    test('should return correct initial state when called with undefined state and unknown action', () => {
      const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

      expect(initialState).toEqual({
        ingredients: {
          ingredients: [],
          isLoading: false,
          error: null
        },
        burgerConstructor: {
          bun: null,
          ingredients: [],
          orderRequest: false,
          orderModalData: null,
          orderError: null
        },
        feed: {
          orders: [],
          isLoading: false,
          error: null,
          total: 0,
          totalToday: 0,
          currentOrder: null,
          currentOrderLoading: false,
          currentOrderError: null
        },
        user: {
          user: null,
          isLoading: false,
          error: null
        },
        profileOrders: {
          orders: [],
          isLoading: false,
          error: null
        }
      });
    });

    test('should initialize with correct structure and initial states', () => {
      const initialState = rootReducer(undefined, { type: '@@INIT' });

      expect(initialState).toHaveProperty('ingredients');
      expect(initialState).toHaveProperty('burgerConstructor');
      expect(initialState).toHaveProperty('feed');
      expect(initialState).toHaveProperty('user');
      expect(initialState).toHaveProperty('profileOrders');
    });

    test('should initialize ingredients slice with correct initial state', () => {
      const initialState = rootReducer(undefined, { type: '@@INIT' });

      expect(initialState.ingredients).toEqual({
        ingredients: [],
        isLoading: false,
        error: null
      });
    });

    test('should initialize burgerConstructor slice with correct initial state', () => {
      const initialState = rootReducer(undefined, { type: '@@INIT' });

      expect(initialState.burgerConstructor).toEqual({
        bun: null,
        ingredients: [],
        orderRequest: false,
        orderModalData: null,
        orderError: null
      });
    });

    test('should initialize feed slice with correct initial state', () => {
      const initialState = rootReducer(undefined, { type: '@@INIT' });

      expect(initialState.feed).toEqual({
        orders: [],
        isLoading: false,
        error: null,
        total: 0,
        totalToday: 0,
        currentOrder: null,
        currentOrderLoading: false,
        currentOrderError: null
      });
    });

    test('should initialize user slice with correct initial state', () => {
      const initialState = rootReducer(undefined, { type: '@@INIT' });

      expect(initialState.user).toEqual({
        user: null,
        isLoading: false,
        error: null
      });
    });

    test('should initialize profileOrders slice with correct initial state', () => {
      const initialState = rootReducer(undefined, { type: '@@INIT' });

      expect(initialState.profileOrders).toEqual({
        orders: [],
        isLoading: false,
        error: null
      });
    });
  });

  describe('Store initialization', () => {
    test('should create store with correct initial state', () => {
      const state = store.getState();

      expect(state).toHaveProperty('ingredients');
      expect(state).toHaveProperty('burgerConstructor');
      expect(state).toHaveProperty('feed');
      expect(state).toHaveProperty('user');
      expect(state).toHaveProperty('profileOrders');

      expect(typeof state.ingredients.isLoading).toBe('boolean');
      expect(Array.isArray(state.ingredients.ingredients)).toBe(true);
      expect(Array.isArray(state.burgerConstructor.ingredients)).toBe(true);
      expect(Array.isArray(state.feed.orders)).toBe(true);
      expect(Array.isArray(state.profileOrders.orders)).toBe(true);
    });

    test('should have proper type structure for RootState', () => {
      const state: RootState = store.getState();

      expect(state.ingredients.ingredients).toEqual([]);
      expect(state.burgerConstructor.bun).toBeNull();
      expect(state.feed.total).toBe(0);
      expect(state.user.user).toBeNull();
      expect(state.profileOrders.orders).toEqual([]);
    });
  });
});
