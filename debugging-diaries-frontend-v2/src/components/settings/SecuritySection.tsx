// components/settings/SecuritySection.tsx
import { LuLock, LuShieldAlert, LuTrash2 } from 'react-icons/lu';

interface SecuritySectionProps {
  onChangePassword: () => void;
  onDeleteAccount: () => void;
}

export const SecuritySection = ({
  onChangePassword,
  onDeleteAccount,
}: SecuritySectionProps) => (
  <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
    <h2 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
      <LuShieldAlert className="w-5 h-5 text-primary" /> Authentication &
      Security
    </h2>

    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-muted/40 p-4 rounded-xl border border-border">
      <div>
        <h3 className="font-semibold text-foreground">Password</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Change your password and secure your account.
        </p>
      </div>
      <button
        onClick={onChangePassword}
        className="px-4 py-2 bg-background border border-border text-foreground hover:bg-muted font-semibold rounded-lg text-sm flex items-center gap-2"
      >
        <LuLock className="w-4 h-4" /> Change Password
      </button>
    </div>

    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-destructive/5 p-4 rounded-xl border border-destructive/20">
      <div>
        <h3 className="font-semibold text-destructive">Delete Account</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Permanently remove your account and all data.
        </p>
      </div>
      <button
        onClick={onDeleteAccount}
        className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold rounded-lg text-sm flex items-center gap-2"
      >
        <LuTrash2 className="w-4 h-4" /> Delete Account
      </button>
    </div>
  </section>
);
