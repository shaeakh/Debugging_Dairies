import { vi } from 'vitest';

type MockServiceInstance = {
  Search: ReturnType<typeof vi.fn>;
};

export type { MockServiceInstance };
