import { useState } from 'react';
import authApi from '@/apis/auth/authApi';
import type { VerifyOtpRequest } from '@/types/api/authTypes';
import useToast from '@/hooks/component/useToast';

export const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const verifyOtp = async (data: VerifyOtpRequest, onSuccess?: () => void) => {
    setLoading(true);
    try {
      const response = await authApi.verifyOtp(data);
      showSuccess(response.message || 'OTP verified successfully!');
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showError(
        error?.response?.data?.message ||
          'Invalid or expired OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return { verifyOtp, loading };
};
