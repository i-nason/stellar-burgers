import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useNavigate } from 'react-router-dom';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  return (
    <AppHeaderUI
      userName=''
      onConstructorClick={() => navigate('/')}
      onFeedClick={() => navigate('/feed')}
      onProfileClick={() => navigate('/profile')}
    />
  );
};
