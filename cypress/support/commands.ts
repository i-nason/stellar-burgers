/// <reference types="cypress" />
/// <reference path="./commands.d.ts" />

let testIngredients: any[] = [];

Cypress.Commands.add('setupIngredientsMock', () => {
  cy.intercept('GET', '**/ingredients', { 
    fixture: 'ingredients.json', 
    statusCode: 200 
  }).as('getIngredients');
});

Cypress.Commands.add('setupAuthMocks', () => {
  cy.intercept('POST', '**/auth/login', { 
    fixture: 'user.json', 
    statusCode: 200 
  }).as('login');
  
  cy.intercept('GET', '**/auth/user', { 
    fixture: 'user.json', 
    statusCode: 200 
  }).as('getUser');
  
  cy.intercept('POST', '**/orders', { 
    fixture: 'order.json', 
    statusCode: 200 
  }).as('createOrder');
});

Cypress.Commands.add('loadTestIngredients', () => {
  return cy.fixture('ingredients').then((data) => {
    testIngredients = data.data;
    return cy.wrap(testIngredients);
  });
});



Cypress.Commands.add('setAuthTokens', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('accessToken', 'Bearer test-access-token');
    win.localStorage.setItem('refreshToken', 'test-refresh-token');
  });
});

Cypress.Commands.add('clearAuthTokens', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('accessToken');
    win.localStorage.removeItem('refreshToken');
  });
});

Cypress.Commands.add('login', (email = 'test@example.com', password = 'password') => {
  cy.setupAuthMocks();
  cy.setAuthTokens();
});

Cypress.Commands.add('logout', () => {
  cy.clearAuthTokens();
});



Cypress.Commands.add('getIngredientByType', (type: 'bun' | 'main' | 'sauce') => {
  const ingredient = testIngredients.find(ing => ing.type === type);
  if (!ingredient) {
    throw new Error(`Ingredient of type ${type} not found in test data`);
  }
  return cy.wrap(ingredient) as any;
});

Cypress.Commands.add('addIngredientToConstructor', (ingredient?: any) => {
  if (ingredient) {
    cy.contains(ingredient.name)
      .should('be.visible')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });
  } else {
    cy.get('[data-cy="ingredient-item"]')
      .first()
      .within(() => {
        cy.get('[data-cy="add-ingredient-btn"]').click();
      });
  }
});

Cypress.Commands.add('addIngredientByType', (type: 'bun' | 'main' | 'sauce') => {
  cy.getIngredientByType(type).then((ingredient) => {
    cy.addIngredientToConstructor(ingredient);
  });
});



Cypress.Commands.add('assembleBurger', () => {
  cy.addIngredientByType('bun');
  cy.addIngredientByType('main');
});

Cypress.Commands.add('verifyBurgerAssembled', () => {
  cy.getIngredientByType('bun').then((bun) => {
    cy.get('[data-cy="constructor-bun-top"]').should('contain', bun.name);
    cy.get('[data-cy="constructor-bun-bottom"]').should('contain', bun.name);
  });
  
  cy.getIngredientByType('main').then((main) => {
    cy.get('[data-cy="constructor-ingredients"]').should('contain', main.name);
  });
});

Cypress.Commands.add('clearConstructor', () => {
  cy.get('[data-cy="constructor-area"]').should('contain', 'Выберите булки');
  cy.get('[data-cy="constructor-area"]').should('contain', 'Выберите начинку');
});



Cypress.Commands.add('createOrder', () => {
  cy.get('[data-cy="order-button"]')
    .should('be.visible')
    .and('not.be.disabled')
    .click();
  
  cy.wait('@createOrder', { timeout: 10000 });
});

Cypress.Commands.add('verifyOrderModal', (orderNumber?: string) => {
  cy.get('[data-cy="modal"]').should('be.visible');
  cy.get('[data-cy="modal"]').should('contain', 'идентификатор заказа');
  
  if (orderNumber) {
    cy.get('[data-cy="order-number"]').should('contain', orderNumber);
  }
});

Cypress.Commands.add('closeOrderModal', () => {
  cy.get('body').type('{esc}');
  cy.get('[data-cy="modal"]').should('not.exist');
});



Cypress.Commands.add('openIngredientModal', (ingredient: any) => {
  cy.get('[data-cy="ingredient-item"]')
    .contains(ingredient.name)
    .click();
  
  cy.url().should('include', `/ingredients/${ingredient._id}`);
});

Cypress.Commands.add('verifyIngredientModal', (ingredient: any) => {
  cy.get('[data-cy="ingredient-modal"]').should('be.visible');
  cy.get('[data-cy="ingredient-modal"]').should('contain', ingredient.name);
  cy.get('[data-cy="ingredient-modal"]').should('contain', ingredient.calories);
  cy.get('[data-cy="ingredient-modal"]').should('contain', ingredient.proteins);
});

Cypress.Commands.add('closeModal', () => {
  cy.get('body').type('{esc}');
  cy.get('[data-cy="modal"]').should('not.exist');
});



Cypress.Commands.add('visitHome', () => {
  cy.setupIngredientsMock();
  cy.visit('/');
  cy.wait('@getIngredients', { timeout: 10000 });
});

Cypress.Commands.add('verifyPageLoaded', () => {
  cy.get('[data-cy="app"]').should('exist');
  cy.get('[data-cy="ingredients-section"]').should('be.visible');
  cy.get('[data-cy="constructor-section"]').should('be.visible');
});

Cypress.Commands.add('verifyAllIngredientsPresent', () => {
  ['bun', 'main', 'sauce'].forEach((type) => {
    cy.getIngredientByType(type as any).then((ingredient) => {
      cy.get('[data-cy="ingredients-section"]').should('contain', ingredient.name);
    });
  });
});