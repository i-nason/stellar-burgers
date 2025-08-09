import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  clearOrderModalData,
  orderBurger,
  burgerConstructorSlice
} from './burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '../../utils/types';

type BurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: any;
  orderError: string | null;
};

const mockBun: TIngredient = {
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
};

const mockSauce: TIngredient = {
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
};

const mockMain: TIngredient = {
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
};

const mockMain2: TIngredient = {
  _id: '60666c42cc7b410027a1a9b7',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'https://code.s3.yandex.net/react/code/meat-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png'
};

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  orderError: null
};

describe('burgerConstructorSlice', () => {
  describe('initial state', () => {
    test('should return the initial state', () => {
      expect(burgerConstructorReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('addIngredient action', () => {
    test('should add bun ingredient and replace existing bun', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );

      expect(state.bun).toEqual(
        expect.objectContaining({
          ...mockBun,
          id: expect.any(String)
        })
      );
      expect(state.ingredients).toEqual([]);

      const newBun: TIngredient = {
        ...mockBun,
        _id: 'new-bun-id',
        name: 'Новая булка'
      };
      const stateWithNewBun = burgerConstructorReducer(
        state,
        addIngredient(newBun)
      );

      expect(stateWithNewBun.bun?.name).toBe('Новая булка');
      expect(stateWithNewBun.bun?._id).toBe('new-bun-id');
    });

    test('should add non-bun ingredient to ingredients array', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockSauce)
      );

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(
        expect.objectContaining({
          ...mockSauce,
          id: expect.any(String)
        })
      );
    });

    test('should add multiple ingredients to array', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockSauce)
      );
      state = burgerConstructorReducer(state, addIngredient(mockMain));
      state = burgerConstructorReducer(state, addIngredient(mockMain2));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0].name).toBe(mockSauce.name);
      expect(state.ingredients[1].name).toBe(mockMain.name);
      expect(state.ingredients[2].name).toBe(mockMain2.name);
    });

    test('should generate unique id for each ingredient', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockSauce)
      );
      state = burgerConstructorReducer(state, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
      expect(state.ingredients[0]._id).toBe(state.ingredients[1]._id);
    });
  });

  describe('removeIngredient action', () => {
    test('should remove ingredient by id', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockSauce)
      );
      state = burgerConstructorReducer(state, addIngredient(mockMain));
      state = burgerConstructorReducer(state, addIngredient(mockMain2));

      const ingredientToRemove = state.ingredients[1];
      const newState = burgerConstructorReducer(
        state,
        removeIngredient(ingredientToRemove.id)
      );

      expect(newState.ingredients).toHaveLength(2);
      expect(
        newState.ingredients.find((item) => item.id === ingredientToRemove.id)
      ).toBeUndefined();
      expect(newState.ingredients[0].name).toBe(mockSauce.name);
      expect(newState.ingredients[1].name).toBe(mockMain2.name);
    });

    test('should not change state when removing non-existent ingredient', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockSauce)
      );
      const newState = burgerConstructorReducer(
        state,
        removeIngredient('non-existent-id')
      );

      expect(newState.ingredients).toEqual(state.ingredients);
    });

    test('should handle removing from empty ingredients array', () => {
      const newState = burgerConstructorReducer(
        initialState,
        removeIngredient('any-id')
      );

      expect(newState.ingredients).toEqual([]);
    });
  });

  describe('moveIngredient action', () => {
    test('should move ingredient from one position to another', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockSauce)
      );
      state = burgerConstructorReducer(state, addIngredient(mockMain));
      state = burgerConstructorReducer(state, addIngredient(mockMain2));

      const newState = burgerConstructorReducer(
        state,
        moveIngredient({ from: 0, to: 2 })
      );

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0].name).toBe(mockMain.name);
      expect(newState.ingredients[1].name).toBe(mockMain2.name);
      expect(newState.ingredients[2].name).toBe(mockSauce.name);
    });

    test('should move ingredient from end to beginning', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockSauce)
      );
      state = burgerConstructorReducer(state, addIngredient(mockMain));
      state = burgerConstructorReducer(state, addIngredient(mockMain2));

      const newState = burgerConstructorReducer(
        state,
        moveIngredient({ from: 2, to: 0 })
      );

      expect(newState.ingredients[0].name).toBe(mockMain2.name);
      expect(newState.ingredients[1].name).toBe(mockSauce.name);
      expect(newState.ingredients[2].name).toBe(mockMain.name);
    });

    test('should move ingredient within middle positions', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockSauce)
      );
      state = burgerConstructorReducer(state, addIngredient(mockMain));
      state = burgerConstructorReducer(state, addIngredient(mockMain2));
      state = burgerConstructorReducer(state, addIngredient(mockSauce));

      const newState = burgerConstructorReducer(
        state,
        moveIngredient({ from: 1, to: 2 })
      );

      expect(newState.ingredients[0].name).toBe(mockSauce.name);
      expect(newState.ingredients[1].name).toBe(mockMain2.name);
      expect(newState.ingredients[2].name).toBe(mockMain.name);
      expect(newState.ingredients[3].name).toBe(mockSauce.name);
    });

    test('should handle moving to the same position', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockSauce)
      );
      state = burgerConstructorReducer(state, addIngredient(mockMain));

      const originalOrder = state.ingredients.map((item) => item.name);
      const newState = burgerConstructorReducer(
        state,
        moveIngredient({ from: 1, to: 1 })
      );

      expect(newState.ingredients.map((item) => item.name)).toEqual(
        originalOrder
      );
    });
  });

  describe('resetConstructor action', () => {
    test('should reset constructor to initial state', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      state = burgerConstructorReducer(state, addIngredient(mockSauce));
      state = burgerConstructorReducer(state, addIngredient(mockMain));

      const newState = burgerConstructorReducer(state, resetConstructor());

      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toEqual([]);

      expect(newState.orderRequest).toBe(state.orderRequest);
      expect(newState.orderModalData).toBe(state.orderModalData);
      expect(newState.orderError).toBe(state.orderError);
    });
  });

  describe('clearOrderModalData action', () => {
    test('should clear order modal data', () => {
      const stateWithOrderData = {
        ...initialState,
        orderModalData: {
          _id: 'test-order-id',
          status: 'done',
          name: 'Test Order',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          number: 12345,
          ingredients: ['ingredient1', 'ingredient2']
        }
      };

      const newState = burgerConstructorReducer(
        stateWithOrderData,
        clearOrderModalData()
      );

      expect(newState.orderModalData).toBeNull();

      expect(newState.bun).toBe(stateWithOrderData.bun);
      expect(newState.ingredients).toBe(stateWithOrderData.ingredients);
      expect(newState.orderRequest).toBe(stateWithOrderData.orderRequest);
      expect(newState.orderError).toBe(stateWithOrderData.orderError);
    });
  });

  describe('orderBurger async actions', () => {
    test('should set orderRequest to true when orderBurger.pending', () => {
      const action = { type: orderBurger.pending.type };
      const state = burgerConstructorReducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.orderModalData).toBeNull();
      expect(state.orderError).toBeNull();
    });

    test('should clear previous data when orderBurger.pending', () => {
      const stateWithData = {
        ...initialState,
        orderModalData: {
          _id: 'old-order-id',
          status: 'done',
          name: 'Old Order',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          number: 11111,
          ingredients: ['ingredient1']
        },
        orderError: 'Previous error'
      };

      const action = { type: orderBurger.pending.type };
      const state = burgerConstructorReducer(stateWithData, action);

      expect(state.orderRequest).toBe(true);
      expect(state.orderModalData).toBeNull();
      expect(state.orderError).toBeNull();
    });

    test('should set orderRequest to false and populate orderModalData when orderBurger.fulfilled', () => {
      const stateWithRequest = {
        ...initialState,
        orderRequest: true
      };

      const mockOrder = {
        _id: 'order-123',
        status: 'done',
        name: 'Space Burger',
        createdAt: '2023-12-01T10:00:00.000Z',
        updatedAt: '2023-12-01T10:05:00.000Z',
        number: 12345,
        ingredients: ['60666c42cc7b410027a1a9b1', '60666c42cc7b410027a1a9b5']
      };

      const action = {
        type: orderBurger.fulfilled.type,
        payload: mockOrder
      };

      const state = burgerConstructorReducer(stateWithRequest, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.orderError).toBeNull();
    });

    test('should set orderRequest to false and set error when orderBurger.rejected', () => {
      const stateWithRequest = {
        ...initialState,
        orderRequest: true,
        orderModalData: {
          _id: 'temp-order',
          status: 'pending',
          name: 'Temp Order',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          number: 0,
          ingredients: []
        }
      };

      const errorMessage = 'Ошибка оформления заказа';
      const action = {
        type: orderBurger.rejected.type,
        payload: errorMessage
      };

      const state = burgerConstructorReducer(stateWithRequest, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
      expect(state.orderError).toBe(errorMessage);
    });

    test('should handle orderBurger.rejected without payload', () => {
      const stateWithRequest = {
        ...initialState,
        orderRequest: true
      };

      const action = {
        type: orderBurger.rejected.type,
        payload: undefined
      };

      const state = burgerConstructorReducer(stateWithRequest, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
      expect(state.orderError).toBeUndefined();
    });
  });

  describe('orderBurger state transitions', () => {
    test('should handle complete order cycle: pending -> fulfilled', () => {
      let state: BurgerConstructorState = initialState;

      const pendingAction = { type: orderBurger.pending.type };
      state = burgerConstructorReducer(state, pendingAction);
      expect(state.orderRequest).toBe(true);
      expect(state.orderModalData).toBeNull();
      expect(state.orderError).toBeNull();

      const mockOrder = {
        _id: 'order-456',
        status: 'done',
        name: 'Perfect Burger',
        createdAt: '2023-12-01T11:00:00.000Z',
        updatedAt: '2023-12-01T11:05:00.000Z',
        number: 67890,
        ingredients: ['60666c42cc7b410027a1a9b1', '60666c42cc7b410027a1a9b6']
      };

      const fulfilledAction = {
        type: orderBurger.fulfilled.type,
        payload: mockOrder
      };
      state = burgerConstructorReducer(state, fulfilledAction);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.orderError).toBeNull();
    });

    test('should handle complete order cycle: pending -> rejected', () => {
      let state: BurgerConstructorState = initialState;

      const pendingAction = { type: orderBurger.pending.type };
      state = burgerConstructorReducer(state, pendingAction);
      expect(state.orderRequest).toBe(true);

      const errorMessage = 'Network connection failed';
      const rejectedAction = {
        type: orderBurger.rejected.type,
        payload: errorMessage
      };
      state = burgerConstructorReducer(state, rejectedAction);
      expect(state.orderRequest).toBe(false);
      expect(state.orderError).toBe(errorMessage);
      expect(state.orderModalData).toBeNull();
    });
  });
});
