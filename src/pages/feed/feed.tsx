import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.feed);

  // Фильтруем только заказы в работе

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading) return <Preloader />;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
