import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { loginUserApi } from '../../utils/burger-api';
import { fetchUser } from '../../services/slices/userSlice';
import { setCookie } from '../../utils/cookie';
import { useForm } from '../../hooks/useForm';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { values, handleChange, setValues } = useForm({
    email: '',
    password: ''
  });
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUserApi({ email: values.email, password: values.password })
      .then((data) => {
        const token = data.accessToken.split('Bearer ')[1];
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
    <form onSubmit={handleSubmit}>
      <input
        type='email'
        name='email'
        value={values.email}
        onChange={handleChange}
        placeholder='E-mail'
      />
      <input
        type='password'
        name='password'
        value={values.password}
        onChange={handleChange}
        placeholder='Пароль'
      />
      <button type='submit'>Войти</button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default Login;
