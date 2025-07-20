import { FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { orderBurgerApi } from '../../utils/burger-api';
import { resetConstructor } from '../../services/slices/burgerConstructorSlice';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const BurgerConstructor: FC = () => {
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const dispatch = useDispatch();

  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<any>(null);

  const navigate = useNavigate();

  const onOrderClick = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }
    if (!bun || orderRequest) return;
    setOrderRequest(true);
    const ingredientIds = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    require('../../utils/burger-api')
      .orderBurgerApi(ingredientIds)
      .then((data: { order: any }) => {
        setOrderModalData(data.order);
        dispatch(resetConstructor());
        dispatch(fetchProfileOrders());
        dispatch(fetchFeeds());
      })
      .catch(() => {
        setOrderModalData(null);
      })
      .finally(() => setOrderRequest(false));
  };
  const closeOrderModal = () => {
    setOrderModalData(null);
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
