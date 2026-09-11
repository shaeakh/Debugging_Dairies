import { vi } from 'vitest';

type MockUserServiceInstance = {
  SearchUser: ReturnType<typeof vi.fn>;
};

type MockStoryServiceInstance = {
  SearchStory: ReturnType<typeof vi.fn>;
};
export type { MockUserServiceInstance, MockStoryServiceInstance };
