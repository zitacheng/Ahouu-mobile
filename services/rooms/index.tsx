import axios from '../axios';
import {
  Room, RoomCreateInput, RoomGetManyInput, RoomGetOneInput, User,
} from '../types';

/**
 * ### Verifies user's token
 *
 * ---
 *
 * @example
 * ```typescript
 *  try {
 *    const user = await services.rooms.create({
 *      name: 'room-name',
 *      max: 8,
 *      password: 'azerty'
 *    });
 *  } catch (e) {
 *    switch (e.message) {
 *       case 'auth/invalid-token':
 *        // Redirect to login page
 *        break;
 *      case 'rooms/invalid-max':
 *      case 'rooms/invalid-password':
 *        // Wrong user input
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
 * @error **rooms/invalid-max** - Thrown if the given max number of players is below 6 or above 12
 * @error **rooms/invalid-password** - Thrown if the password strength is not sufficient
 * (letters and/or numbers only, at least 6 characters)
 * @error **generic/server-error** - Thrown if the no response was received from the server
 * @error **generic/network-error** - Thrown if the any other error occurred
 * (i.e: network error, server unreachable, ...)
 */
export const create = async (current: User, input: RoomCreateInput): Promise<Room> => {
  const res = await axios.post('/rooms/create', input, { user: current });

  const { room } = res.data as { room: Room };
  return room;
};

export const getOne = async (current: User, input: RoomGetOneInput): Promise<Room> => {
  const res = await axios.post('/rooms/get-one', input, { user: current });

  const { room } = res.data as { room: Room };
  return room;
};

export const getMany = async (current: User, input?: RoomGetManyInput): Promise<Room[]> => {
  const res = await axios.post('/rooms/get-many', input, { user: current });

  const { rooms } = res.data as { rooms: Room[] };
  return rooms;
};
