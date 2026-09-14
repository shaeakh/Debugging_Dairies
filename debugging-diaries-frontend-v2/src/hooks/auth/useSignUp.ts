import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '@/apis/auth/authApi';
import type { SignUpRequest } from '@/types/api/authTypes';
import useToast from '@/hooks/component/useToast';

export const useSignUp = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const [form, setForm] = useState<SignUpRequest>({
    username: '',
    name: '',
    email: '',
    password: '',
  });

  // UI States
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.signUp(form);

      showSuccess(
        response.message ||
          'Account created successfully! Please check your email to confirm.'
      );
      setForm({ username: '', name: '', email: '', password: '' });
      setTimeout(() => {
        navigate('/home');
      }, 3000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to create account. Please try again.';

      showError(errorMessage);
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
