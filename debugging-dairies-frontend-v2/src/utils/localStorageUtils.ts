import type { UserPayload } from '@/types/api/authTypes';

export const setUserPayload = (userPayload: UserPayload | undefined) => {
  if (!userPayload) {
    throw new Error('Invalid user data. Please try logging in again.');
  }
  localStorage.setItem('userPayload', JSON.stringify(userPayload));
};

export const getUserPayload = (): UserPayload => {
  const userPayload = localStorage.getItem('userPayload');

  if (!userPayload) {
    throw new Error('User not found. Please sign in again');
  }
  const parsedUserPayload = JSON.parse(userPayload) as UserPayload;

  return parsedUserPayload;
};

export const removeUserPayload = () => {
  localStorage.removeItem('userPayload');
};

export const isAuthenticated = (): boolean => {
  try {
    const userPayload = localStorage.getItem('userPayload');

    return userPayload !== null;
  } catch {
    return false;
  }
};
