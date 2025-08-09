import { AuthHelper } from '../support/test-helpers';

describe('Order Data Mock', () => {
  let orderData: any;

  beforeEach(() => {
    // Загружаем моковые данные заказа
    cy.fixture('order').then((data) => {
      orderData = data;
    });
  });

  it('should load order mock data correctly', () => {
    // Проверяем базовую структуру данных заказа
    AuthHelper.verifyOrderDataStructure(orderData);
  });

  it('should have valid order structure and components', () => {
    // Комплексная проверка структуры заказа
    AuthHelper.verifyOrderDataStructure(orderData);
    
    const order = orderData.order;
    AuthHelper.verifyOrderStatus(order.status);
    AuthHelper.verifyOrderNumber(order.number);
  });

  it('should have valid order status', () => {
    // Расширенная проверка статуса заказа
    const status = orderData.order.status;
    AuthHelper.verifyOrderStatus(status);
  });

  it('should have valid order number with constraints', () => {
    // Улучшенная проверка номера заказа
    const number = orderData.order.number;
    AuthHelper.verifyOrderNumber(number);
  });

  it('should have valid ingredients in order', () => {
    // Проверяем ингредиенты с помощью хелперов
    const ingredients = orderData.order.ingredients;
    AuthHelper.verifyOrderIngredients(ingredients);
  });

  it('should have valid timestamps and date logic', () => {
    // Расширенная проверка временных меток
    const order = orderData.order;
    AuthHelper.verifyOrderTimestamps(order.createdAt, order.updatedAt);
  });

  it('should meet security requirements', () => {
    // Проверяем безопасность данных заказа
    AuthHelper.verifyOrderDataSecurity(orderData);
  });

  it('should have data integrity and consistency', () => {
    // Проверяем целостность данных заказа
    AuthHelper.verifyOrderDataIntegrity(orderData);
  });

  it('should perform comprehensive order validation', () => {
    // Комплексная проверка всех аспектов заказа
    AuthHelper.verifyOrderDataStructure(orderData);
    
    const order = orderData.order;
    AuthHelper.verifyOrderStatus(order.status);
    AuthHelper.verifyOrderNumber(order.number);
    AuthHelper.verifyOrderIngredients(order.ingredients);
    AuthHelper.verifyOrderTimestamps(order.createdAt, order.updatedAt);
    AuthHelper.verifyOrderDataSecurity(orderData);
    AuthHelper.verifyOrderDataIntegrity(orderData);
    
    // Дополнительные проверки
    expect(order.name.length).to.be.greaterThan(0);
    expect(orderData.success).to.be.true;
    expect(order._id.length).to.be.greaterThan(10);
  });
}); 