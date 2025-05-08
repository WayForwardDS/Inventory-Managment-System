import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
  switch (type) {
    case 'success': toast.success(message); break;
    case 'error': toast.error(message); break;
    case 'warning': toast.warning(message); break;
  }
};

export const ToastProvider = () => (
  <ToastContainer position="bottom-right" autoClose={3000} />
);