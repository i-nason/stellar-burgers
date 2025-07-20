import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { registerUserApi } from '../../utils/burger-api';
import { fetchUser } from '../../services/slices/userSlice';
import { setCookie } from '../../utils/cookie';
import { RegisterUI } from '@ui-pages';

function validateEmail(email: string) {
  // Простая валидация email
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Введите корректный e-mail');
      return;
    }
    registerUserApi({ email, password, name: userName })
      .then((data) => {
        const token = data.accessToken.startsWith('Bearer ')
          ? data.accessToken
          : `Bearer ${data.accessToken}`;
        setCookie('accessToken', token);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', data.refreshToken);
        dispatch({
          type: 'user/fetchUser/fulfilled',
          payload: { name: userName, email }
        });
        navigate('/');
      })
      .catch((err) => {
        if (err?.message && err.message.includes('User already exists')) {
          setError('Пользователь с таким e-mail уже зарегистрирован');
        } else {
          setError(err?.message || 'Ошибка регистрации');
        }
      });
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
