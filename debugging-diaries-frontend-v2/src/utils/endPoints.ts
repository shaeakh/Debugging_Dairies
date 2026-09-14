const ENDPOINTS = {
  auth: {
    signUp: '/api/auth/signup',
    signIn: '/api/auth/signin',
    confirmEmail: (token: string) => `/api/auth/confirm-email/${token}`,
    changePassword: '/api/auth/change-password',
    verifyOtp: '/api/auth/verify-Otp',
    signOut: '/api/auth/signout',
  },
  users: {
    getAll: '/api/users',
    getById: (id: number) => `/api/users/${id}`,
    update: (id: number) => `/api/users/${id}`,
    delete: (id: number) => `/api/users/${id}`,
  },
  stories: {
    getAll: '/api/stories',
    getById: (id: number) => `/api/stories/${id}`,
    create: '/api/stories',
    update: (id: number) => `/api/stories/${id}`,
    delete: (id: number) => `/api/stories/${id}`,
  },
  categories: {
    getAll: '/api/categories',
    create: '/api/categories',
    trending: '/api/categories/trending',
  },
  profile: {
    getByUsername: (username: string) => `/api/profile/${username}`,
  },
  search: {
    search: '/api/search',
  },
  votes: {
    story: '/api/votes/story',
    comment: '/api/votes/comment',
  },
  comments: {
    create: '/api/comments',
  },
} as const;

export default ENDPOINTS;
