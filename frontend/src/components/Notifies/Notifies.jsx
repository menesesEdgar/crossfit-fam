import { toast } from 'react-hot-toast';

/**
 * Shows a notification.
 *
 * @param {'success' | 'error' | 'warning' | 'info' | 'default'} type - The type of notification.
 * @param {string} message - The message to display.
 */
const Notifies = (type, message) => {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'warning':
      toast.warning(message);
      break;
    case 'info':
      toast(message); // 'react-hot-toast' no tiene un toast.info, por lo que usamos el genérico
      break;
    default:
      toast(message);
      break;
  }
};

export default Notifies;
