/// <reference types="cypress" />

// Типы для работы с данными тестов
interface TestIngredient {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
}

// Объявляем типы для кастомных команд
declare global {
  namespace Cypress {
    interface Chainable {
      // API и данные
      setupIngredientsMock(): Chainable<void>;
      setupAuthMocks(): Chainable<void>;
      loadTestIngredients(): Chainable<TestIngredient[]>;
      
      // Аутентификация
      login(email?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
      setAuthTokens(): Chainable<void>;
      clearAuthTokens(): Chainable<void>;
      
      // Работа с ингредиентами
      getIngredientByType(type: 'bun' | 'main' | 'sauce'): Chainable<TestIngredient>;
      addIngredientToConstructor(ingredient?: TestIngredient): Chainable<void>;
      addIngredientByType(type: 'bun' | 'main' | 'sauce'): Chainable<void>;
      
      // Конструктор бургера
      assembleBurger(): Chainable<void>;
      verifyBurgerAssembled(): Chainable<void>;
      clearConstructor(): Chainable<void>;
      
      // Заказы
      createOrder(): Chainable<void>;
      verifyOrderModal(orderNumber?: string): Chainable<void>;
      closeOrderModal(): Chainable<void>;
      
      // Модальные окна
      openIngredientModal(ingredient: TestIngredient): Chainable<void>;
      verifyIngredientModal(ingredient: TestIngredient): Chainable<void>;
      closeModal(): Chainable<void>;
      
      // Навигация и общие проверки
      visitHome(): Chainable<void>;
      verifyPageLoaded(): Chainable<void>;
      verifyAllIngredientsPresent(): Chainable<void>;
    }
  }
}

export {};
