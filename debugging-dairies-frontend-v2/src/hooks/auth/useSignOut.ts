import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '@/apis/auth/authApi';
import { removeUserPayload } from '@/utils/localStorageUtils';
import useToast from '@/hooks/component/useToast';

export const useSignOut = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      // 1. Call the API to clear the HttpOnly cookie on the server
      const response = await authApi.signOut();

      // 2. Clear user data from LocalStorage
      removeUserPayload();

      // 3. Show success message
      showSuccess(response.message || 'Signed out successfully.');

      // 4. Redirect to landing page or auth page
      navigate('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to sign out. Please try again.';

      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSignOut,
    loading,
  };
};
