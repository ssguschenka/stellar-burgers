import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { useEffect } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((state) => state.feed.orders);
  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
