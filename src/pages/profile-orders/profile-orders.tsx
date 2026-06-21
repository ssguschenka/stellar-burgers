import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchOrders } from '../../services/slices/profileOrdersslice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((state) => state.profileOrders.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
