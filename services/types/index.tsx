import { RoomEvents } from './rooms';

export * from './users';
export * from './rooms';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GameEvents = Partial<Record<RoomEvents, ((...args: any[]) => void)>>;

export type Config = {
  api: {
    url: string
  }
};
