import { createStore, persist, createTypedHooks } from 'easy-peasy';

import storage from './storage';
import model, { StoreModel } from './model';

const typed = createTypedHooks<StoreModel>();

export const { useStoreActions } = typed;
export const { useStoreDispatch } = typed;
export const { useStoreState } = typed;

const store = createStore(persist(model, { storage }));

export default store;
