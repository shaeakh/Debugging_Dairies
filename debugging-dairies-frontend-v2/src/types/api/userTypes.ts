export type Role = 'USER' | 'ADMIN';

export type BaseUser = {
  id: number;
  username: string;
  name: string;
  email: string;
  join_date: string;
  role: Role;
  is_active: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
};

export type UserUpdate = Partial<
  Pick<
    BaseUser,
    'username' | 'name' | 'email' | 'role' | 'is_active' | 'is_deleted'
  >
>;

export type UpdateUserPayload = UserUpdate & { currentPassword?: string };
