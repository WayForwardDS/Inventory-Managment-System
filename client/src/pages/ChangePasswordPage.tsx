import { Button, Flex, Input } from 'antd';
import { useState } from 'react';
import { toast } from 'sonner';
import { useChangePasswordMutation } from '../redux/features/authApi';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Container = styled(Flex)`
  height: calc(100vh - 10rem);
  background: linear-gradient(135deg, #452F6F, #131B2A);
`;

const FormContainer = styled(motion.div)`
  max-width: 500px;
  min-width: 350px;
  padding: 2rem;
  border-radius: 0.4rem;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledInput = styled(Input.Password)`
  margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
`;

const ChangePasswordPage = () => {
  const [changePassword] = useChangePasswordMutation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must have 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Password and confirm password does not match');
      return;
    }

    const payload = {
      oldPassword,
      newPassword,
      confirmPassword,
    };

    try {
      const toastId = toast.loading('Changing password...');
      const res = await changePassword(payload).unwrap();

      if (res.success) {
        toast.success('Password changed successfully', { id: toastId });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        navigate('/profile');
      }
    } catch (error: any) {
      toast.error(error.data.message, { id: error.data.statusCode });
    }
  };

  return (
    <Container justify='center' align='center'>
      <FormContainer
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Flex vertical gap={6}>
          <StyledInput
            size='large'
            placeholder='Old Password'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <StyledInput
            size='large'
            placeholder='New Password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <StyledInput
            size='large'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <StyledButton type='primary' onClick={handleSubmit}>
            Change Password
          </StyledButton>
          <StyledButton type='default' onClick={() => navigate('/profile')}>
            <ArrowLeftOutlined /> Go Back
          </StyledButton>
        </Flex>
      </FormContainer>
    </Container>
  );
};

export default ChangePasswordPage;