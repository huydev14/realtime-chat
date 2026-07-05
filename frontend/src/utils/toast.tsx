import * as React from 'react';
import {
  useId,
  Toaster,
  useToastController,
  Toast,
  ToastTitle,
} from '@fluentui/react-components';

type ToastType = 'success' | 'error' | 'info' | 'warning';

let addToast: (message: string, intent: ToastType) => void = () => {
  console.warn('Toaster not initialized');
};

export const toast = {
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  info: (message: string) => addToast(message, 'info'),
  warning: (message: string) => addToast(message, 'warning'),
};

export const GlobalToaster = () => {
  const toasterId = useId('global-toaster');
  const { dispatchToast } = useToastController(toasterId);

  React.useEffect(() => {
    addToast = (message: string, intent: ToastType) => {
      dispatchToast(
        <Toast>
          <ToastTitle>{message}</ToastTitle>
        </Toast>,
        { intent }
      );
    };
  }, [dispatchToast]);

  return <Toaster toasterId={toasterId} position="top-end" />;
};
