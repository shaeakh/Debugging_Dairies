import { useState } from 'react';
import userApi from '@/apis/user/userApi';
import type { UpdateUserPayload, UserUpdate } from '@/types/api/userTypes';
import useToast from '@/hooks/component/useToast';

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const updateUser = async (
    id: number,
    data: UpdateUserPayload,
    onSuccess?: () => void
  ) => {
    setLoading(true);
    try {
      // API call
      const response = await userApi.update(id, data as UserUpdate);
      showSuccess('Profile updated successfully!');

      if (onSuccess) onSuccess();

      return response;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showError(
        error?.response?.data?.message ||
          'Failed to update profile. Email or Username might be taken.'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading };
};
