import { useState } from 'react';
import {
  LuArrowBigDown,
  LuArrowBigUp,
  LuArrowLeft,
  LuClock,
  LuLoaderCircle,
  LuMessageCircle,
  LuMessageSquare,
  LuSend,
  LuShare2,
  LuSparkles,
  LuUser,
} from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';

import { useCreateComment } from '@/hooks/comment/useCreateComment';
import { useFetchStoryById } from '@/hooks/story/useFetchStoryById';
import { useVoteStory } from '@/hooks/vote/useVoteStory';
import { getUserPayload, isAuthenticated } from '@/utils/localStorageUtils';

const StoryDetails = () => {
  const { storyid } = useParams<{ storyid: string }>();
  const navigate = useNavigate();

  // Local state for the text input box
  const [commentText, setCommentText] = useState('');

  // ─── Custom Hooks ──────────────────────────────────────────────────────────
  const { story, loading, refetch } = useFetchStoryById(
    storyid ? parseInt(storyid) : undefined
  );
  const { voteStory, loading: isVoting } = useVoteStory();
  const { createComment, loading: isSubmittingComment } = useCreateComment();

  // Determine current user data
  let currentUserId: number | null = null;
  if (isAuthenticated()) {
    try {
      const currentUser = getUserPayload();
      currentUserId = currentUser.id;
    } catch (error) {
      console.error('User payload reading error:', error);
    }
  }

  // ─── Loading Skeletons ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
        <div className="h-10 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-4 bg-muted animate-pulse rounded w-1/6" />
        <div className="space-y-2 pt-4">
          <div className="h-4 bg-muted animate-pulse rounded w-full" />
          <div className="h-4 bg-muted animate-pulse rounded w-full" />
          <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
        </div>
      </div>
    );
  }

  // ─── Empty state if story doesn't exist ────────────────────────────────────
  if (!story) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border max-w-4xl mx-auto mt-8">
        <p className="text-muted-foreground">
          Story not found or has been removed.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="mt-4 text-sm font-semibold text-primary hover:underline"
        >
          Go back home
        </button>
      </div>
    );
  }

  const formattedDate = new Date(story.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // ─── Interaction Handlers & Utility Functions ──────────────────────────────
  const upvotesCount =
    story.votes?.filter((v) => v.type === 'UPVOTE').length || 0;
  const downvotesCount =
    story.votes?.filter((v) => v.type === 'DOWNVOTE').length || 0;

  const userVote = story.votes?.find((v) => v.userId === currentUserId);
  const isUpvoted = userVote?.type === 'UPVOTE';
  const isDownvoted = userVote?.type === 'DOWNVOTE';

  const handleVoteAction = async (type: 'UPVOTE' | 'DOWNVOTE') => {
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }
    await voteStory({ storyId: story.id, type }, () => {
      refetch(); // Reload view data to display updated metrics
    });
  };

  const executeCommentSubmission = async () => {
    if (!commentText.trim() || isSubmittingComment || !isAuthenticated())
      return;

    await createComment(
      { storyId: story.id, body: commentText.trim(), parentId: null },
      () => {
        setCommentText(''); // Clear typing board
        refetch(); // Sync view lists instantly
      }
    );
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommentSubmission();
  };

  // Handles Enter key press inside the textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line break
      executeCommentSubmission();
    }
  };

  const formatCommentTime = (dateString: string): string => {
    const commentDate = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - commentDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInHours = Math.floor(diffInSeconds / 3600);

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    const formattedTime = commentDate.toLocaleTimeString('en-US', timeOptions);

    if (diffInSeconds < 60) {
      return '1 s ago';
    }

    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min ago`;
    }

    if (diffInHours <= 9) {
      return `${diffInHours} hr ago`;
    }

    const isToday = commentDate.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = commentDate.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Today at ${formattedTime}`;
    }

    if (isYesterday) {
      return `Yesterday at ${formattedTime}`;
    }

    const day = String(commentDate.getDate()).padStart(2, '0');
    const month = String(commentDate.getMonth() + 1).padStart(2, '0');
    const year = String(commentDate.getFullYear()).slice(-2);

    return `${day}/${month}/${year} ${formattedTime}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 space-y-6 mb-16">
      {/* Back Control */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
      >
        <LuArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to stories
      </button>

      {/* Main Container Blueprint */}
      <article className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        {/* Categories/Tags */}
        {story.categories && story.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {story.categories.map((cat) => (
              <span
                key={cat.id}
                className="text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full"
              >
                #{cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-tight">
          {story.title}
        </h1>

        {/* Meta details header */}
        <div className="flex items-center gap-3 py-3 border-y border-border">
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center border border-border">
            <LuUser className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              {story.user?.name || 'Anonymous'}
            </span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <LuClock className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Summary Block */}
        {story.summary && (
          <div className="bg-muted/40 border border-border rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <LuSparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI TL;DR Summary</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed italic">
              {story.summary}
            </p>
          </div>
        )}

        {/* Core Post Segment */}
        <div className="pt-2">
          <p className="text-sm md:text-base text-foreground leading-relaxed whitespace-pre-wrap font-sans">
            {story.body}
          </p>
        </div>

        {/* Horizontal Divider Line */}
        <div className="border-t border-border pt-4" />

        {/* Clustered Layout Counter Button Row */}
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center bg-muted/30 border border-border rounded-lg p-1 gap-1">
            {/* Upvote Icon */}
            <button
              onClick={() => handleVoteAction('UPVOTE')}
              disabled={isVoting}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-50 ${
                isUpvoted
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <LuArrowBigUp
                className={`w-4 h-4 ${isUpvoted ? 'fill-primary' : ''}`}
              />
              <span>{upvotesCount}</span>
            </button>

            {/* Downvote Icon */}
            <button
              onClick={() => handleVoteAction('DOWNVOTE')}
              disabled={isVoting}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-50 ${
                isDownvoted
                  ? 'bg-destructive/20 text-destructive'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <LuArrowBigDown
                className={`w-4 h-4 ${isDownvoted ? 'fill-destructive' : ''}`}
              />
              <span>{downvotesCount}</span>
            </button>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Total Comment Count Badge */}
            <button
              onClick={() => {}}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold select-none cursor-default"
            >
              <LuMessageSquare className="w-4 h-4" />
              <span>{story.comments?.length || 0}</span>
            </button>
          </div>

          {/* Dummy Share Anchor */}
          <button className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
            <LuShare2 className="w-4 h-4" />
          </button>
        </div>
      </article>

      {/* ─── 3. Input Comment Text Box Area ─── */}
      <section className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <LuMessageCircle className="w-4 h-4 text-primary" />
          Share your thoughts
        </h3>
        <form onSubmit={handleCommentSubmit} className="flex gap-3 items-start">
          <div className="relative flex-1">
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isAuthenticated()
                  ? 'Write a response... (Press Enter to send)'
                  : 'Please sign in to drop a comment...'
              }
              disabled={!isAuthenticated() || isSubmittingComment}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none placeholder:text-muted-foreground/70 disabled:opacity-60 disabled:bg-muted/10"
            />
          </div>
          <button
            type="submit"
            disabled={
              !commentText.trim() || isSubmittingComment || !isAuthenticated()
            }
            className="px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-2 h-11"
          >
            {isSubmittingComment ? (
              <LuLoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              <LuSend className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Respond</span>
          </button>
        </form>
      </section>

      {/* ─── 4. Comments Feed List Section ─── */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-foreground px-1">
          Responses ({story.comments?.length || 0})
        </h3>

        {story.comments && story.comments.length > 0 ? (
          <div className="space-y-4">
            {story.comments.map((comment) => {
              const displayTime = formatCommentTime(comment.created_at);

              return (
                <div
                  key={comment.id}
                  className="bg-card border border-border rounded-xl p-4 md:p-5 shadow-sm space-y-3 animate-in fade-in-50 duration-200"
                >
                  {/* Comment Author Header */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center border border-border">
                      <LuUser className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">
                        {comment.user?.username || `User #${comment.userId}`}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {displayTime}
                      </span>
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-sm text-foreground leading-relaxed pl-1 whitespace-pre-wrap">
                    {comment.body}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 border border-dashed border-border rounded-xl">
            <p className="text-sm text-muted-foreground">
              No responses yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default StoryDetails;
