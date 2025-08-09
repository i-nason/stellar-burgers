import { TestIngredientsHelper, AuthHelper } from '../support/test-helpers';

describe('Order Button Functionality', () => {
  beforeEach(() => {
    // Настраиваем авторизованную сессию с API моками
    AuthHelper.setupAuthenticatedSession();
    
    // Загружаем данные ингредиентов из фикстуры
    cy.loadTestIngredients();
    
    // Переходим на главную страницу
    cy.visit('http://localhost:4000/');
    
    // Ждем загрузки данных
    cy.wait('@getIngredients');
    cy.wait('@getUser');
    cy.wait(3000);
  });

  afterEach(() => {
    // Очищаем токены после теста
    AuthHelper.clearTokens();
  });

  it('should assemble burger and verify order button is active', () => {
    // Ждем загрузки страницы
    cy.wait(3000);
    
    // Проверяем наличие ингредиентов на странице
    cy.verifyAllIngredientsPresent();
    
    // Собираем бургер
    TestIngredientsHelper.assembleBurger();
    
    // Проверяем, что кнопка заказа стала активной
    TestIngredientsHelper.verifyOrderButtonActive();
  });

  it('should create order and display order modal with correct details', () => {
    // Ждем загрузки страницы
    cy.wait(3000);
    
    // Собираем бургер
    TestIngredientsHelper.assembleBurger();
    
    // Создаем заказ
    TestIngredientsHelper.createOrder();
    
    // Проверяем успешность создания заказа
    TestIngredientsHelper.verifyOrderCreated();
    
    // Проверяем модальное окно заказа
    TestIngredientsHelper.verifyOrderModal('12345');
  });

  it('should close order modal and clear constructor after successful order', () => {
    // Ждем загрузки страницы
    cy.wait(3000);
    
    // Собираем бургер
    TestIngredientsHelper.assembleBurger();
    
    // Проверяем, что бургер собран
    TestIngredientsHelper.verifyBurgerAssembled();
    
    // Создаем заказ
    TestIngredientsHelper.createOrder();
    
    // Проверяем модальное окно заказа
    TestIngredientsHelper.verifyOrderModal('12345');
    
    // Закрываем модальное окно
    TestIngredientsHelper.closeOrderModal();
    
    // Проверяем, что модальное окно закрылось
    cy.get('#modals').should('not.contain', '12345');
    
    // Проверяем, что конструктор очистился
    TestIngredientsHelper.verifyConstructorCleared();
  });

  it('should handle full order flow from assembly to completion', () => {
    // Комплексный тест полного флоу заказа
    cy.wait(3000);
    
    // 1. Собираем бургер
    TestIngredientsHelper.assembleBurger();
    TestIngredientsHelper.verifyBurgerAssembled();
    
    // 2. Проверяем активность кнопки заказа
    TestIngredientsHelper.verifyOrderButtonActive();
    
    // 3. Создаем заказ
    TestIngredientsHelper.createOrder();
    TestIngredientsHelper.verifyOrderCreated();
    
    // 4. Проверяем модальное окно
    TestIngredientsHelper.verifyOrderModal('12345');
    
    // 5. Закрываем модальное окно
    TestIngredientsHelper.closeOrderModal();
    
    // 6. Проверяем очистку конструктора
    TestIngredientsHelper.verifyConstructorCleared();
  });
});