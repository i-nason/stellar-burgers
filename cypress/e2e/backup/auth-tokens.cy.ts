import { AuthHelper } from '../support/test-helpers';

describe('Auth Tokens and API Mocks', () => {
  let userData: any;

  beforeEach(() => {
    // Загружаем моковые данные пользователя
    cy.fixture('user').then((data) => {
      userData = data;
    });
  });

  it('should verify token structure and formats', () => {
    // Используем комплексную проверку токенов
    AuthHelper.verifyUserDataStructure(userData);
    AuthHelper.verifyTokenFormats(userData);
  });

  it('should verify user data structure and security', () => {
    // Комплексная проверка пользователя и безопасности
    AuthHelper.verifyUserDataStructure(userData);
    AuthHelper.verifyUserDataTypes(userData);
    AuthHelper.verifyUserDataSecurity(userData);
  });

  it('should setup auth API interceptions correctly', () => {
    // Настраиваем API перехваты через хелпер
    AuthHelper.setupAuthApiMocks();
    
    // Проверяем, что перехваты настроены
    AuthHelper.verifyAuthApiMocksSetup();
    
    // Дополнительно проверяем данные пользователя
    AuthHelper.verifyUserDataStructure(userData);
  });

  it('should verify comprehensive token validation', () => {
    // Расширенная проверка токенов
    AuthHelper.verifyTokenFormats(userData);
    
    // Дополнительные проверки безопасности токенов
    const { accessToken, refreshToken } = userData;
    
    // Проверяем, что токены не содержат пробелов в начале/конце
    expect(accessToken.trim()).to.equal(accessToken);
    expect(refreshToken.trim()).to.equal(refreshToken);
    
    // Проверяем, что токены не пустые после trim
    expect(accessToken.trim().length).to.be.greaterThan(10);
    expect(refreshToken.trim().length).to.be.greaterThan(5);
  });

  it('should verify user email format and domain', () => {
    // Расширенная проверка email
    const email = userData.user.email;
    AuthHelper.verifyUserEmailFormat(email);
    
    // Дополнительные проверки email
    expect(email.toLowerCase()).to.equal(email); // Email в нижнем регистре
    expect(email).to.not.include(' '); // Нет пробелов
    expect(email.split('@')).to.have.length(2); // Ровно один @
  });

  it('should perform complete authentication data validation', () => {
    // Полная комплексная проверка всех данных авторизации
    AuthHelper.verifyUserDataStructure(userData);
    AuthHelper.verifyUserDataTypes(userData);
    AuthHelper.verifyUserEmailFormat(userData.user.email);
    AuthHelper.verifyTokenFormats(userData);
    AuthHelper.verifyUserDataSecurity(userData);
    
    // Проверяем целостность данных
    expect(userData.user.name.length).to.be.greaterThan(0);
    expect(userData.user.email.length).to.be.greaterThan(5);
    
    // Проверяем, что нет лишних полей в корне объекта
    const allowedFields = ['user', 'accessToken', 'refreshToken'];
    const actualFields = Object.keys(userData);
    actualFields.forEach(field => {
      expect(allowedFields).to.include(field);
    });
  });

  it('should validate auth API mock setup with comprehensive checks', () => {
    // Настраиваем и проверяем API моки
    AuthHelper.setupAuthApiMocks();
    AuthHelper.verifyAuthApiMocksSetup();
    
    // Проверяем, что данные пользователя соответствуют API ответам
    AuthHelper.verifyUserDataStructure(userData);
    AuthHelper.verifyTokenFormats(userData);
    
    // Проверяем совместимость с нашими API моками
    expect(userData).to.have.all.keys('user', 'accessToken', 'refreshToken');
  });
}); 