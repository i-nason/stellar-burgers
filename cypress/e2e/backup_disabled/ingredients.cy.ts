import { TestIngredientsHelper, AuthHelper } from '../support/test-helpers';

describe('Ingredients Mock Data', () => {
  let ingredientsData: any;

  beforeEach(() => {
    // Загружаем данные ингредиентов через наш хелпер
    cy.loadTestIngredients().then((data) => {
      ingredientsData = data;
    });
  });

  it('should load ingredients mock data correctly', () => {
    // Проверяем базовую структуру данных
    expect(ingredientsData).to.be.an('array');
    expect(ingredientsData.length).to.be.greaterThan(0);

    // Проверяем структуру первого ингредиента с помощью хелпера
    const firstIngredient = ingredientsData[0];
    AuthHelper.verifyIngredientStructure(firstIngredient);

    // Проверяем, что у нас есть разные типы ингредиентов
    const types = ingredientsData.map((ing: any) => ing.type);
    expect(types).to.include('bun');
    expect(types).to.include('main');
    expect(types).to.include('sauce');
  });

  it('should have valid ingredient data structure and types', () => {
    // Проверяем каждый ингредиент с помощью хелпера
    ingredientsData.forEach((ingredient: any) => {
      AuthHelper.verifyIngredientStructure(ingredient);
      
      // Дополнительные проверки типов данных
      expect(ingredient._id).to.be.a('string');
      expect(ingredient.name).to.be.a('string');
      expect(ingredient.type).to.be.a('string');
      expect(ingredient.price).to.be.a('number');
      expect(ingredient.calories).to.be.a('number');
      expect(ingredient.proteins).to.be.a('number');
      expect(ingredient.fat).to.be.a('number');
      expect(ingredient.carbohydrates).to.be.a('number');
      expect(ingredient.image).to.be.a('string');
      expect(ingredient.image_mobile).to.be.a('string');
      expect(ingredient.image_large).to.be.a('string');

      // Проверяем, что цены и калории положительные
      expect(ingredient.price).to.be.greaterThan(0);
      expect(ingredient.calories).to.be.greaterThan(0);
      
      // Проверяем допустимые типы ингредиентов
      expect(['bun', 'main', 'sauce']).to.include(ingredient.type);
    });
  });

  it('should have specific ingredient categories with correct counts', () => {
    // Проверяем количество ингредиентов каждого типа
    const bunIngredients = TestIngredientsHelper.getIngredientsByType('bun');
    const mainIngredients = TestIngredientsHelper.getIngredientsByType('main');
    const sauceIngredients = TestIngredientsHelper.getIngredientsByType('sauce');

    expect(bunIngredients.length).to.be.greaterThan(0);
    expect(mainIngredients.length).to.be.greaterThan(0);
    expect(sauceIngredients.length).to.be.greaterThan(0);

    // Проверяем, что общее количество совпадает
    expect(bunIngredients.length + mainIngredients.length + sauceIngredients.length)
      .to.equal(ingredientsData.length);
  });
}); 