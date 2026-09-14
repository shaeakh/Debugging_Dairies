import { useState } from 'react';
import authApi from '@/apis/auth/authApi';
import type { ChangePasswordRequest } from '@/types/api/authTypes';
import useToast from '@/hooks/component/useToast';

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const changePassword = async (
    data: ChangePasswordRequest,
    onSuccess?: () => void
  ) => {
    setLoading(true);
    try {
      const response = await authApi.changePassword(data);
      showSuccess(response.message || 'Password changed successfully!');
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showError(
        error?.response?.data?.message ||
          'Failed to change password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading };
};
