import axios from '../axios';
import { UserRegisterInput, UserUpdateInput, User } from '../types';

/**
 * ### Verifies user's token
 *
 * ---
 *
 * @example
 * ```typescript
 *  try {
 *    const user = await services.users.verify(user);
 *  } catch (e) {
 *    switch (e.message) {
 *      default:
 *        break;
 *    }
 *  }
 * ```
 *
 * ---
 *
 * @error **generic/server-error** - Thrown if the no response was received from the server
 * @error **generic/network-error** - Thrown if the any other error occurred
 * (i.e: network error, server unreachable, ...)
 */
export const verify = async (current: User): Promise<boolean> => {
  const res = await axios.post('/verify', null, { user: current });

  const { valid } = res.data as { valid: boolean };
  return valid;
};

/**
 * ### Creates and authenticates a user
 *
 * ---
 *
 * @example
 * ```typescript
 *  try {
 *    const user = await services.users.register({
 *      email: `test@mail.com`,
 *      username: 'test-user',
 *      password: 'azerty',
 *      picture: File
 *    });
 *  } catch (e) {
 *    switch (e.message) {
 *      case 'auth/invalid-body':
 *      case 'auth/invalid-email':
 *      case 'auth/invalid-password':
 *        // Wrong user input
 *        break;
 *      case 'auth/email-already-in-use':
 *        // Email already used
 *        break;
 *      case 'auth/username-already-in-use':
 *        // Username already used
 *        break;
 *      default:
 *        break;
 *    }
 *  }
 * ```
 *
 * ---
 *
 * @error **auth/invalid-body** - Thrown if the body is missing or empty
 * @error **auth/invalid-email** - Thrown if the email is missing or empty
 * @error **auth/invalid-password** -
 * Thrown if the password is empty or his strength is not sufficient
 * (letters and/or numbers only, at least 6 characters)
 * @error **auth/email-already-in-use** - Thrown if the given email is already used
 * @error **auth/username-already-in-use** - Thrown if the given username is already used
 * @error **generic/server-error** - Thrown if the no response was received from the server
 * @error **generic/network-error** - Thrown if the any other error occurred
 * (i.e: network error, server unreachable, ...)
 */
export const register = async (input: UserRegisterInput): Promise<User> => {
  const data = new FormData();

  const entries = Object.entries(input);
  entries.forEach(([key, value]) => (value ? data.append(key, value) : undefined));

  const res = await axios.post('/register', data);

  const { user } = res.data as { user: User };
  return user;
};

/**
 * ### Authenticates a user
 *
 * ---
 *
 * @example
 * ```typescript
 *  try {
 *    const user = await services.users.signIn(`test@mail.com`, 'azerty');
 *  } catch (e) {
 *    switch (e.message) {
 *      case 'auth/invalid-body':
 *      case 'auth/invalid-email':
 *      case 'auth/invalid-password':
 *        // Wrong user input
 *        break;
 *      case 'auth/user-not-found':
 *        // Wrong email
 *        break;
 *      case 'auth/invalid-credentials':
 *        // Wrong password
 *        break;
 *      default:
 *        break;
 *    }
 *  }
 * ```
 *
 * ---
 *
 * @error **auth/invalid-body** - Thrown if the body is missing or empty
 * @error **auth/invalid-email** - Thrown if the email is missing or empty
 * @error **auth/invalid-password** - Thrown if the password is missing or empty
 * @error **auth/user-not-found** - Thrown if the given email does not exists
 * @error **auth/invalid-credentials** - Thrown if the given password does not match
 * @error **generic/server-error** - Thrown if the no response was received from the server
 * @error **generic/network-error** - Thrown if the any other error occurred
 * (i.e: network error, server unreachable, ...)
 */
export const signIn = async (email: string, password: string): Promise<User> => {
  const res = await axios.post('/login', { email, password });

  const { user } = res.data as { user: User };
  return user;
};

/**
 * ### Updates an authenticated user own data
 *
 * ---
 *
 * @example
 * ```typescript
 *  try {
 *    const user = await services.users.update({
 *      email: `updated@mail.com`
 *      username: 'updated-username'
 *      password: 'updated-password'
 *      picture: File
 *    });
 *  } catch (e) {
 *    switch (e.message) {
 *      case 'auth/invalid-token':
 *        // Redirect to login page
 *        break;
 *      case 'users/invalid-body':
 *      case 'users/invalid-email':
 *      case 'users/invalid-password':
 *        // Wrong user input
 *        break;
 *      case 'users/email-already-in-used':
 *        // Email already used
 *        break;
 *      case 'users/username-already-in-used':
 *        // Username already used
 *        break;
 *      default:
 *        break;
 *    }
 *  }
 * ```
 *
 * ---
 *
 * @error **auth/invalid-token** - Thrown if the given token has expired
 * * All requests will result in a "auth/invalid-token" error
 * * The token must be refreshed
 * * The user must immediately be redirected to the login page
 * @error **users/invalid-body** - Thrown if the body is missing or empty
 * @error **users/invalid-email** - Thrown if the email has wrong format
 * @error **users/invalid-password** - Thrown if the password strength is not sufficient
 * (letters and/or numbers only, at least 6 characters)
 * @error **users/email-already-in-used** - Thrown if the given email is already used
 * @error **users/username-already-in-used** - Thrown if the given username is already used
 * @error **generic/server-error** - Thrown if the no response was received from the server
 * @error **generic/network-error** - Thrown if the any other error occurred
 * (i.e: network error, server unreachable, ...)
 */
export const update = async (input: UserUpdateInput, current?: User): Promise<User> => {
  const data = new FormData();

  const entries = Object.entries(input);
  entries.forEach(([key, value]) => (value ? data.append(key, value) : undefined));

  const res = await axios.post('/users/update', data, { user: current });

  const { user } = res.data as { user: User };
  return user;
};
