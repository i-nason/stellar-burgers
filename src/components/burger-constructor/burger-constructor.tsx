import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  resetConstructor,
  orderBurger,
  clearOrderModalData
} from '../../services/slices/burgerConstructorSlice';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const BurgerConstructor: FC = () => {
  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    (state) => state.burgerConstructor
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onOrderClick = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }
    if (!bun || orderRequest) return;
    const ingredientIds = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    dispatch(orderBurger(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(resetConstructor());
      })
      .catch(() => {});
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
