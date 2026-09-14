import { LuMail, LuUser } from 'react-icons/lu';

// Define the shape of your form data
interface ProfileFormData {
  name: string;
  username: string;
  email: string;
}

interface GeneralSectionProps {
  formData: ProfileFormData;
  setFormData: (data: ProfileFormData) => void;
  hasChanges: boolean;
  onSave: () => void;
}

export const GeneralSection = ({
  formData,
  setFormData,
  hasChanges,
  onSave,
}: GeneralSectionProps) => (
  <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
    <h2 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
      <LuUser className="w-5 h-5 text-primary" /> General Information
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Name Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
      </div>

      {/* 2. Username Input (Restored) */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Username
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
      </div>

      {/* 3. Email Input */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-semibold text-foreground">
          Email Address
        </label>
        <div className="relative">
          <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
      </div>
    </div>

    <div className="flex justify-end pt-2">
      <button
        disabled={!hasChanges}
        onClick={onSave}
        className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Changes
      </button>
    </div>
  </section>
);
