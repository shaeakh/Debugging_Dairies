import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '@/apis/auth/authApi';
import type { SignInRequest } from '@/types/api/authTypes';
import { setUserPayload } from '@/utils/localStorageUtils';
import useToast from '@/hooks/component/useToast';

export const useSignIn = () => {
  const navigate = useNavigate();
  const { showError } = useToast();

  const [form, setForm] = useState<SignInRequest>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.signIn(form);
      setUserPayload(response.payload);
      navigate('/home');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to sign in. Please try again.';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleChange,
    handleSubmit,
  };
};
