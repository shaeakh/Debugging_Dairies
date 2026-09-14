import { useEffect, useState } from 'react';
import userApi from '@/apis/user/userApi';
import { useChangePassword } from '@/hooks/auth/useChangePassword';
import { useSignOut } from '@/hooks/auth/useSignOut';
import { useVerifyOtp } from '@/hooks/auth/useVerifyOtp';
import useToast from '@/hooks/component/useToast';
import { useFetchProfile } from '@/hooks/profile/useFetchProfile';
import { useUpdateUser } from '@/hooks/user/useUpdateUser';

// ─── setUserPayload ইমপোর্ট করা হলো ───
import { getUserPayload, setUserPayload } from '@/utils/localStorageUtils';
import type { UserUpdate } from '@/types/api/userTypes';

export const useSettings = () => {
  const { showSuccess, showError } = useToast();
  const currentUser = getUserPayload();

  // ─── Hooks ───
  const {
    profile,
    refetch,
    loading: profileLoading,
  } = useFetchProfile(currentUser?.username);
  const { updateUser, loading: isProfileSaving } = useUpdateUser();
  const { changePassword, loading: isPassSubmitting } = useChangePassword();
  const { verifyOtp, loading: isOtpVerifying } = useVerifyOtp();
  const { handleSignOut } = useSignOut();

  // ─── States ───
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
  });

  const [profilePassDialog, setProfilePassDialog] = useState(false);
  const [profilePassword, setProfilePassword] = useState('');

  const [changePassDialog, setChangePassDialog] = useState(false);
  const [passForm, setPassForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [otpDialog, setOtpDialog] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Sync Profile Data ───
  useEffect(() => {
    if (profile) {
      const timer = setTimeout(() => {
        setFormData({
          name: profile.name || '',
          username: profile.username || '',
          email: profile.email || '',
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  const hasChanges = Boolean(
    profile &&
    (formData.name !== profile.name ||
      formData.username !== profile.username ||
      formData.email !== profile.email)
  );

  // ─── Handlers ───
  const handleProfileUpdate = async () => {
    if (!profilePassword.trim() || !currentUser || !profile) return;

    const isNameChanged = formData.name !== profile.name;
    const isUsernameChanged = formData.username !== profile.username;
    const isEmailChanged = formData.email !== profile.email;

    const updatedFields: UserUpdate & { currentPassword?: string } = {
      currentPassword: profilePassword,
    };

    if (isNameChanged) updatedFields.name = formData.name;
    if (isUsernameChanged) updatedFields.username = formData.username;
    if (isEmailChanged) updatedFields.email = formData.email;

    try {
      await updateUser(currentUser.id, updatedFields, () => {
        setProfilePassDialog(false);
        setProfilePassword('');
      });

      // ─── Local Storage Sync Logic ───
      // আমরা পুরনো পেলোডের সাথে নতুন আপডেট হওয়া ফিল্ডগুলো মার্জ করে দিচ্ছি
      setUserPayload({
        ...currentUser,
        name: updatedFields.name || currentUser.name,
        username: updatedFields.username || currentUser.username,
        email: updatedFields.email || currentUser.email,
      });

      // যদি ইউজারনেম পরিবর্তন হয়, তবে পুরো পেজ রিলোড করা ভালো
      // যাতে NavBar-এর প্রোফাইল লিংক সিঙ্ক হয়ে যায়
      if (isUsernameChanged) {
        window.location.reload();
      }
    } catch {
      // Error handling is managed by useUpdateUser hook
    } finally {
      refetch();
    }
  };

  const handlePasswordSubmit = async () => {
    if (passForm.new !== passForm.confirm) {
      showError('New passwords do not match!');
      return;
    }
    await changePassword(
      { currentPassword: passForm.current, newPassword: passForm.new },
      () => {
        setChangePassDialog(false);
        setOtpDialog(true);
      }
    );
  };

  const handleOtpSubmit = async () => {
    if (!otpCode.trim()) return;
    await verifyOtp({ code: otpCode, type: 'PASSWORD_RESET' }, () => {
      setOtpDialog(false);
      setOtpCode('');
      setPassForm({ current: '', new: '', confirm: '' });
    });
    refetch();
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    setIsDeleting(true);
    try {
      await userApi.delete(currentUser.id);
      showSuccess('Account deleted.');
      handleSignOut();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showError(error?.response?.data?.message || 'Delete failed.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    profileLoading,
    formData,
    setFormData,
    hasChanges,

    profilePassDialog,
    setProfilePassDialog,
    profilePassword,
    setProfilePassword,
    handleProfileUpdate,
    isProfileSaving,

    changePassDialog,
    setChangePassDialog,
    passForm,
    setPassForm,
    handlePasswordSubmit,
    isPassSubmitting,

    otpDialog,
    setOtpDialog,
    otpCode,
    setOtpCode,
    handleOtpSubmit,
    isOtpVerifying,

    deleteDialog,
    setDeleteDialog,
    handleDeleteAccount,
    isDeleting,
  };
};
