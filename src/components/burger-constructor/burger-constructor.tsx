import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  createOrderThunk,
  clearModal
} from '../../services/slices/constructorSlice';
import { useNavigate } from 'react-router';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector((state) => state.burgerConstructor);

  const user = useSelector((state) => state.user.user);
  const orderRequest = constructorItems.orderRequest;

  const orderModalData = constructorItems.orderModalData;
  const navigate = useNavigate();
  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrderThunk(ingredientsIds));
  };
  const closeOrderModal = () => {
    dispatch(clearModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
