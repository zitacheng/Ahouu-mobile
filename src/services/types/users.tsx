export type User = {
  id: string
  email: string
  username: string
  picture?: string
  rooms: string[]
  token: string
};

export type UserFromInput = Pick<User, 'email' | 'username'> & { password?: string, picture?: FormDataValue };
