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
  StyleSheet,
  ActivityIndicator,
  ImageSourcePropType,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  NavigationScreenProp, NavigationState, NavigationParams, NavigationRoute,
} from 'react-navigation';
import {
  AntDesign, Ionicons,
} from '@expo/vector-icons';
import { Audio } from 'expo-av';
import {
  PlayerState, RoomState, Player, PlayerRole, MessageType, Room, RoomGetOneInput, Message,
} from '../services/types/rooms';
import basic from '../constants/Styles';
import game from '../constants/GameStyles';
import wolfCard from '../assets/images/loupgarou.png';
import witchCard from '../assets/images/sorciere.png';
import seerCard from '../assets/images/voyant.png';
import villagerCard from '../assets/images/paysan.png';
import NightSong from '../assets/audio/night.mp3';
import services, { GameEvents, GameInstance } from '../services';

import { RealNavigationEventPayload } from '../navigation/BottomTab';

import { useStoreActions, useStoreState } from '../store';
import { ExpiredSessionRedirect } from '../utils';
import GamePlayer from '../components/GamePlayer';

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
  const [room, setRoom] = useState<Room | undefined>();
  const [admin, setAdmin] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [self, setSelf] = useState<Player | undefined>();
  const [mode, setMode] = useState<'general' | 'wolf'>('general');
  const [message, setMessage] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [instance, setInstance] = useState<GameInstance | undefined>();
  const [music, setMusic] = useState<Audio.Sound>();

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
      name: 'Loupgragou',
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

  useEffect(() => {
    if (music) music.unloadAsync();
  }, [music]);

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
    if (instance || !user) return;

    const init = async () => {
      try {
        const { id } = route.params as Room;
        const input:RoomGetOneInput = { id };

        const res = await services.rooms.getOne(user, input);
        const me = res.players.find(({ username }) => username === user.username) as Player;

        setRoom(res);
        setAdmin(res.admin);
        setPlayers([...res.players]);
        setSelf(me);
        setMessages(me ? [...me.messages] : []);

        const onUserKicked = (payload: Player[]) => {
          if (!payload.find((p) => p.username === user.username)) disconnect();
          else setPlayers([...payload]);
        };

        const onGameStarted = async () => {
          try {
            const r = await services.rooms.getOne(user, { id: room?.id as string });
            const m = res.players.find(({ username }) => username === user.username) as Player;

            setRoom(r);
            setAdmin(r.admin);
            setPlayers([...r.players]);
            setSelf(m);
            setMessages([...m.messages]);
          } catch (e) {
            const error = e as Error;

            switch (error.message) {
              case 'auth/invalid-token':
                ExpiredSessionRedirect(navigation, setUser);
                break;
              default:
            }
          }

          setCard(true);
        };

        const events: GameEvents = {
          connect: () => setLoading(false),
          'admin-change': (payload: string) => setAdmin(payload),
          'new-message': (payload: Message[]) => setMessages([...payload]),
          'user-joined': (payload: Player[]) => setPlayers([...payload]),
          'user-leaved': (payload: Player[]) => setPlayers([...payload]),
          'user-kicked': onUserKicked,
          'game-started': onGameStarted,
        };

        setInstance(new GameInstance(res, user.token, events));
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
  }, [navigation, route, instance, room, user, setUser, disconnect]);

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
      <TouchableOpacity style={styles.btn}>
        <Text
          style={basic.btnText}
          onPress={async () => {
            instance?.startGame();

            const res = await Audio.Sound.createAsync({ uri: NightSong });
            setMusic(res.sound);

            await res.sound.playAsync();
          }}
        >
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
    const right = [1, 3, 4, 6, 8, 10];
    const indexes = side === 'left' ? left : right;

    return indexes.map((index) => {
      const player = players.find((p, i) => i === index);

      return (
        <GamePlayer
          key={index}
          instance={instance}
          room={room as Room}
          admin={admin as string}
          player={player}
        />
      );
    });
  };

  const PlayerCard = () => {
    if (!self || !room || room.state !== RoomState.STARTED) {
      return (<Text style={styles.card}>Le jeu n&apos;a pas commencé encore</Text>);
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
      directionalLockEnabled
      style={game.scrollBody}
    >
      {
       messages.map(({
         type, id, username, content,
       }) => {
         switch (type) {
           case MessageType.GENERAL:
             return (
               <View style={game.col} key={id}>
                 <Text style={game.labelOther}>{username}</Text>
                 <Text style={game.otherMsg}>{content}</Text>
               </View>
             );
           case MessageType.SYSTEM_GENERAL:
             return (
               <View style={game.col} key={id}>
                 <Text style={game.labelSystem}>Système</Text>
                 <Text style={game.system}>{content}</Text>
               </View>
             );
           case MessageType.SYSTEM_SELF:
             return (
               <View style={game.col} key={id}>
                 <Text style={game.labelUser}>{username}</Text>
                 <Text style={game.userMsg}>{content}</Text>
               </View>
             );
           case MessageType.SYSTEM_WOLF:
             return (
               <View style={game.col} key={id}>
                 <Text style={game.labelSystem}>Système Loup-garou</Text>
                 <Text style={game.systemWolf}>{content}</Text>
               </View>
             );
           default:
             return (<></>);
         }
       })
      }
    </ScrollView>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={game.container}
      >
        {loading
          ? (<ActivityIndicator style={styles.loader} size="large" color="#EF864F" />)
          : (
            <>
              <View style={game.header}>
                <TouchableOpacity style={game.headerIcon} onPress={() => setQuit(true)}>
                  <Ionicons name="chevron-back-circle" size={30} color="#CDCBD1" />
                </TouchableOpacity>
                <Modal isVisible={quit} animationIn="tada">
                  <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Êtes-vous sûr de vouloir quitter ?</Text>
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
                  <TextInput
                    editable={room && room.state !== RoomState.LOBBY
                      && self && self.state !== PlayerState.DEAD}
                    style={basic.input}
                    placeholder="Message"
                    placeholderTextColor="gray"
                    onChangeText={setMessage}
                    value={message}
                    onSubmitEditing={onSendMessage}
                    returnKeyType="send"
                  />
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
                    onPress={() => {
                      Vibration.vibrate([100]); setCard(false);
                    }}
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

const styles = StyleSheet.create({
  loader: {
    flexGrow: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#1b222f',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    color: 'white',
    fontWeight: '700',
    flexShrink: 1,
    fontSize: 18,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#48D23F',
    borderRadius: 20,
    padding: 5,
    width: 120,
    marginLeft: -60,
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    position: 'absolute',
    left: '50%',
  },
  card: {
    color: 'white',
    marginBottom: 20,
  },
});
