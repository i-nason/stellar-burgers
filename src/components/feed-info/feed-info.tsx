import { FC } from 'react';
import { useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status?: string): number[] =>
  status
    ? orders
        .filter((item) => item.status === status)
        .map((item) => item.number)
        .slice(0, 20)
    : orders.map((item) => item.number).slice(0, 20);

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector((state) => state.feed);

  const readyOrders = getOrders(orders, 'done');
  // В работе — только pending
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
