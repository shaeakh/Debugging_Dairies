import { useVoteStory } from '@/hooks/vote/useVoteStory';
import type { Story } from '@/types/api/storyTypes';
import EnvConstants from '@/utils/envConstants';
import { getUserPayload, isAuthenticated } from '@/utils/localStorageUtils';
import { useEffect, useRef, useState } from 'react';
import { CiCircleMore } from 'react-icons/ci';
import {
  LuArrowBigDown,
  LuArrowBigUp,
  LuClock,
  LuMessageSquare,
  LuPencil,
  LuSparkles,
  LuTrash2,
  LuUser,
} from 'react-icons/lu';
import { Link, useNavigate } from 'react-router-dom';
import ShareButton from './shareButton';

interface StoryCardProps {
  story: Story;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onSummaryClick?: (summary: string | null) => void;
  // onVoteSuccess?: () => void;
}

const StoryCard = ({
  story,
  onEdit,
  onDelete,
  onSummaryClick,
  // onVoteSuccess,
}: StoryCardProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { voteStory } = useVoteStory();

  // ─── 1. LOCAL STATE FOR INSTANT UI UPDATES ──────────────────────────────────
  // We keep a local mirror of the votes array to perform lightning-fast optimistic swaps
  const [localVotes, setLocalVotes] = useState(story.votes || []);

  // Sync state if the parent data changes (e.g., during pagination or heavy refetches)
  // Sync state if the parent data changes (e.g., during pagination or heavy refetches)
  useEffect(() => {
    // Wrapped in a 0ms setTimeout to push the state update to the next event tick
    const timer = setTimeout(() => {
      setLocalVotes(story.votes || []);
    }, 0);

    // Clean up the timer if the component unmounts or story.votes changes quickly
    return () => clearTimeout(timer);
  }, [story.votes]);

  let canManage = false;
  let currentUserId: number | null = null;

  if (isAuthenticated()) {
    try {
      const currentUser = getUserPayload();
      currentUserId = currentUser.id;
      const isOwner = currentUser.id === story.userId;
      const isAdmin = currentUser.role === 'ADMIN';
      canManage = isOwner || isAdmin;
    } catch (error) {
      console.error('User payload error:', error);
      canManage = false;
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formattedDate = new Date(story.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // ─── COMPUTED COUNTS FROM LOCAL STATE ──────────────────────────────────────
  const upvotesCount = localVotes.filter((v) => v.type === 'UPVOTE').length;
  const downvotesCount = localVotes.filter((v) => v.type === 'DOWNVOTE').length;

  const userVote = localVotes.find((v) => v.userId === currentUserId);
  const isUpvoted = userVote?.type === 'UPVOTE';
  const isDownvoted = userVote?.type === 'DOWNVOTE';

  // ─── OPTIMISTIC HANDLER LOLOGIC ────────────────────────────────────────────
  const handleVoteAction = async (clickedType: 'UPVOTE' | 'DOWNVOTE') => {
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }

    if (!currentUserId) return;

    // Preserve original copy for a clean rollback if the server fails
    const previousVotesBackup = [...localVotes];

    // Build the structural transformation locally
    let newVotes = [...localVotes];

    if (userVote) {
      if (userVote.type === clickedType) {
        // Condition A: User clicked their active vote -> Remove vote entirely (Unvote)
        newVotes = newVotes.filter((v) => v.userId !== currentUserId);
      } else {
        // Condition B: User toggled between UPVOTE and DOWNVOTE -> Flip the property
        newVotes = newVotes.map((v) =>
          v.userId === currentUserId ? { ...v, type: clickedType } : v
        );
      }
    } else {
      // Condition C: Brand new vote allocation -> Push a mock item to the array
      newVotes.push({
        id: Date.now(), // temporary client-side runtime key
        type: clickedType,
        userId: currentUserId,
        storyId: story.id,
      });
    }

    // 🔥 INSTANT UPDATE: Renders immediately with zero latency
    setLocalVotes(newVotes);

    // Dispatch background network call
    const result = await voteStory({ storyId: story.id, type: clickedType });

    if (!result) {
      // 🔄 SERVER REJECTION / NETWORK FAILURE: Rollback to absolute reality
      setLocalVotes(previousVotesBackup);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all p-5 relative group">
      {/* Top Controls Action Menu */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <button
          onClick={() => onSummaryClick?.(story.summary)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-full text-xs font-semibold transition-colors"
          title="View AI Summary"
        >
          <LuSparkles className="w-3.5 h-3.5" />
          <span>Summary</span>
        </button>

        {canManage && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"
            >
              <CiCircleMore className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-lg shadow-xl py-1 z-30 animate-in fade-in zoom-in duration-200">
                <button
                  onClick={() => {
                    onEdit?.(story.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  <LuPencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => {
                    onDelete?.(story.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LuTrash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Author Details Meta */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          to={`/profile/${story.user.username}`}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden hover:border-primary/50 transition-colors"
        >
          <LuUser className="w-6 h-6 text-muted-foreground" />
        </Link>
        <div className="flex flex-col">
          <Link
            to={`/profile/${story.user.username}`}
            className="text-sm font-bold text-foreground leading-none hover:text-primary transition-colors w-fit"
          >
            {story.user.name}
          </Link>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
            <LuClock className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="space-y-2">
        <Link
          to={`/story/${story.id}`}
          className="block text-xl font-bold text-foreground line-clamp-2 leading-tight hover:text-primary transition-colors cursor-pointer"
        >
          {story.title}
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {story.body}
        </p>
      </div>

      {/* Categories / Tags Section */}
      {story.categories && story.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {story.categories.map((cat) => (
            <span
              key={cat.id}
              className="text-[10px] uppercase tracking-wider font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border"
            >
              #{cat.name}
            </span>
          ))}
        </div>
      )}

      {/* ─── Horizontal Divider ─── */}
      <div className="my-4 border-t border-border" />

      {/* ─── Actions Row ─── */}
      <div className="flex items-center justify-between text-muted-foreground">
        <div className="flex items-center bg-muted/30 border border-border rounded-lg p-1 gap-1">
          {/* Upvote Button */}
          <button
            onClick={() => handleVoteAction('UPVOTE')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              isUpvoted
                ? 'bg-primary/20 text-primary'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
            title="Upvote"
          >
            <LuArrowBigUp
              className={`w-4 h-4 ${isUpvoted ? 'fill-primary' : ''}`}
            />
            <span>{upvotesCount}</span>
          </button>

          {/* Downvote Button */}
          <button
            onClick={() => handleVoteAction('DOWNVOTE')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              isDownvoted
                ? 'bg-destructive/20 text-destructive'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
            title="Downvote"
          >
            <LuArrowBigDown
              className={`w-4 h-4 ${isDownvoted ? 'fill-destructive' : ''}`}
            />
            <span>{downvotesCount}</span>
          </button>

          <div className="w-px h-4 bg-border mx-1" />

          {/* Comment Navigation Button */}
          <button
            onClick={() => navigate(`/story/${story.id}`)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-accent hover:text-accent-foreground rounded-md text-xs font-semibold transition-colors"
            title="View Comments"
          >
            <LuMessageSquare className="w-4 h-4" />
            <span>{story.comments?.length || 0}</span>
          </button>
        </div>

        <ShareButton
          shareUrl={`${EnvConstants.FRONTEND_URL}/story/${story.id}`}
        />
      </div>
    </div>
  );
};

export default StoryCard;
