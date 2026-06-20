import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/registerSlice';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();
  const error = useSelector((state) => state.registerUser.error);
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const result = await dispatch(
      registerUser({
        email: email,
        name: userName,
        password: password
      })
    );

    if (registerUser.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
