import { useState } from 'react';
import { LuChevronLeft, LuChevronRight, LuLoaderCircle } from 'react-icons/lu';
import { useNavigate, useSearchParams } from 'react-router-dom';

import DeleteStoryDialog from '@/components/story/DeleteStoryDialog';
import HeroSection from '@/components/story/HeroSection';
import StoryCard from '@/components/story/StoryCard';
import SummaryDialog from '@/components/story/SummaryDialog';
import TrendingSidebar from '@/components/story/TrendingSidebar';

import { useTrendingCategories } from '@/hooks/category/useTrendingCategories';
import { useDeleteStory } from '@/hooks/story/useDeleteStory';
import { useFetchStories } from '@/hooks/story/useFetchStories';

const ITEMS_PER_PAGE = 4;

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const {
    stories = [],
    loading,
    totalStories,
    refresh,
  } = useFetchStories(currentPage, ITEMS_PER_PAGE);

  const { trendingCategories, loading: trendingLoading } =
    useTrendingCategories();

  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const [storyToDelete, setStoryToDelete] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { deleteStory, isDeleting } = useDeleteStory(() => {
    setIsDeleteOpen(false);

    if (stories.length === 1 && currentPage > 1) {
      setSearchParams({ page: String(currentPage - 1) });
    } else {
      refresh();
    }
  });

  const totalPages = Math.ceil(totalStories / ITEMS_PER_PAGE);

  const handleEdit = (id: number) => navigate(`/story/edit/${id}`);

  const handleDeleteClick = (id: number) => {
    setStoryToDelete(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (storyToDelete) {
      deleteStory(storyToDelete);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setSearchParams({ page: String(pageNumber) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-8 space-y-10">
      <HeroSection onWriteStoryClick={() => navigate('/story/create')} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              Latest Stories
              {loading && (
                <LuLoaderCircle className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </h2>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-48 w-full bg-muted animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : stories?.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {stories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onSummaryClick={(s) => {
                      setSelectedSummary(s);
                      setIsSummaryOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground">No stories found.</p>
              </div>
            )}
          </div>

          {/* ─── COMPACT RESPONSIVE PAGINATION BAR ─── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-6 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <LuChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              {/* Mobile Text Indicator */}
              <span className="sm:hidden text-xs font-medium text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <LuChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>

        <TrendingSidebar
          categories={trendingCategories}
          loading={trendingLoading}
        />
      </div>

      {/* Summarize Dialog */}
      <SummaryDialog
        isOpen={isSummaryOpen}
        onOpenChange={setIsSummaryOpen}
        summary={selectedSummary}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteStoryDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Home;
