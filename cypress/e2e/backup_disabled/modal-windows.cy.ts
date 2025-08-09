import { TestIngredientsHelper, TestIngredient } from '../support/test-helpers';

describe('Modal Windows Functionality', () => {
  let testIngredient: TestIngredient;

  beforeEach(() => {
    // Перехватываем API запросы используя фикстуру
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { 
      fixture: 'ingredients.json',
      statusCode: 200
    }).as('getIngredients');
    
    // Загружаем данные ингредиентов из фикстуры
    cy.loadTestIngredients().then(() => {
      testIngredient = TestIngredientsHelper.getIngredientByType('bun')!;
    });
    
    // Переходим на главную страницу
    cy.visit('http://localhost:4000/');
    
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
    
    // Ждем загрузки компонентов
    cy.wait(3000);
  });

  it('should open ingredient modal window with correct data', () => {
    // Ждем загрузки страницы
    cy.wait(3000);
    
    // Открываем модальное окно с использованием хелпера
    TestIngredientsHelper.openIngredientModal(testIngredient);
    
    // Проверяем содержимое модального окна
    TestIngredientsHelper.verifyIngredientModalContent(testIngredient);
  });

  it('should close modal window by clicking close button', () => {
    // Ждем загрузки страницы
    cy.wait(3000);
    
    // Открываем модальное окно
    TestIngredientsHelper.openIngredientModal(testIngredient);
    
    // Проверяем, что модальное окно открылось
    cy.contains('Детали ингредиента').should('be.visible');
    
    // Закрываем модальное окно кликом по кнопке закрытия
    TestIngredientsHelper.closeModalByButton();
  });

  it('should close modal window by clicking overlay', () => {
    // Ждем загрузки страницы
    cy.wait(3000);
    
    // Открываем модальное окно
    TestIngredientsHelper.openIngredientModal(testIngredient);
    
    // Проверяем, что модальное окно открылось
    cy.contains('Детали ингредиента').should('be.visible');
    
    // Закрываем модальное окно кликом по оверлею
    TestIngredientsHelper.closeModalByOverlay();
  });


}); 