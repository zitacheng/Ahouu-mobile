import React from 'react';
import { View, Text } from 'react-native';
import {
  PlayerRole, MessageType, Message, MessageEvents,
} from '../services/types/rooms';
import game from '../constants/GameStyles';
import { useStoreState } from '../store';

export interface GameMessageProps {
  message: Message,
}

const GameMessage = ({ message }: GameMessageProps): React.ReactElement => {
  const user = useStoreState((state) => state.user.data);

  const roles: Record<PlayerRole, string> = {
    villager: 'Villageois',
    seer: 'Voyante',
    wolf: 'Loup-garou',
    witch: 'Sorcière',
    none: '',
  };

  const death: Record<'wolfs' | 'villagers', string> = {
    villagers: 'le village',
    wolfs: 'les loups-garous',
  };

  const {
    type, username, content, payload,
  } = message;

  const options = {
    labelStyle: {},
    msgStyle: {},
    label: username,
    msg: content,
  };

  const event = content as MessageEvents;
  const events: Partial<Record<MessageEvents, string>> = {
    'initial-admin': `L'admin est: "${payload?.admin as string}"`,
    'new-admin': `Le nouvel admin est: "${payload?.admin as string}"`,
    'number-of-wolfs': `Il y a "${payload?.wolfs as string}" loups-garous dans cette partie`,
    'admin-start-game': 'La partie a été démarré par l\'admin',
    'village-sleeping': 'Le village s\'endort',
    'seer-wakes-up': 'La voyante de réveil',
    'seer-select-choice': 'Vous devez choisir un joueur pour connaître sa vraie identité',
    'seer-result': `Le joueur "${payload?.username as string}" est en réalité: ${roles[payload?.role as PlayerRole]}`,
    'seer-sleeps': "La voyante s'endort",
    'wolfs-wakes-up': 'Les loups-garous se réveillent',
    'wolfs-select-choice': 'Vous devez choisir un joueur à tuer. Une égalité des votes ne tue personne',
    'wolf-sleeps': "Les loups-garous s'endorment",
    'witch-wakes-up': 'La sorcière se réveil',
    'witch-select-choice': 'Vous devez choisir une personne à sauver. Si vous choisissez la mauvaise personne vous perdez votre potion',
    'witch-sleeps': "La sorcière s'endort",
    'village-wakes-up': 'Le village se réveil',
    'no-one-died': "Personne n'est mort",
    'player-died': `Le joueur "${payload?.player as string}" a été tué par ${death[payload?.by as 'wolfs' | 'villagers']}`,
    'player-vote': 'Vous devez choisir une personne à tuer. Une égalité des votes ne tue personne',
    'you-died': `Vous avez été tuer par ${death[payload?.by as 'wolfs' | 'villagers']}`,
    'wolf-win': 'Les loups-garous ont tués tous les villageois, ils gagnent la partie',
    'village-win': 'Les villageois ont tués tous les loups-garous, ils gagnent la partie',
  };

  switch (type) {
    case MessageType.WOLF: {
      const backgroundColor = '#e53935';

      options.labelStyle = username === user?.username ? game.labelUser : game.labelOther;

      options.msgStyle = username === user?.username
        ? [game.userMsg, { backgroundColor }]
        : [game.otherMsg, { backgroundColor }];
      break;
    }
    case MessageType.GENERAL: {
      options.labelStyle = username === user?.username ? game.labelUser : game.labelOther;
      options.msgStyle = username === user?.username ? game.userMsg : game.otherMsg;
      break;
    }
    case MessageType.SYSTEM_SELF: {
      options.label = 'Système - Personnel';
      options.msg = events[event] as string;
      options.labelStyle = game.labelSystem;
      options.msgStyle = [game.systemMsg, { color: '#29b6f6' }];
      break;
    }
    case MessageType.SYSTEM_WOLF: {
      options.label = 'Système - Loups-garous';
      options.msg = events[event] as string;
      options.labelStyle = game.labelSystem;
      options.msgStyle = [game.systemMsg, { color: '#ef5350' }];
      break;
    }
    case MessageType.SYSTEM_GENERAL: {
      options.label = 'Système - Générale';
      options.msg = events[event] as string;
      options.labelStyle = game.labelSystem;
      options.msgStyle = game.systemMsg;
      break;
    }
    default:
      break;
  }

  return (
    <View style={game.col}>
      <Text style={options.labelStyle}>{options.label}</Text>
      <Text style={options.msgStyle}>{options.msg}</Text>
    </View>
  );
};

export default GameMessage;
