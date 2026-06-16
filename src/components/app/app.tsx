import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader, OrderInfo, Modal, IngredientDetails } from '@components';
import { ProtectedRoute } from '../protected-route';
import { Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

const App = () => {
  /** TODO: взять переменные из стора */
  const items = useSelector((state) => state.ingredients);
  const isIngredientsLoading = items.isIngredientsLoading;
  const ingredients = items.ingredients;
  const error = items.error;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const navigate = useNavigate(); //чтобы закрыть модалку и вернуться на предыдущий адрес

  return (
    <>
      <div className={styles.app}>
        <AppHeader />
        <Routes location={backgroundLocation || location}>
          <Route
            path='/'
            element={
              isIngredientsLoading ? (
                <Preloader />
              ) : error ? (
                <div
                  className={`${styles.error} text text_type_main-medium pt-4`}
                >
                  {error}
                </div>
              ) : ingredients.length > 0 ? (
                <ConstructorPage />
              ) : (
                <div
                  className={`${styles.title} text text_type_main-medium pt-4`}
                >
                  Нет игредиентов
                </div>
              )
            }
          />
          <Route path='/feed' element={<Feed />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/login' element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/register' element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/forgot-password' element={<ForgotPassword />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/reset-password' element={<ResetPassword />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/profile/orders' element={<ProfileOrders />} />
          </Route>

          <Route path='*' element={<NotFound404 />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/profile/orders/:number' element={<OrderInfo />} />
          </Route>
        </Routes>

        {backgroundLocation && (
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Routes>
        )}

        {backgroundLocation && (
          <Routes>
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='Ингридиенты' onClose={() => navigate(-1)}>
                  <IngredientDetails />
                </Modal>
              }
            />
          </Routes>
        )}

        {backgroundLocation && (
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route
                path='/profile/orders/:number'
                element={
                  <Modal title='Заказ' onClose={() => navigate(-1)}>
                    <OrderInfo />
                  </Modal>
                }
              />
            </Route>
          </Routes>
        )}
      </div>
    </>
  );
};

export default App;
