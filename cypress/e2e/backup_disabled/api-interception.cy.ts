import { TestIngredientsHelper, AuthHelper } from '../support/test-helpers';

describe('API Interception for Ingredients', () => {
  let ingredientsData: any;

  beforeEach(() => {
    cy.loadTestIngredients().then((data) => {
      ingredientsData = data;
    });
  });

  it('should intercept ingredients request and return mock data', () => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('@getIngredients').then((interception: any) => {
      AuthHelper.verifyIngredientsApiResponse(interception, ingredientsData.length);
    });
  });

  it('should return correct mock data structure', () => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('@getIngredients').then((interception: any) => {
      AuthHelper.verifyIngredientsApiResponse(interception);
      const firstIngredient = interception.response?.body.data[0];
      AuthHelper.verifyIngredientStructure(firstIngredient);
    });
  });

  it('should verify mock data structure from fixture', () => {
    expect(ingredientsData).to.be.an('array');
    expect(ingredientsData.length).to.be.greaterThan(0);
    
    ingredientsData.forEach((ingredient: any) => {
      AuthHelper.verifyIngredientStructure(ingredient);
    });
    
    const types = ingredientsData.map((ing: any) => ing.type);
    expect(types).to.include('bun');
    expect(types).to.include('main');
    expect(types).to.include('sauce');
  });
});