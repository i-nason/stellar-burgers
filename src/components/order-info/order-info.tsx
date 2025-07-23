import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import styles from '../app/app.module.css';
import {
  fetchFeeds,
  fetchOrderByNumber
} from '../../services/slices/feedSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

interface OrderInfoProps {
  isModal?: boolean;
}

export const OrderInfo: FC<OrderInfoProps> = ({ isModal }) => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const {
    orders,
    isLoading,
    error,
    currentOrder,
    currentOrderLoading,
    currentOrderError
  } = useSelector((state) => state.feed);
  const { ingredients } = useSelector((state) => state.ingredients);

  // Загружаем ленту заказов, если пусто
  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, orders.length]);

  // Если заказа нет в orders, пробуем загрузить по номеру
  useEffect(() => {
    if (number && !orders.find((order) => String(order.number) === number)) {
      dispatch(fetchOrderByNumber(number));
    }
  }, [dispatch, number, orders]);

  const orderData =
    orders.find((order) => String(order.number) === number) ||
    currentOrder ||
    null;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (
    isLoading ||
    currentOrderLoading ||
    (!orders.length && !currentOrder) ||
    !ingredients.length
  ) {
    return <Preloader />;
  }

  if (error || currentOrderError) {
    return <div style={{ color: 'red' }}>{error || currentOrderError}</div>;
  }

  if (!orderInfo) {
    return <div style={{ color: 'red' }}>Заказ не найден</div>;
  }

  if (isModal) {
    return <OrderInfoUI orderInfo={orderInfo} />;
  }

  return (
    <div className={styles.detailPageWrap}>
      <OrderInfoUI orderInfo={orderInfo} />
    </div>
  );
};
