import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();
  const error = useSelector((state) => state.user.error);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    dispatch(
      loginUser({
        email: email,
        password: password
      })
    );
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
