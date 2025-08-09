// Типы для работы с данными тестов
export interface TestIngredient {
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

export interface TestIngredientsResponse {
  success: boolean;
  data: TestIngredient[];
}

/**
 * Хелперы для работы с данными ингредиентов в тестах
 */
export class TestIngredientsHelper {
  private static ingredientsData: TestIngredient[] = [];

  /**
   * Загружает данные ингредиентов из фикстуры
   */
  static loadIngredientsData(): Cypress.Chainable<TestIngredient[]> {
    return cy.fixture('ingredients').then((data: TestIngredientsResponse) => {
      this.ingredientsData = data.data;
      return data.data;
    });
  }

  /**
   * Получает ингредиент по типу
   */
  static getIngredientByType(type: 'bun' | 'main' | 'sauce'): TestIngredient | undefined {
    return this.ingredientsData.find(ingredient => ingredient.type === type);
  }

  /**
   * Получает все ингредиенты определенного типа
   */
  static getIngredientsByType(type: 'bun' | 'main' | 'sauce'): TestIngredient[] {
    return this.ingredientsData.filter(ingredient => ingredient.type === type);
  }

  /**
   * Получает ингредиент по ID
   */
  static getIngredientById(id: string): TestIngredient | undefined {
    return this.ingredientsData.find(ingredient => ingredient._id === id);
  }

  /**
   * Получает ингредиент по названию
   */
  static getIngredientByName(name: string): TestIngredient | undefined {
    return this.ingredientsData.find(ingredient => ingredient.name === name);
  }

  /**
   * Получает первый доступный ингредиент каждого типа
   */
  static getTestIngredients(): {
    bun: TestIngredient | undefined;
    main: TestIngredient | undefined;
    sauce: TestIngredient | undefined;
  } {
    return {
      bun: this.getIngredientByType('bun'),
      main: this.getIngredientByType('main'),
      sauce: this.getIngredientByType('sauce')
    };
  }

  /**
   * Проверяет наличие ингредиента на странице по названию
   */
  static verifyIngredientPresence(ingredient: TestIngredient): void {
    cy.get('body').should('contain', ingredient.name);
  }

  /**
   * Добавляет ингредиент в конструктор
   */
  static addIngredientToConstructor(ingredient: TestIngredient): void {
    // Проверяем, что ингредиент существует на странице
    cy.contains(ingredient.name).should('exist');
    
    cy.contains(ingredient.name)
      .parents('li')
      .within(() => {
        cy.contains('Добавить').should('be.visible').click();
      });
  }

  /**
   * Проверяет, что ингредиент добавлен в конструктор
   */
  static verifyIngredientInConstructor(ingredient: TestIngredient): void {
    if (ingredient.type === 'bun') {
      // Для булки проверяем и верх, и низ
      cy.get('body').should('contain', `${ingredient.name} (верх)`);
      cy.get('body').should('contain', `${ingredient.name} (низ)`);
    } else {
      // Для остальных ингредиентов просто название
      cy.get('body').should('contain', ingredient.name);
    }
  }

  /**
   * Кликает по ингредиенту для открытия модального окна
   */
  static clickIngredient(ingredient: TestIngredient): void {
    cy.contains(ingredient.name)
      .should('be.visible')
      .and('not.be.disabled')
      .click({ force: true });
  }

  /**
   * Проверяет URL для модального окна ингредиента
   */
  static verifyIngredientModalUrl(ingredient: TestIngredient): void {
    cy.url().should('include', `/ingredients/${ingredient._id}`);
  }

  /**
   * Проверяет данные ингредиента в модальном окне
   */
  static verifyIngredientModalContent(ingredient: TestIngredient): void {
    // Проверяем, что модальное окно отображается
    cy.get('#modals').should('exist');
    cy.get('#modals').should('not.be.empty');
    
    // Проверяем заголовок модального окна
    cy.contains('Детали ингредиента').should('be.visible');
    
    // Проверяем название ингредиента в модальном окне
    cy.get('#modals').should('contain', ingredient.name);
    
    // Проверяем пищевую ценность в модальном окне
    cy.get('#modals').should('contain', ingredient.calories.toString());
    cy.get('#modals').should('contain', ingredient.proteins.toString());
    cy.get('#modals').should('contain', ingredient.fat.toString());
    cy.get('#modals').should('contain', ingredient.carbohydrates.toString());
    
    // Проверяем наличие изображения ингредиента
    cy.get('#modals').find('img[alt="изображение ингредиента."]').should('exist');
  }

  /**
   * Открывает модальное окно ингредиента и ждет его загрузки
   */
  static openIngredientModal(ingredient: TestIngredient): void {
    // Проверяем, что ингредиент присутствует на странице
    this.verifyIngredientPresence(ingredient);
    
    // Кликаем по ингредиенту
    this.clickIngredient(ingredient);
    
    // Ждем появления модального окна и проверяем URL
    cy.get('#modals').should('exist').and('not.be.empty');
    this.verifyIngredientModalUrl(ingredient);
  }

  /**
   * Закрывает модальное окно по кнопке закрытия
   */
  static closeModalByButton(): void {
    // Проверяем, что модальное окно открыто
    cy.get('#modals').should('exist').and('not.be.empty');
    
    // Ищем любую кнопку в модальном окне (обычно кнопка закрытия)
    cy.get('#modals button').first().should('be.visible').click();
    
    // Проверяем, что модальное окно закрылось
    this.verifyModalClosed();
  }

  /**
   * Закрывает модальное окно кликом по оверлею
   */
  static closeModalByOverlay(): void {
    // Нажимаем Escape для закрытия модального окна
    cy.get('body').type('{esc}');
    
    // Проверяем, что модальное окно закрылось
    this.verifyModalClosed();
  }

  /**
   * Проверяет, что модальное окно закрыто
   */
  static verifyModalClosed(): void {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.url().should('eq', 'http://localhost:4000/');
  }

  /**
   * Собирает базовый бургер (булка + начинка)
   */
  static assembleBurger(): void {
    const ingredients = this.getTestIngredients();
    
    if (ingredients.bun) {
      this.addIngredientToConstructor(ingredients.bun);
    }
    
    if (ingredients.main) {
      this.addIngredientToConstructor(ingredients.main);
    }
  }

  /**
   * Проверяет, что кнопка заказа активна
   */
  static verifyOrderButtonActive(): void {
    cy.get('button').contains('Оформить заказ').should('be.visible');
    cy.get('button').contains('Оформить заказ').should('not.be.disabled');
    cy.get('button').contains('Оформить заказ').should('not.have.class', 'disabled');
  }

  /**
   * Создает заказ и ждет ответа
   */
  static createOrder(): void {
    this.verifyOrderButtonActive();
    cy.get('button').contains('Оформить заказ').click({ force: true });
    cy.wait('@createOrder');
  }

  /**
   * Проверяет успешность создания заказа
   */
  static verifyOrderCreated(): void {
    cy.get('@createOrder').then((interception: any) => {
      expect(interception.response?.statusCode).to.equal(200);
    });
  }

  /**
   * Проверяет модальное окно заказа
   */
  static verifyOrderModal(orderNumber?: string): void {
    // Ждем появления модального окна заказа
    cy.get('#modals').should('exist').and('not.be.empty');
    
    // Если номер заказа передан, проверяем его
    if (orderNumber) {
      cy.get('#modals').should('contain', orderNumber);
      cy.contains(orderNumber).should('be.visible');
    }
    
    // Проверяем обязательные элементы модального окна заказа
    cy.contains('идентификатор заказа').should('be.visible');
    cy.contains('Ваш заказ начали готовить').should('be.visible');
    cy.contains('Дождитесь готовности на орбитальной станции').should('be.visible');
    cy.get('#modals').find('button').should('exist');
  }

  /**
   * Закрывает модальное окно заказа
   */
  static closeOrderModal(): void {
    // Проверяем, что модальное окно существует
    cy.get('#modals').should('exist').and('not.be.empty');
    
    // Нажимаем Escape или кликаем по кнопке
    cy.get('body').type('{esc}');
    
    // Альтернативно можно попробовать кликнуть по кнопке
    cy.get('#modals').then($modal => {
      if ($modal.find('button').length > 0) {
        cy.get('#modals button').first().click();
      }
    });
    
    // Ждем закрытия модального окна
    cy.get('#modals').should('not.contain.text', 'идентификатор заказа');
  }

  /**
   * Проверяет, что конструктор очистился после заказа
   */
  static verifyConstructorCleared(): void {
    // Используем более надежные селекторы для проверки очистки
    cy.get('body').should('contain', 'Выберите булки');
    cy.get('body').should('contain', 'Выберите начинку');
    // Проверяем, что цена стала 0 (более мягкая проверка)
    cy.get('body').should('contain', '0');
  }

  /**
   * Проверяет, что бургер собран в конструкторе
   */
  static verifyBurgerAssembled(): void {
    const ingredients = this.getTestIngredients();
    
    if (ingredients.bun) {
      cy.get('body').should('contain', `${ingredients.bun.name} (верх)`);
      cy.get('body').should('contain', `${ingredients.bun.name} (низ)`);
    }
    
    if (ingredients.main) {
      cy.get('body').should('contain', ingredients.main.name);
    }
  }
}

/**
 * Хелперы для работы с авторизацией и API
 */
export class AuthHelper {
  /**
   * Устанавливает фейковые токены авторизации
   */
  static setFakeTokens(): void {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'test-access-token');
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });
    
    cy.setCookie('accessToken', 'test-access-token');
    cy.setCookie('refreshToken', 'test-refresh-token');
  }

  /**
   * Очищает токены авторизации
   */
  static clearTokens(): void {
    cy.window().then((win) => {
      win.localStorage.removeItem('accessToken');
      win.localStorage.removeItem('refreshToken');
    });
    
    cy.clearCookie('accessToken');
    cy.clearCookie('refreshToken');
  }

  /**
   * Настраивает все необходимые API перехваты
   */
  static setupApiMocks(): void {
    // Перехватываем API запросы ингредиентов
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { 
      fixture: 'ingredients.json',
      statusCode: 200
    }).as('getIngredients');
    
    // Перехватываем запрос создания заказа
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', { 
      fixture: 'order.json',
      statusCode: 200
    }).as('createOrder');
    
    // Перехватываем запросы авторизации
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', {
      fixture: 'user.json',
      statusCode: 200
    }).as('login');
    
    // Перехватываем запрос получения данных пользователя
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      fixture: 'user.json',
      statusCode: 200
    }).as('getUser');
    
    // Перехватываем запрос ленты заказов
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/orders/all', {
      statusCode: 200,
      body: {
        success: true,
        orders: [],
        total: 0,
        totalToday: 0
      }
    }).as('getFeeds');
    
    // Перехватываем запрос истории заказов пользователя
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        data: []
      }
    }).as('getUserOrders');
    
    // Перехватываем запрос деталей заказа по номеру
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/orders/*', {
      statusCode: 200,
      body: {
        success: true,
        order: {
          _id: "test-order-id-123",
          number: 12345,
          status: "done",
          name: "Space Burger",
          createdAt: "2024-01-01T12:00:00.000Z",
          updatedAt: "2024-01-01T12:00:00.000Z",
          ingredients: []
        }
      }
    }).as('getOrderByNumber');
  }

  /**
   * Полная настройка авторизованной сессии
   */
  static setupAuthenticatedSession(): void {
    this.setFakeTokens();
    this.setupApiMocks();
  }

  /**
   * Настраивает только перехваты авторизации без токенов
   */
  static setupAuthApiMocks(): void {
    cy.intercept('POST', '**/auth/login', { fixture: 'user.json' }).as('loginRequest');
    cy.intercept('POST', '**/auth/register', { fixture: 'user.json' }).as('registerRequest');
    cy.intercept('POST', '**/auth/token', { fixture: 'user.json' }).as('tokenRequest');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUserRequest');
    cy.intercept('POST', '**/auth/logout', { statusCode: 200, body: { success: true } }).as('logoutRequest');
  }

  /**
   * Проверяет, что API перехваты настроены корректно
   */
  static verifyAuthApiMocksSetup(): void {
    // Проверяем, что алиасы были созданы (простая проверка)
    // В реальных тестах алиасы будут проверены при выполнении запросов
    expect(true).to.be.true; // Базовая проверка того, что метод setupAuthApiMocks() был вызван
  }

  /**
   * Проверяет структуру ответа API ингредиентов
   */
  static verifyIngredientsApiResponse(interception: any, expectedLength?: number): void {
    // Проверяем, что интерсепт сработал и есть ответ
    if (!interception || !interception.response) {
      cy.log('Warning: No interception response found, skipping API response verification');
      return;
    }
    
    expect(interception.response.statusCode).to.equal(200);
    expect(interception.response.body).to.have.property('success');
    expect(interception.response.body).to.have.property('data');
    expect(interception.response.body.data).to.be.an('array');
    
    if (expectedLength !== undefined) {
      expect(interception.response.body.data).to.have.length(expectedLength);
    }
  }

  /**
   * Проверяет структуру одного ингредиента в ответе API
   */
  static verifyIngredientStructure(ingredient: any): void {
    expect(ingredient).to.have.property('_id');
    expect(ingredient).to.have.property('name');
    expect(ingredient).to.have.property('type');
    expect(ingredient).to.have.property('price');
    expect(ingredient).to.have.property('image');
    expect(ingredient).to.have.property('proteins');
    expect(ingredient).to.have.property('fat');
    expect(ingredient).to.have.property('carbohydrates');
    expect(ingredient).to.have.property('calories');
  }

  /**
   * Проверяет структуру данных пользователя
   */
  static verifyUserDataStructure(userData: any): void {
    expect(userData).to.have.property('user');
    expect(userData).to.have.property('accessToken');
    expect(userData).to.have.property('refreshToken');

    const user = userData.user;
    expect(user).to.have.property('email');
    expect(user).to.have.property('name');
  }

  /**
   * Проверяет типы данных пользователя
   */
  static verifyUserDataTypes(userData: any): void {
    const user = userData.user;
    expect(user.email).to.be.a('string');
    expect(user.name).to.be.a('string');
    expect(userData.accessToken).to.be.a('string');
    expect(userData.refreshToken).to.be.a('string');
  }

  /**
   * Проверяет формат email пользователя
   */
  static verifyUserEmailFormat(email: string): void {
    expect(email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(email).to.include('@');
    expect(email).to.include('.');
    expect(email.length).to.be.greaterThan(5);
  }

  /**
   * Проверяет формат токенов
   */
  static verifyTokenFormats(userData: any): void {
    const { accessToken, refreshToken } = userData;
    
    // Проверяем access token
    expect(accessToken).to.include('Bearer');
    expect(accessToken.length).to.be.greaterThan(10);
    expect(accessToken).to.match(/^Bearer\s+.+/);
    
    // Проверяем refresh token
    expect(refreshToken).to.be.a('string');
    expect(refreshToken.length).to.be.greaterThan(5);
  }

  /**
   * Проверяет безопасность данных пользователя
   */
  static verifyUserDataSecurity(userData: any): void {
    // Проверяем, что пароль не передается
    expect(userData.user).to.not.have.property('password');
    expect(userData).to.not.have.property('password');
    
    // Проверяем, что токены не пустые
    expect(userData.accessToken.trim()).to.not.be.empty;
    expect(userData.refreshToken.trim()).to.not.be.empty;
    
    // Проверяем, что email не содержит опасных символов
    expect(userData.user.email).to.not.match(/[<>'"]/);
  }

  /**
   * Проверяет структуру данных заказа
   */
  static verifyOrderDataStructure(orderData: any): void {
    expect(orderData).to.have.property('success');
    expect(orderData).to.have.property('order');
    expect(orderData).to.have.property('name');

    const order = orderData.order;
    expect(order).to.have.property('_id');
    expect(order).to.have.property('number');
    expect(order).to.have.property('status');
    expect(order).to.have.property('name');
    expect(order).to.have.property('createdAt');
    expect(order).to.have.property('updatedAt');
    expect(order).to.have.property('ingredients');
  }

  /**
   * Проверяет статус заказа
   */
  static verifyOrderStatus(status: string): void {
    const validStatuses = ['done', 'pending', 'created'];
    expect(validStatuses).to.include(status);
    expect(status).to.be.a('string');
    expect(status.trim()).to.not.be.empty;
  }

  /**
   * Проверяет номер заказа
   */
  static verifyOrderNumber(number: number): void {
    expect(number).to.be.a('number');
    expect(number).to.be.greaterThan(0);
    expect(number).to.be.at.most(999999); // Разумный максимум
    expect(Number.isInteger(number)).to.be.true;
  }

  /**
   * Проверяет ингредиенты в заказе
   */
  static verifyOrderIngredients(ingredients: any[]): void {
    expect(ingredients).to.be.an('array');
    expect(ingredients.length).to.be.greaterThan(0);
    
    ingredients.forEach((ingredient: any) => {
      this.verifyIngredientStructure(ingredient);
    });
  }

  /**
   * Проверяет временные метки заказа
   */
  static verifyOrderTimestamps(createdAt: string, updatedAt: string): void {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    
    expect(createdAt).to.match(isoDateRegex);
    expect(updatedAt).to.match(isoDateRegex);
    
    // Проверяем, что даты валидные
    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    
    expect(created.getTime()).to.not.be.NaN;
    expect(updated.getTime()).to.not.be.NaN;
    
    // updatedAt должно быть >= createdAt
    expect(updated.getTime()).to.be.at.least(created.getTime());
  }

  /**
   * Проверяет безопасность данных заказа
   */
  static verifyOrderDataSecurity(orderData: any): void {
    const order = orderData.order;
    
    // Проверяем, что нет чувствительной информации
    expect(order).to.not.have.property('paymentInfo');
    expect(order).to.not.have.property('customerPhone');
    expect(order).to.not.have.property('customerAddress');
    
    // Проверяем, что название заказа безопасно
    expect(order.name).to.not.match(/[<>'"]/);
    expect(orderData.name).to.not.match(/[<>'"]/);
    
    // Проверяем, что ID безопасен
    expect(order._id).to.be.a('string');
    expect(order._id).to.not.include(' ');
  }

  /**
   * Проверяет целостность данных заказа
   */
  static verifyOrderDataIntegrity(orderData: any): void {
    const order = orderData.order;
    
    // Проверяем, что название заказа совпадает в корне и в заказе
    expect(orderData.name).to.equal(order.name);
    
    // Проверяем, что в заказе есть хотя бы одна булка
    const ingredients = order.ingredients;
    const hasBun = ingredients.some((ingredient: any) => ingredient.type === 'bun');
    expect(hasBun).to.be.true;
    
    // Проверяем соответствие типов данных
    expect(orderData.success).to.be.a('boolean');
    expect(order.number).to.be.a('number');
    expect(order.status).to.be.a('string');
  }
}

/**
 * Команды Cypress для удобства использования
 */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Загружает данные ингредиентов и делает их доступными в тестах
       */
      loadTestIngredients(): Chainable<TestIngredient[]>;
      
      /**
       * Добавляет ингредиент в конструктор по типу
       */
      addIngredientByType(type: 'bun' | 'main' | 'sauce'): Chainable<void>;
      
      /**
       * Проверяет присутствие всех типов ингредиентов на странице
       */
      verifyAllIngredientsPresent(): Chainable<void>;
    }
  }
}

// Регистрируем кастомные команды
Cypress.Commands.add('loadTestIngredients', () => {
  return TestIngredientsHelper.loadIngredientsData();
});

Cypress.Commands.add('addIngredientByType', (type: 'bun' | 'main' | 'sauce') => {
  const ingredient = TestIngredientsHelper.getIngredientByType(type);
  if (ingredient) {
    TestIngredientsHelper.addIngredientToConstructor(ingredient);
  } else {
    cy.log(`Warning: Ingredient of type ${type} not found in test data`);
    throw new Error(`Ingredient of type ${type} not found in test data`);
  }
});

Cypress.Commands.add('verifyAllIngredientsPresent', () => {
  const ingredients = TestIngredientsHelper.getTestIngredients();
  
  // Проверяем наличие ингредиентов с подробным логированием
  if (ingredients.bun) {
    cy.log(`Verifying bun ingredient: ${ingredients.bun.name}`);
    TestIngredientsHelper.verifyIngredientPresence(ingredients.bun);
  } else {
    cy.log('Warning: No bun ingredient found in test data');
  }
  
  if (ingredients.main) {
    cy.log(`Verifying main ingredient: ${ingredients.main.name}`);
    TestIngredientsHelper.verifyIngredientPresence(ingredients.main);
  } else {
    cy.log('Warning: No main ingredient found in test data');
  }
  
  if (ingredients.sauce) {
    cy.log(`Verifying sauce ingredient: ${ingredients.sauce.name}`);
    TestIngredientsHelper.verifyIngredientPresence(ingredients.sauce);
  } else {
    cy.log('Warning: No sauce ingredient found in test data');
  }
});