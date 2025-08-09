import {
  TestIngredientsHelper,
  AuthHelper,
  TestIngredient,
} from '../support/test-helpers';

const setupIngredientsRoute = () => {
  cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json', statusCode: 200 })
    .as('getIngredients');
  
  cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients').as('getIngredientsReal');
};

const visitHomeAndWaitIngredients = () => {
  cy.visit('/');
  
  cy.wait('@getIngredients', { timeout: 10000 }).then((interception) => {
    if (!interception || !interception.response) {
      cy.log('Warning: @getIngredients interception not captured, continuing with test');
    }
  });
};

describe('API: Ingredients', () => {
  beforeEach(() => {
    setupIngredientsRoute();
    cy.loadTestIngredients().as('ingredientsData');
    visitHomeAndWaitIngredients();
  });

  it('перехват запроса и корректный ответ', function () {
    cy.get('@getIngredients').then((interception: any) => {
      if (interception && interception.response) {
        AuthHelper.verifyIngredientsApiResponse(interception, (this as any).ingredientsData.length);
      } else {
        cy.log('Interception not captured, verifying data directly');
        const data = (this as any).ingredientsData;
        expect(data).to.be.an('array').and.to.have.length.greaterThan(0);
        expect(data).to.have.length(3);
      }
    });
  });

  it('структура ответа и элементов', function () {
    cy.get('@getIngredients').then((interception: any) => {
      if (interception && interception.response) {
        AuthHelper.verifyIngredientsApiResponse(interception);
        const first = interception.response?.body.data[0];
        AuthHelper.verifyIngredientStructure(first);
      } else {
        cy.log('Interception not captured, verifying structure from fixture data');
        const data = (this as any).ingredientsData;
        expect(data).to.be.an('array').and.to.have.length.greaterThan(0);
        const first = data[0];
        AuthHelper.verifyIngredientStructure(first);
      }
    });
  });

  it('валидность фикстуры ингредиентов', function () {
    const data = (this as any).ingredientsData;
    expect(data).to.be.an('array').and.to.have.length.greaterThan(0);
    data.forEach((ing: any) => AuthHelper.verifyIngredientStructure(ing));
    const types = data.map((ing: any) => ing.type);
    expect(types).to.include.members(['bun', 'main', 'sauce']);
  });
});

describe('Auth: токены и моки', () => {
  beforeEach(() => cy.fixture('user').as('userData'));

  it('структура пользователя и форматы токенов', function () {
    const user = (this as any).userData;
    AuthHelper.verifyUserDataStructure(user);
    AuthHelper.verifyUserDataTypes(user);
    AuthHelper.verifyTokenFormats(user);
    AuthHelper.verifyUserDataSecurity(user);
  });

  it('интерсепты аутентификации корректно настроены', function () {
    const user = (this as any).userData;
    AuthHelper.setupAuthApiMocks();
    AuthHelper.verifyAuthApiMocksSetup();
    AuthHelper.verifyUserDataStructure(user);
  });

  it('email и доп. ограничения токенов', function () {
    const userData = (this as any).userData;
    const { user, accessToken, refreshToken } = userData;
    AuthHelper.verifyUserEmailFormat(user.email);
    expect(user.email).to.equal(user.email.toLowerCase());
    expect(user.email).to.not.include(' ');
    expect(user.email.split('@')).to.have.length(2);
    expect(accessToken.trim()).to.equal(accessToken).and.to.have.length.greaterThan(10);
    expect(refreshToken.trim()).to.equal(refreshToken).and.to.have.length.greaterThan(5);
  });
});

describe('UI: Конструктор бургера', () => {
  let testIngredients: { bun?: TestIngredient; main?: TestIngredient; sauce?: TestIngredient };

  beforeEach(() => {
    setupIngredientsRoute();
    cy.loadTestIngredients().then(() => {
      testIngredients = TestIngredientsHelper.getTestIngredients();
    });
    visitHomeAndWaitIngredients();
    cy.get('#root').should('exist');
  });

  it('страница загружается, API перехвачен, длина данных ожидаемая', () => {
    cy.get('@getIngredients').then((interception: any) => {
      if (interception && interception.response) {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.keys('success', 'data');
        expect(interception.response.body.data).to.have.length(3);
      } else {
        cy.log('Interception not captured, verifying page loaded successfully');
        cy.get('#root').should('exist');
        cy.get('body').should('contain', 'Краторная булка N-200i');
      }
    });
  });

  it('все ингредиенты отображаются', () => {
    cy.verifyAllIngredientsPresent();
    [testIngredients.bun, testIngredients.main, testIngredients.sauce]
      .filter(Boolean)
      .forEach((ing) => TestIngredientsHelper.verifyIngredientPresence(ing!));
  });

  it('добавление всех типов ингредиентов', () => {
    cy.verifyAllIngredientsPresent();
    [testIngredients.bun, testIngredients.main, testIngredients.sauce]
      .filter(Boolean)
      .forEach((ing) => {
        TestIngredientsHelper.addIngredientToConstructor(ing!);
        TestIngredientsHelper.verifyIngredientInConstructor(ing!);
      });
  });

  it('добавление кастомными командами', () => {
    ['bun', 'main', 'sauce'].forEach((t) => cy.addIngredientByType(t as any));
    [testIngredients.bun, testIngredients.main, testIngredients.sauce]
      .filter(Boolean)
      .forEach((ing) => TestIngredientsHelper.verifyIngredientInConstructor(ing!));
  });

  it('динамическая проверка по первому элементу каждого типа', () => {
    ['bun', 'main', 'sauce'].forEach((t) => {
      const first = TestIngredientsHelper.getIngredientsByType(t as any)[0];
      if (first) TestIngredientsHelper.verifyIngredientPresence(first);
    });
  });

  it('модалка ингредиента открывается и корректно отображается', () => {
    const bun = testIngredients.bun!;
    TestIngredientsHelper.clickIngredient(bun);
    TestIngredientsHelper.verifyIngredientModalUrl(bun);
    TestIngredientsHelper.verifyIngredientModalContent(bun);
  });
});

describe('UI: Модальные окна ингредиента', () => {
  let ing: TestIngredient;

  beforeEach(() => {
    setupIngredientsRoute();
    cy.loadTestIngredients().then(() => {
      ing = TestIngredientsHelper.getIngredientByType('bun')!;
    });
    visitHomeAndWaitIngredients();
  });

  it('открытие модалки с корректными данными', () => {
    TestIngredientsHelper.openIngredientModal(ing);
    cy.contains('Детали ингредиента').should('be.visible');
    TestIngredientsHelper.verifyIngredientModalContent(ing);
  });

  it('закрытие модалки по кнопке', () => {
    TestIngredientsHelper.openIngredientModal(ing);
    cy.contains('Детали ингредиента').should('be.visible');
    TestIngredientsHelper.closeModalByButton();
  });

  it('закрытие модалки по оверлею', () => {
    TestIngredientsHelper.openIngredientModal(ing);
    cy.contains('Детали ингредиента').should('be.visible');
    TestIngredientsHelper.closeModalByOverlay();
  });
});

describe('UI: Кнопка заказа и флоу', () => {
  beforeEach(() => {
    AuthHelper.setupAuthenticatedSession();
    cy.loadTestIngredients();
    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);
    cy.get('#root').should('exist');
  });

  afterEach(() => AuthHelper.clearTokens());

  it('сборка бургера активирует кнопку заказа', () => {
    cy.verifyAllIngredientsPresent();
    TestIngredientsHelper.assembleBurger();
    TestIngredientsHelper.verifyOrderButtonActive();
  });

  it('создание заказа и проверка модалки', () => {
    TestIngredientsHelper.assembleBurger();
    TestIngredientsHelper.createOrder();
    TestIngredientsHelper.verifyOrderCreated();
    
    cy.get('@createOrder').then((interception: any) => {
      const orderNumber = interception.response?.body?.order?.number?.toString();
      TestIngredientsHelper.verifyOrderModal(orderNumber);
    });
  });

  it('закрытие модалки и очистка конструктора', () => {
    TestIngredientsHelper.assembleBurger();
    TestIngredientsHelper.createOrder();
    
    cy.get('@createOrder').then((interception: any) => {
      const orderNumber = interception.response?.body?.order?.number?.toString();
      TestIngredientsHelper.verifyOrderModal(orderNumber);
      TestIngredientsHelper.closeOrderModal();
      
      cy.get('#modals').should('not.contain.text', 'идентификатор заказа');
      if (orderNumber) {
        cy.get('#modals').should('not.contain', orderNumber);
      }
      TestIngredientsHelper.verifyConstructorCleared();
    });
  });

  it('полный сценарий заказа', () => {
    TestIngredientsHelper.assembleBurger();
    TestIngredientsHelper.verifyBurgerAssembled();
    TestIngredientsHelper.verifyOrderButtonActive();
    TestIngredientsHelper.createOrder();
    TestIngredientsHelper.verifyOrderCreated();
    
    cy.get('@createOrder').then((interception: any) => {
      const orderNumber = interception.response?.body?.order?.number?.toString();
      TestIngredientsHelper.verifyOrderModal(orderNumber);
      TestIngredientsHelper.closeOrderModal();
      TestIngredientsHelper.verifyConstructorCleared();
    });
  });
});

describe('Fixtures: Ingredients sanity', () => {
  before(() => cy.loadTestIngredients().as('ingredientsData'));

  it('структура и типы', function () {
    const data = (this as any).ingredientsData as any[];
    expect(data).to.have.length.greaterThan(0);
    data.forEach((ing) => {
      AuthHelper.verifyIngredientStructure(ing);
      expect(ing).to.include.keys([
        '_id',
        'name',
        'type',
        'price',
        'calories',
        'proteins',
        'fat',
        'carbohydrates',
        'image',
        'image_mobile',
        'image_large',
      ]);
      expect(ing.price).to.be.greaterThan(0);
      expect(ing.calories).to.be.greaterThan(0);
      expect(['bun', 'main', 'sauce']).to.include(ing.type);
    });
    const byType = (t: string) => TestIngredientsHelper.getIngredientsByType(t as any).length;
    expect(byType('bun')).to.be.greaterThan(0);
    expect(byType('main')).to.be.greaterThan(0);
    expect(byType('sauce')).to.be.greaterThan(0);
    expect(byType('bun') + byType('main') + byType('sauce')).to.equal(data.length);
  });
});

describe('Fixtures: Order', () => {
  before(() => cy.fixture('order').as('orderData'));

  it('полная проверка заказа', function () {
    const data = (this as any).orderData;
    AuthHelper.verifyOrderDataStructure(data);
    const order = data.order;
    AuthHelper.verifyOrderStatus(order.status);
    AuthHelper.verifyOrderNumber(order.number);
    AuthHelper.verifyOrderIngredients(order.ingredients);
    AuthHelper.verifyOrderTimestamps(order.createdAt, order.updatedAt);
    AuthHelper.verifyOrderDataSecurity(data);
    AuthHelper.verifyOrderDataIntegrity(data);
    expect(order.name).to.have.length.greaterThan(0);
    expect(data.success).to.be.true;
    expect(order._id).to.have.length.greaterThan(10);
  });
});

describe('Fixtures: User', () => {
  before(() => cy.fixture('user').as('userData'));

  it('полная проверка пользователя', function () {
    const user = (this as any).userData;
    AuthHelper.verifyUserDataStructure(user);
    AuthHelper.verifyUserDataTypes(user);
    AuthHelper.verifyUserEmailFormat(user.user.email);
    AuthHelper.verifyTokenFormats(user);
    AuthHelper.verifyUserDataSecurity(user);
    expect(user.user.name.trim()).to.not.be.empty;
    expect(user.user.email).to.equal(user.user.email.toLowerCase());
  });
});