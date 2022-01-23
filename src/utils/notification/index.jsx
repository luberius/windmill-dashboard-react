import { toast } from 'react-hot-toast';

export const showErrorNotification = (message) => {
  toast.error(message);
};

export const showSuccessNotification = (message) => {
  toast.success(message);
};
