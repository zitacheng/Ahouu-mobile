export type User = {
  id: string
  email: string
  username: string
  picture?: string
  rooms: string[]
  token: string
};

export type UserRegisterInput = Pick<User, 'email' | 'username'> & { password: string, picture?: File };
export type UserUpdateInput = Pick<User, 'email' | 'username'> & { password: string, picture?: File };
