import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { loginUserApi } from '../../utils/burger-api';
import { fetchUser } from '../../services/slices/userSlice';
import { setCookie } from '../../utils/cookie';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    loginUserApi({ email, password })
      .then((data) => {
        const token = data.accessToken.startsWith('Bearer ')
          ? data.accessToken
          : `Bearer ${data.accessToken}`;
        setCookie('accessToken', token);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', data.refreshToken);
        dispatch(fetchUser()).finally(() => navigate('/'));
      })
      .catch((err) => {
        setError(err?.message || 'Ошибка авторизации');
      });
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
