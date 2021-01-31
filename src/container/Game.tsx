import React, {
  useCallback, useEffect, useState,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
  Vibration,
  ActivityIndicator,
  ImageSourcePropType,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  NavigationScreenProp, NavigationState, NavigationParams, NavigationRoute,
} from 'react-navigation';
import {
  AntDesign, FontAwesome5, Ionicons,
} from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import {
  PlayerState, RoomState, Player, PlayerRole, MessageType, Room, RoomGetOneInput, Message,
} from '../services/types/rooms';
import basic from '../constants/Styles';
import game from '../constants/GameStyles';
import wolfCard from '../assets/images/loupgarou.png';
import witchCard from '../assets/images/sorciere.png';
import seerCard from '../assets/images/voyant.png';
import villagerCard from '../assets/images/paysan.png';
import services, { GameEvents, GameInstance } from '../services';

import { RealNavigationEventPayload } from '../navigation/BottomTab';

import { useStoreActions, useStoreState } from '../store';
import { ExpiredSessionRedirect } from '../utils';
import GamePlayer from '../components/GamePlayer';
import GameMessage from '../components/GameMessage';

export interface GameProps {
  route: NavigationRoute<Room>,
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const Game = ({ navigation, route }: GameProps): React.ReactElement => {
  const user = useStoreState((state) => state.user.data);
  const setUser = useStoreActions((actions) => actions.user.setUser);

  const [quit, setQuit] = useState(false);
  const [card, setCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startLoading, setStartLoading] = useState(false);
  const [room, setRoom] = useState<Room | undefined>();
  const [admin, setAdmin] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [self, setSelf] = useState<Player | undefined>();
  const [mode, setMode] = useState<'general' | 'wolf'>('general');
  const [message, setMessage] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [instance, setInstance] = useState<GameInstance | undefined>();
  const [messageRef, setMessageRef] = useState<ScrollView | null>(null);

  const state: Record<RoomState, string> = {
    lobby: 'En attente',
    started: 'En cours',
    finished: 'Terminé',
  };

  const role: Record<PlayerRole, { name: string, info: string }> = {
    witch: {
      name: 'Sorcière',
      info: 'Vous possédez une potion de guérison que vous pouvez utiliser la nuit.',
    },
    seer: {
      name: 'Voyante',
      info: 'Chaque nuit vous pouvez voir la vraie nature d\'une personne. Vous devez aider les villageois, mais rester discret pour ne pas être repérer par les loups-garous.',
    },
    wolf: {
      name: 'Loup-garou',
      info: "Vous pouvez éliminer un joueur par nuit, votre but est d'éliminer tout les gentils.",
    },
    villager: {
      name: 'Villageois',
      info: "Vous devez démasquer les loup-garous avant qu'ils ne mangent tout le village.",
    },
    none: {
      name: '',
      info: '',
    },
  };

  const disconnect = useCallback(() => {
    instance?.disconnect();
    navigation.navigate('ListRoom');
  }, [navigation, instance]);

  const refresh = useCallback((res: Room) => {
    const me = res.players.find(({ username }) => username === user?.username) as Player;

    setRoom(res);
    setAdmin(res.admin);
    setPlayers(res.players);
    setSelf(me);
    setMessages(me ? me.messages : []);
  }, [user]);

  const refetch = useCallback(async () => {
    if (!user) return undefined;

    const { id } = room || route.params as Room;
    const input:RoomGetOneInput = { id };

    const res = await services.rooms.getOne(user, input);

    refresh(res);

    return res;
  }, [route, user, room, refresh]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // The type NavigationEventPayload does not represent at all what the actual event is
      const event = e as unknown as RealNavigationEventPayload;

      if (!event
        || !event.data
        || !event.data.action
        || event.data.action.type !== 'GO_BACK') return;

      event.preventDefault();
      setQuit(true);
    });

    return unsubscribe.remove;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => instance?.disconnect());

    return unsubscribe.remove;
  }, [navigation, instance]);

  useEffect(() => {
    if (!!room || !user) return;

    const init = async () => {
      try {
        const res = await refetch();

        const onUserKicked = (payload: Player[]) => {
          if (!payload.find((p) => p.username === user?.username)) disconnect();
          else setPlayers([...payload]);
        };

        const events: GameEvents = {
          connect: () => setLoading(false),
          'admin-change': (payload: string) => setAdmin(payload),
          'new-message': (payload: Message[]) => setMessages([...payload]),
          'user-joined': (payload: Player[]) => setPlayers([...payload]),
          'user-leaved': (payload: Player[]) => setPlayers([...payload]),
          'user-kicked': onUserKicked,
          'game-started': () => setCard(true),
          'game-ended': (payload: Room) => refresh(payload),
          'village-sleeps': (payload: Room) => refresh(payload),
          'village-awakes': (payload: Room) => refresh(payload),
          'seer-wakes-up': (payload: Room) => refresh(payload),
          'seer-sleeps': (payload: Room) => refresh(payload),
          'witch-wakes-up': (payload: Room) => refresh(payload),
          'witch-sleeps': (payload: Room) => refresh(payload),
          'wolfs-wakes-up': (payload: Room) => refresh(payload),
          'wolfs-sleeps': (payload: Room) => refresh(payload),
        };

        const i = new GameInstance(res as Room, user.token, events);
        setInstance(i);
      } catch (e) {
        const error = e as Error;

        switch (error.message) {
          case 'auth/invalid-token':
            ExpiredSessionRedirect(navigation, setUser);
            break;
          default:
        }
      }
    };

    init();
  }, [navigation, room, user, setUser, refresh, refetch, disconnect, instance]);

  const onQuit = async () => {
    setQuit(false);

    await new Promise<void>((next) => setTimeout(() => {
      disconnect();
      next();
    }, 250));
  };

  const onSendMessage = () => {
    instance?.sendMessage({
      type: mode === 'general' ? MessageType.GENERAL : MessageType.WOLF,
      content: message,
    });

    setMessage('');
  };

  const StartGameButton = () => {
    if (!user || !room || room.state !== RoomState.LOBBY || admin !== user.username) return <></>;

    return (
      <TouchableOpacity
        style={startLoading ? game.btnOff : game.btn}
        onPress={() => {
          if (players.length !== room.max) {
            Toast.show({
              type: 'info',
              text1: 'Il manque des joueurs',
              text2: `La salle doit avoir ${room.max} joueurs pour pouvoir être lancée.`,
            });

            return;
          }

          setStartLoading(true);
          instance?.startGame();
          setStartLoading(false);
        }}
        disabled={startLoading}
      >
        <Text style={basic.btnText}>
          Commencer
        </Text>
      </TouchableOpacity>

    );
  };

  const CardButton = () => (
    <TouchableOpacity
      onPress={() => {
        Vibration.vibrate([100]);
        setCard(true);
      }}
      style={game.headerIcon}
    >
      <AntDesign name="questioncircle" size={24} color="#CDCBD1" />
    </TouchableOpacity>
  );

  const PlayerBar = (side: 'left' | 'right') => {
    const left = [0, 2, 4, 6, 8, 10];
    const right = [1, 3, 5, 6, 9, 11];
    const indexes = side === 'left' ? left : right;

    return indexes.map((index) => {
      const player = players.find((p, i) => i === index);

      return (
        <GamePlayer
          key={index}
          instance={instance}
          room={room as Room}
          admin={admin as string}
          self={self}
          player={player}
        />
      );
    });
  };

  const PlayerCard = () => {
    if (!self || !room || (room.state !== RoomState.STARTED && room.state !== RoomState.FINISHED)) {
      return (<Text style={game.cardText}>Le jeu n&apos;a pas commencé encore</Text>);
    }

    switch (self.role) {
      case PlayerRole.SEER:
        return <Image resizeMode="contain" style={game.card} source={seerCard as ImageSourcePropType} />;
      case PlayerRole.WITCH:
        return <Image resizeMode="contain" style={game.card} source={witchCard as ImageSourcePropType} />;
      case PlayerRole.WOLF:
        return <Image resizeMode="contain" style={game.card} source={wolfCard as ImageSourcePropType} />;
      case PlayerRole.VILLAGER:
        return <Image resizeMode="contain" style={game.card} source={villagerCard as ImageSourcePropType} />;
      default:
        return <></>;
    }
  };

  const Messages = () => (
    <ScrollView
      ref={(ref) => setMessageRef(ref)}
      style={game.scrollBody}
      contentContainerStyle={game.scrollContent}
      onContentSizeChange={() => messageRef?.scrollToEnd({ animated: true })}
      directionalLockEnabled
    >
      { messages.map((item) => <GameMessage key={item.id} message={item} />) }
    </ScrollView>
  );

  const MessageInput = () => (
    <View style={game.messageInput}>
      {
        self?.role === PlayerRole.WOLF
          ? (
            <TouchableOpacity
              onPress={() => setMode(mode === 'general' ? 'wolf' : 'general')}
              disabled={self && self.state === PlayerState.DEAD
                && room && room.state === RoomState.FINISHED}
            >
              <FontAwesome5 name="wolf-pack-battalion" size={40} color="orange" />
            </TouchableOpacity>
          )
          : <></>
      }
      <TextInput
        editable={room && room.state !== RoomState.LOBBY
                  && self && self.state !== PlayerState.DEAD
                  && room.state !== RoomState.FINISHED}
        style={basic.input}
        placeholder={mode === 'general' ? 'Générale' : 'Loups-garous'}
        placeholderTextColor="gray"
        onChangeText={setMessage}
        value={message}
        onSubmitEditing={onSendMessage}
        returnKeyType="send"
      />

    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={game.container}
      >
        {loading
          ? (<ActivityIndicator style={game.loader} size="large" color="#EF864F" />)
          : (
            <>
              <View style={game.header}>
                <TouchableOpacity style={game.headerIcon} onPress={() => setQuit(true)}>
                  <Ionicons name="chevron-back-circle" size={30} color="#CDCBD1" />
                </TouchableOpacity>
                <Modal isVisible={quit} animationIn="tada">
                  <View style={game.modalView}>
                    <Text style={game.modalTitle}>Êtes-vous sûr de vouloir quitter ?</Text>
                    <TouchableOpacity style={basic.button} onPress={onQuit}>
                      <Text style={basic.btnText}>Quitter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={basic.buttonOff} onPress={() => setQuit(false)}>
                      <Text style={basic.btnText}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
                {StartGameButton()}
                {CardButton()}
              </View>
              <View style={game.row}>
                <View style={game.col}>{PlayerBar('left')}</View>
                <View style={game.body}>
                  <Text style={game.title}>{room && state[room.state]}</Text>
                  {Messages()}
                  {MessageInput()}
                </View>
                <View style={game.col}>{PlayerBar('right')}</View>
              </View>
              <Modal isVisible={card} animationIn="tada">
                <View style={game.modalView}>
                  <Text style={game.title}>
                    {`Vous êtes ${self ? role[self.role].name : ''}`}
                  </Text>
                  <Text style={game.sub}>{self ? role[self.role].info : ''}</Text>
                  {PlayerCard()}
                  <TouchableOpacity
                    style={basic.button}
                    onPress={() => { Vibration.vibrate([100]); setCard(false); }}
                  >
                    <Text style={basic.btnText}>Compris</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </>
          )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Game;
