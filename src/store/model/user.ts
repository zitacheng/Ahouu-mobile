import { action, Action } from 'easy-peasy';
import { User } from '../../services';

export interface UserModel {
  data?: User
  setUser: Action<UserModel, User | undefined>
}

const model: UserModel = {
  data: undefined,
  setUser: action((state, payload) => ({
    ...state,
    data: payload ? { ...payload } : undefined,
  })),

};

export default model;
