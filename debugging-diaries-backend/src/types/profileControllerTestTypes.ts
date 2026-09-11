import { vi } from 'vitest';

type MockServiceInstance = {
  GetProfileByUsername: ReturnType<typeof vi.fn>;
};

export type { MockServiceInstance };
