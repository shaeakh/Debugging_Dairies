import type { ReactNode } from 'react';
import { LuLoaderCircle, LuTrash2 } from 'react-icons/lu';

import { GeneralSection } from '@/components/settings/GeneralSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { useSettings } from '@/hooks/component/useSettings';

const SettingsPage = () => {
  const {
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
  } = useSettings();

  if (profileLoading) {
    return (
      <div className="p-10 text-center text-muted-foreground animate-pulse">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and security.
        </p>
      </div>

      <GeneralSection
        formData={formData}
        setFormData={setFormData}
        hasChanges={hasChanges}
        onSave={() => setProfilePassDialog(true)}
      />

      <SecuritySection
        onChangePassword={() => setChangePassDialog(true)}
        onDeleteAccount={() => setDeleteDialog(true)}
      />

      {/* 1. Profile Update Verification Dialog */}
      {profilePassDialog && (
        <DialogWrapper
          title="Verify Identity"
          description="Enter password to save changes."
          onClose={() => setProfilePassDialog(false)}
        >
          <input
            type="password"
            placeholder="Current Password"
            value={profilePassword}
            onChange={(e) => setProfilePassword(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm mb-6"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setProfilePassDialog(false)}
              className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleProfileUpdate}
              disabled={isProfileSaving || !profilePassword}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg flex items-center gap-2"
            >
              {isProfileSaving && (
                <LuLoaderCircle className="w-4 h-4 animate-spin" />
              )}{' '}
              Confirm
            </button>
          </div>
        </DialogWrapper>
      )}

      {/* 2. Change Password Dialog */}
      {changePassDialog && (
        <DialogWrapper
          title="Change Password"
          description="Enter your current and new password."
          onClose={() => setChangePassDialog(false)}
        >
          <div className="space-y-4 mb-6">
            <input
              type="password"
              placeholder="Current Password"
              value={passForm.current}
              onChange={(e) =>
                setPassForm({ ...passForm, current: e.target.value })
              }
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
            />
            <input
              type="password"
              placeholder="New Password"
              value={passForm.new}
              onChange={(e) =>
                setPassForm({ ...passForm, new: e.target.value })
              }
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passForm.confirm}
              onChange={(e) =>
                setPassForm({ ...passForm, confirm: e.target.value })
              }
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setChangePassDialog(false)}
              className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordSubmit}
              disabled={
                isPassSubmitting ||
                !passForm.current ||
                !passForm.new ||
                !passForm.confirm
              }
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg flex items-center gap-2"
            >
              {isPassSubmitting && (
                <LuLoaderCircle className="w-4 h-4 animate-spin" />
              )}{' '}
              Request OTP
            </button>
          </div>
        </DialogWrapper>
      )}

      {/* 3. OTP Dialog */}
      {otpDialog && (
        <DialogWrapper
          title="Enter OTP"
          description="Check your email for the verification code."
          onClose={() => setOtpDialog(false)}
        >
          <input
            type="text"
            placeholder="e.g. 123456"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-center tracking-widest text-lg font-bold mb-6"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setOtpDialog(false)}
              className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleOtpSubmit}
              disabled={isOtpVerifying || !otpCode}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg flex items-center gap-2"
            >
              {isOtpVerifying && (
                <LuLoaderCircle className="w-4 h-4 animate-spin" />
              )}{' '}
              Verify & Save
            </button>
          </div>
        </DialogWrapper>
      )}

      {/* 4. Delete Account Dialog */}
      {deleteDialog && (
        <DialogWrapper
          title="Delete Account?"
          description="This action is permanent. All data will be lost."
          onClose={() => setDeleteDialog(false)}
          isDestructive
        >
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setDeleteDialog(false)}
              className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="px-4 py-2 bg-destructive text-destructive-foreground text-sm font-semibold rounded-lg flex items-center gap-2"
            >
              {isDeleting && (
                <LuLoaderCircle className="w-4 h-4 animate-spin" />
              )}{' '}
              Confirm Delete
            </button>
          </div>
        </DialogWrapper>
      )}
    </div>
  );
};

// --- Reusable Interfaces and Wrapper ---
interface DialogWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
  isDestructive?: boolean;
}

const DialogWrapper = ({
  title,
  description,
  children,
  onClose,
  isDestructive = false,
}: DialogWrapperProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
    <div
      className={`bg-card w-full max-w-sm rounded-2xl p-6 shadow-lg animate-in zoom-in-95 border ${
        isDestructive ? 'border-destructive/20' : 'border-border'
      }`}
    >
      {isDestructive && (
        <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <LuTrash2 className="w-6 h-6 text-destructive" />
        </div>
      )}
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {children}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        ✕
      </button>
    </div>
  </div>
);

export default SettingsPage;
