import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchOrderByNumber } from '../../services/slices/feedSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const orderData = useSelector((state) => {
    const orders = location.pathname.startsWith('/profile')
      ? state.profileOrders.orders
      : state.feed.orders;

    const orderFromList = orders.find((item) => item.number === Number(number));

    return orderFromList || state.feed.currentOrder;
  });

  useEffect(() => {
    if (number && !orderData) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderData]);
  const allIngredients = useSelector((state) => state.ingredients.ingredients);
  const ingredients: TIngredient[] = orderData?.ingredients
    .map((id) => allIngredients.find((item) => item._id === id))
    .filter(Boolean) as TIngredient[];

  /* Готовим данные для отображения */
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

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
