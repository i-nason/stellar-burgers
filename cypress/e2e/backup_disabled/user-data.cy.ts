import { AuthHelper } from '../support/test-helpers';

describe('User Data Mock', () => {
  let userData: any;

  beforeEach(() => {
    // Загружаем моковые данные пользователя
    cy.fixture('user').then((data) => {
      userData = data;
    });
  });

  it('should load user mock data correctly', () => {
    // Проверяем базовую структуру данных с помощью хелпера
    AuthHelper.verifyUserDataStructure(userData);
  });

  it('should have valid user data types and structure', () => {
    // Проверяем структуру и типы данных
    AuthHelper.verifyUserDataStructure(userData);
    AuthHelper.verifyUserDataTypes(userData);
  });

  it('should have valid user email format', () => {
    // Проверяем формат email с расширенной валидацией
    const email = userData.user.email;
    AuthHelper.verifyUserEmailFormat(email);
  });

  it('should have valid token formats', () => {
    // Проверяем форматы токенов с улучшенной валидацией
    AuthHelper.verifyTokenFormats(userData);
  });

  it('should meet security requirements', () => {
    // Проверяем безопасность данных пользователя
    AuthHelper.verifyUserDataSecurity(userData);
  });

  it('should have consistent data across all checks', () => {
    // Комплексная проверка всех аспектов данных пользователя
    AuthHelper.verifyUserDataStructure(userData);
    AuthHelper.verifyUserDataTypes(userData);
    AuthHelper.verifyUserEmailFormat(userData.user.email);
    AuthHelper.verifyTokenFormats(userData);
    AuthHelper.verifyUserDataSecurity(userData);
    
    // Дополнительные проверки целостности
    expect(userData.user.name.trim()).to.not.be.empty;
    expect(userData.user.email.toLowerCase()).to.equal(userData.user.email);
  });
}); 