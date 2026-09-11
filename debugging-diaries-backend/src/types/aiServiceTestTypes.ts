import { vi } from 'vitest';

type MockAiRepositoryInstance = {
  generateStorySummary: ReturnType<typeof vi.fn>;
};
export type { MockAiRepositoryInstance };
