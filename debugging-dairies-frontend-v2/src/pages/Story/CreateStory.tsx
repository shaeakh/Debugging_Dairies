import StoryForm from '@/components/story/StoryForm';
import { useFetchCategories } from '@/hooks/category/useFetchCategories';
import { useCreateStory } from '@/hooks/story/useCreateStory';
import type { StoryCreate } from '@/types/api/storyTypes';
import { useNavigate } from 'react-router-dom';

const CreateStory = () => {
  const navigate = useNavigate();
  const {
    categories,
    loading: categoriesLoading,
    refetch,
  } = useFetchCategories();
  const { createStory, loading: submitLoading } = useCreateStory();

  const handleSubmit = (data: StoryCreate) => {
    createStory(data);
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Write a Story</h1>
        <p className="text-muted-foreground text-sm">
          Share your thoughts, experiences, or imagination with the world.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8">
        <StoryForm
          onCategoryCreated={refetch}
          mode="create"
          allCategories={categories}
          categoriesLoading={categoriesLoading}
          submitLoading={submitLoading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CreateStory;
