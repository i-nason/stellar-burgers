import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export type TAppHeaderUIPropsExtended = TAppHeaderUIProps & {
  onConstructorClick: () => void;
  onFeedClick: () => void;
  onProfileClick: () => void;
};

export const AppHeaderUI: FC<TAppHeaderUIPropsExtended> = ({
  userName,
  onConstructorClick,
  onFeedClick,
  onProfileClick
}) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <div
          onClick={onConstructorClick}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <BurgerIcon type={'primary'} />
          <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
        </div>
        <div
          onClick={onFeedClick}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ListIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </div>
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <div
        className={styles.link_position_last}
        onClick={onProfileClick}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <ProfileIcon type={'primary'} />
        <p className='text text_type_main-default ml-2'>
          {userName || 'Личный кабинет'}
        </p>
      </div>
    </nav>
  </header>
);
