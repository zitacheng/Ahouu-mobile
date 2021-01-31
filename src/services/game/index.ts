import { io, Socket } from 'socket.io-client';

import config from '../config';
import {
  GameEvents, Message, Player, Room, RoomActions, RoomEvents,
} from '../types';

export default class Game {
  public room: Room;

  private socket: Socket;

  private connected: boolean;

  private events: GameEvents;

  constructor(room: Room, token: string, events: GameEvents) {
    this.room = room;
    this.socket = io(config.api.url, { query: { token, roomId: room.id } });
    this.connected = false;
    this.events = events;

    Object
      .keys(this.events)
      .forEach((e) => {
        const event = e as RoomEvents;
        const callback = this.events[event];

        if (callback) this.socket.on(event, callback);
      });

    this.socket
      .on('connect', () => { this.connected = true; })
      .on('disconnect', () => { this.connected = false; });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private emit = (event: RoomActions, ...args: any[]) => this.socket.emit(event, ...args);

  public isConnected = (): boolean => this.connected;

  public disconnect = (): void => { this.socket.disconnect(); };

  public kickUser = (player: Player): void => { this.emit('kick-user', player.username); };

  public startGame = (): void => { this.emit('game-start'); };

  public sendMessage = (message: Partial<Message>): void => { this.emit('send-message', message); };

  public userVote = (player: Player): void => { this.emit('user-vote', player.username); };

  public sendSeerVote = (player: Player): void => { this.emit('seer-vote', player.username); };

  public sendWolfVote = (player: Player): void => { this.emit('wolf-vote', player.username); };

  public sendWitchVote = (player: Player): void => { this.emit('witch-vote', player.username); };
}
