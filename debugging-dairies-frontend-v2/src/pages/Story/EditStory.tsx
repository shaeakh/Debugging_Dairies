import storyApi from '@/apis/story/storyApi';
import type { StoryFormValues } from '@/components/story/StoryForm';
import StoryForm from '@/components/story/StoryForm';
import { useFetchCategories } from '@/hooks/category/useFetchCategories';
import useToast from '@/hooks/component/useToast';
import { useUpdateStory } from '@/hooks/story/useUpdateStory';
import type { StoryUpdate } from '@/types/api/storyTypes';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditStory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError } = useToast();

  const [initialValues, setInitialValues] = useState<StoryFormValues | null>(
    null
  );
  const [fetchLoading, setFetchLoading] = useState(true);

  const {
    categories,
    loading: categoriesLoading,
    refetch,
  } = useFetchCategories();

  const { updateStory, loading: submitLoading } = useUpdateStory();

  // ── Story fetch by id ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) {
      navigate('/home');
      return;
    }

    const fetchStory = async () => {
      try {
        const story = await storyApi.getById(Number(id));
        setInitialValues({
          title: story.title,
          body: story.body,
          categories: story.categories ?? [],
        });
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        showError(error?.response?.data?.message || 'Failed to load story');
        navigate('/home');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchStory();
  }, [id, navigate, showError]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSubmit = (data: StoryUpdate) => {
    updateStory(Number(id), {
      title: data.title,
      body: data.body,
      categories: data.categories,
    });
  };

  const handleCancel = () => {
    navigate('/home');
  };

  // ── Loading skeleton (Compact UI) ───────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-4 md:py-6 h-[calc(100vh-4rem)] flex flex-col">
        <div className="mb-4 space-y-3 shrink-0">
          <div className="h-6 w-32 bg-muted animate-pulse rounded-md" />
          <div className="h-3 w-56 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="bg-card border border-border rounded-xl p-4 md:p-6 space-y-4 flex-1">
          <div className="h-10 bg-muted animate-pulse rounded-lg" />
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
          <div className="flex gap-2 pt-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-6 w-16 bg-muted animate-pulse rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-4 md:py-6 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="mb-4 space-y-0.5">
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          Edit Story
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm">
          Update your story and save the changes.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm">
        {initialValues && (
          <StoryForm
            mode="update"
            initialValues={initialValues}
            allCategories={categories}
            categoriesLoading={categoriesLoading}
            submitLoading={submitLoading}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onCategoryCreated={refetch}
          />
        )}
      </div>
    </div>
  );
};

export default EditStory;
