import { TestIngredientsHelper, TestIngredient } from '../support/test-helpers';

describe('Burger Constructor', () => {
  let testIngredients: {
    bun: TestIngredient | undefined;
    main: TestIngredient | undefined;
    sauce: TestIngredient | undefined;
  };

  beforeEach(() => {
    // Перехватываем API запросы используя фикстуру
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { 
      fixture: 'ingredients.json',
      statusCode: 200
    }).as('getIngredients');
    
    // Загружаем данные ингредиентов из фикстуры
    cy.loadTestIngredients().then((ingredients) => {
      testIngredients = TestIngredientsHelper.getTestIngredients();
    });
    
    // Переходим на главную страницу
    cy.visit('http://localhost:4000/');
    
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
    
    // Ждем загрузки компонентов
    cy.wait(3000);
  });

  it('should load page and verify API interception with fixture data', () => {
    // Проверяем, что страница загрузилась
    cy.get('body').should('exist');
    cy.get('*').should('have.length.greaterThan', 0);
    
    // Проверяем, что API запрос был перехвачен
    cy.get('@getIngredients').then((interception: any) => {
      expect(interception.response?.statusCode).to.equal(200);
      expect(interception.response?.body).to.have.property('success');
      expect(interception.response?.body).to.have.property('data');
      expect(interception.response?.body.data).to.have.length(3);
    });
  });

  it('should verify all ingredients are present on page', () => {
    // Используем универсальную проверку через хелпер
    cy.verifyAllIngredientsPresent();
    
    // Дополнительная проверка через объект testIngredients
    if (testIngredients.bun) {
      TestIngredientsHelper.verifyIngredientPresence(testIngredients.bun);
    }
    if (testIngredients.main) {
      TestIngredientsHelper.verifyIngredientPresence(testIngredients.main);
    }
    if (testIngredients.sauce) {
      TestIngredientsHelper.verifyIngredientPresence(testIngredients.sauce);
    }
  });

  it('should add all types of ingredients to constructor using fixture data', () => {
    // Проверяем наличие ингредиентов на странице
    cy.verifyAllIngredientsPresent();
    
    // Добавляем булку в конструктор
    if (testIngredients.bun) {
      TestIngredientsHelper.addIngredientToConstructor(testIngredients.bun);
      TestIngredientsHelper.verifyIngredientInConstructor(testIngredients.bun);
    }
    
    // Добавляем начинку в конструктор
    if (testIngredients.main) {
      TestIngredientsHelper.addIngredientToConstructor(testIngredients.main);
      TestIngredientsHelper.verifyIngredientInConstructor(testIngredients.main);
    }
    
    // Добавляем соус в конструктор
    if (testIngredients.sauce) {
      TestIngredientsHelper.addIngredientToConstructor(testIngredients.sauce);
      TestIngredientsHelper.verifyIngredientInConstructor(testIngredients.sauce);
    }
  });

  it('should add ingredients using custom commands', () => {
    // Демонстрируем использование кастомных команд
    cy.addIngredientByType('bun');
    cy.addIngredientByType('main');
    cy.addIngredientByType('sauce');
    
    // Проверяем результат
    if (testIngredients.bun) {
      TestIngredientsHelper.verifyIngredientInConstructor(testIngredients.bun);
    }
    if (testIngredients.main) {
      TestIngredientsHelper.verifyIngredientInConstructor(testIngredients.main);
    }
    if (testIngredients.sauce) {
      TestIngredientsHelper.verifyIngredientInConstructor(testIngredients.sauce);
    }
  });

  it('should work with different ingredient types dynamically', () => {
    // Получаем все ингредиенты каждого типа (если их несколько)
    const allBuns = TestIngredientsHelper.getIngredientsByType('bun');
    const allMains = TestIngredientsHelper.getIngredientsByType('main');
    const allSauces = TestIngredientsHelper.getIngredientsByType('sauce');

    // Тестируем с первым доступным ингредиентом каждого типа
    if (allBuns.length > 0) {
      TestIngredientsHelper.verifyIngredientPresence(allBuns[0]);
    }
    if (allMains.length > 0) {
      TestIngredientsHelper.verifyIngredientPresence(allMains[0]);
    }
    if (allSauces.length > 0) {
      TestIngredientsHelper.verifyIngredientPresence(allSauces[0]);
    }
  });

  it('should demonstrate ingredient modal functionality with fixture data', () => {
    if (testIngredients.bun) {
      // Кликаем по ингредиенту
      TestIngredientsHelper.clickIngredient(testIngredients.bun);
      
      // Ждем появления модального окна
      cy.wait(2000);
      
      // Проверяем URL
      TestIngredientsHelper.verifyIngredientModalUrl(testIngredients.bun);
      
      // Проверяем содержимое модального окна
      TestIngredientsHelper.verifyIngredientModalContent(testIngredients.bun);
    }
  });
});