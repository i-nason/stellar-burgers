import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { loginUserApi } from '../../utils/burger-api';
import { fetchUser } from '../../services/slices/userSlice';
import { setCookie } from '../../utils/cookie';
import { useForm } from '../../hooks/useForm';
import { LoginUI } from '../../components/ui/pages/login/login';

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
    <LoginUI
      email={values.email}
      setEmail={(value) =>
        setValues((prev) => ({
          ...prev,
          email: typeof value === 'function' ? value(prev.email) : value
        }))
      }
      password={values.password}
      setPassword={(value) =>
        setValues((prev) => ({
          ...prev,
          password: typeof value === 'function' ? value(prev.password) : value
        }))
      }
      errorText={error || ''}
      handleSubmit={handleSubmit}
    />
  );
};

export default Login;
