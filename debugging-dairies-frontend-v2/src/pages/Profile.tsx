import StoryCard from '@/components/story/StoryCard';
import SummaryDialog from '@/components/story/SummaryDialog';
import { useFetchProfile } from '@/hooks/profile/useFetchProfile';
import { getUserPayload } from '@/utils/localStorageUtils';
import { useState } from 'react';
import { LuCalendar, LuMail, LuShieldCheck, LuUser } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const { profile, loading } = useFetchProfile(username);

  // ─── Dialog Management States ───
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const currentUser = getUserPayload();
  const isOwnProfile = currentUser?.username === username;

  const handleEdit = (id: number) => navigate(`/story/edit/${id}`);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10 space-y-8">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex items-center gap-6 shadow-sm">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted animate-pulse shrink-0" />
          <div className="space-y-3 flex-1">
            <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded-md hidden md:block" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-48 w-full bg-muted animate-pulse rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <LuUser className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
        <h2 className="text-xl font-bold text-foreground">User not found</h2>
        <p className="text-sm text-muted-foreground">
          The profile you are looking for does not exist or has been deleted.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="mt-4 text-primary font-semibold hover:underline"
        >
          Go back home
        </button>
      </div>
    );
  }

  const joinDate = new Date(profile.join_date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* ─── Profile Header Section ─── */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mt-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-background border-4 border-card shadow-sm flex items-center justify-center shrink-0">
            <LuUser className="w-10 h-10 text-muted-foreground" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
                {profile.name}
                {profile.role === 'ADMIN' && (
                  <span title="Administrator">
                    <LuShieldCheck className="w-5 h-5 text-primary" />
                  </span>
                )}
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                @{profile.username}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <LuMail className="w-4 h-4" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <LuCalendar className="w-4 h-4" />
                Joined {joinDate}
              </span>
            </div>
          </div>

          {isOwnProfile && (
            <button
              onClick={() => navigate('/settings')}
              className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* ─── User's Stories Section ─── */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">
          Stories by {profile.name.split(' ')[0]}
          <span className="ml-2 text-sm font-medium text-muted-foreground">
            ({profile.stories?.length || 0})
          </span>
        </h2>

        {profile.stories && profile.stories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 pt-2">
            {profile.stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onEdit={handleEdit}
                onSummaryClick={(s) => {
                  setSelectedSummary(s);
                  setIsSummaryOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">No stories published yet.</p>
          </div>
        )}
      </div>

      {/* ─── Summary Dialog ─── */}
      <SummaryDialog
        isOpen={isSummaryOpen}
        onOpenChange={setIsSummaryOpen}
        summary={selectedSummary}
      />
    </div>
  );
};

export default Profile;
