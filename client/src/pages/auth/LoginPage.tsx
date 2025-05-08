import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import toastMessage from '../../lib/toastMessage';
import { useLoginMutation } from '../../redux/features/authApi';
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../redux/services/authSlice';
import decodeToken from '../../utils/decodeToken';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import './LoginPage.css';

const LoginPage = () => {
  const [userLogin] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({});

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading('Logging in...');
    try {
      const res = await userLogin(data).unwrap();

      if (res.statusCode === 200) {
        const user = decodeToken(res.data.token);
        dispatch(loginUser({ token: res.data.token, user }));
        navigate('/');
        toast.success('Successfully logged in!', { id: toastId });
      }
    } catch (error: any) {
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img
          src="./src/assets/REVONSPIRE.png"
          width="800px"
          height="auto"
          style={{ display: 'block', margin: '0 auto' }}
          alt="Way Forward"
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            {...register('email', { required: true })}
            placeholder="Your Email*"
            className={`input-field ${errors['email'] ? 'input-field-error' : ''}`}
          />

          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Your Password*"
              className={`input-field ${errors['password'] ? 'input-field-error' : ''}`}
              {...register('password', { required: true })}
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          </div>

          <button type="submit" className="font-bold submit-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
