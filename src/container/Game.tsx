import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
  Vibration,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  MaterialIcons, AntDesign, Ionicons, FontAwesome5,
} from '@expo/vector-icons';
import { Audio } from 'expo-av';
import {
  PlayerState, RoomState, Player, PlayerRole, MessageType,
} from '../services/types/rooms';
import basic from '../constants/Styles';
import game from '../constants/GameStyles';
import rule from '../constants/Rules';
import wolfCard from '../assets/images/loupgarou.png';
import witchCard from '../assets/images/sorciere.png';
import seerCard from '../assets/images/voyant.png';
import villagerCard from '../assets/images/paysan.png';
import * as gameAlert from '../components/gameAlert';

export interface GameProps { navigation: any}

const Game = (props: GameProps): React.ReactElement => {
  const [msg, setMsg] = useState('');
  const [showCard, setshowCard] = useState(false);
  const [self, setSelf] = React.useState<Player>({
    username: 'tata',
    state: PlayerState.ROLE_BASED_ACTION,
    picture: '',
    role: PlayerRole.SEER,
    connected: true,
    messages: [{
      id: 'fwf',
      type: MessageType.SYSTEM_GENERAL,
      content: "En attende de l'admin",
    }, {
      id: 'fw',
      type: MessageType.GENERAL,
      username: 'toto',
      content: 'Hello',
    }, {
      id: '2f',
      type: MessageType.SYSTEM_SELF,
      username: 'tata',
      content: 'Bonjour tout le monde',
    }, {
      id: 'vv',
      type: MessageType.SYSTEM_WOLF,
      content: 'LE joueur toto a été tué',
    }, {
      id: 'vvwf',
      type: MessageType.GENERAL,
      username: 'marc',
      content: "C'est pas moi",
    }, {
      id: 'fwfj',
      type: MessageType.SYSTEM_GENERAL,
      content: "En attende de l'admin",
    }, {
      id: '8fw',
      type: MessageType.GENERAL,
      username: 'toto',
      content: 'Hello',
    }, {
      id: '20f',
      type: MessageType.SYSTEM_SELF,
      username: 'tata',
      content: 'Bonjour tout le monde',
    }, {
      id: 'vv9',
      type: MessageType.SYSTEM_WOLF,
      content: 'LE joueur toto a été tué',
    }, {
      id: 'vv8wf',
      type: MessageType.GENERAL,
      username: 'marc',
      content: "C'est pas moi",
    }],
  });

  const room = {
    id: 'rw',
    name: 'fefe',
    max: 10,
    admin: 'tata',
    players: [{
      id: 1, username: 'marc', state: PlayerState.AWAKE, picture: null, role: PlayerRole.NONE,
    }, {
      id: 2, username: 'toto', state: PlayerState.DEAD, picture: null, role: PlayerRole.NONE,
    }, {
      id: 3, username: 'Thomas', state: PlayerState.AWAKE, picture: null, role: PlayerRole.NONE,
    }, {
      id: 4, username: 'tata', state: PlayerState.AWAKE, picture: null, role: PlayerRole.NONE,
    }],
    state: RoomState.LOBBY,
  };

  const [sound, setSound] = React.useState();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/night.mp3'),
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  React.useEffect(() => (sound
    ? () => {
      sound.unloadAsync();
    }
    : undefined), [sound]);

  const manageVote = (selectedPlayer: Player) => {
    if (selectedPlayer.state === PlayerState.DEAD) {
      Alert.alert(
        'Erreur',
        `Le joueur ${selectedPlayer ? selectedPlayer.username : ''} est décédé`,
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          { text: 'Ok' },
        ],
        { cancelable: false },
      );
    } else if (room.state === RoomState.STARTED
        && self.state === PlayerState.VOTING) gameAlert.voteUser(selectedPlayer);
    else if (room.state === RoomState.STARTED && self.state === PlayerState.ROLE_BASED_ACTION
        && self.role === PlayerRole.WOLF) gameAlert.wolfVote(selectedPlayer);
    else if (room.state === RoomState.STARTED && self.state === PlayerState.ROLE_BASED_ACTION
        && self.role === PlayerRole.SEER) gameAlert.seerVote(selectedPlayer);
    else if (room.state === RoomState.STARTED && self.state === PlayerState.ROLE_BASED_ACTION
        && self.role === PlayerRole.WITCH) gameAlert.witchVote(selectedPlayer, true);
  };

  const showPlayer = (start: number, end: number) => {
    const indents = [];
    if (!room) return;
    for (let i = start; i <= end; i += 1) {
      if (i < room.players.length) {
        indents.push(
          <TouchableOpacity
            onPress={() => {
              manageVote(room.players[i]);
            }}
            style={game.player}
            key={i}
          >
            <View style={game.kickBody}>
              {
                room.players[i].state === PlayerState.DEAD
                && <FontAwesome5 name="ghost" size={50} color="grey" />
              }
              {
                 room.players[i].state !== PlayerState.DEAD && room.players[i].picture
                   && <Image source={{ uri: room.players[i].picture }} style={game.img} />
              }
              {
                 room.players[i].state !== PlayerState.DEAD && !room.players[i].picture
                   && <MaterialIcons name="account-circle" size={50} color="#CDCBD1" />
              }
              {
                room.state === RoomState.LOBBY && room.admin !== room.players[i].username
                  && (
                    <TouchableOpacity
                      style={game.avatarIcon}
                      onPress={() => {
                        gameAlert.kickUser(room.players[i]);
                      }}
                    >
                      <AntDesign name="closecircle" size={15} color="red" />
                    </TouchableOpacity>
                  )
              }
              {
                room.state === RoomState.LOBBY && room.admin === room.players[i].username
                && <FontAwesome5 style={game.avatarIcon} name="crown" size={15} color="orange" />
              }
            </View>
            <Text
              style={game.number}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {room.players[i].username}
            </Text>
          </TouchableOpacity>,
        );
      } else {
        indents.push(
          <View style={[game.player, { opacity: 0.3 }]} key={i}>
            <MaterialIcons name="account-circle" size={50} color="#CDCBD1" />
            <Text style={game.number}>Vide</Text>
          </View>,
        );
      }
    }
    return indents;
  };

  const showMsg = () => (
    <ScrollView
      directionalLockEnabled
      style={game.scrollBody}
    >
      {
       self?.messages.map((msg) => {
         switch (msg.type) {
           case MessageType.GENERAL:
             return (
               <View style={game.col} key={msg.id}>
                 <Text style={game.labelOther}>{msg.username}</Text>
                 <Text style={game.otherMsg}>{msg.content}</Text>
               </View>
             );
           case MessageType.SYSTEM_GENERAL:
             return (
               <View style={game.col} key={msg.id}>
                 <Text style={game.labelSystem}>Système</Text>
                 <Text style={game.system}>{msg.content}</Text>
               </View>
             );
           case MessageType.SYSTEM_SELF:
             return (
               <View style={game.col} key={msg.id}>
                 <Text style={game.labelUser}>{msg.username}</Text>
                 <Text style={game.userMsg}>{msg.content}</Text>
               </View>
             );
           case MessageType.SYSTEM_WOLF:
             return (
               <View style={game.col} key={msg.id}>
                 <Text style={game.labelSystem}>Système Loupgarou</Text>
                 <Text style={game.systemWolf}>{msg.content}</Text>
               </View>
             );
           default:
             return (<></>);
         }
       })
      }
    </ScrollView>
  );

  const sendMsg = () => {
    console.log('msg = ', msg);
  };

  const diplayCard = () => {
    switch (self.role) {
      case PlayerRole.SEER:
        return <Image resizeMode="contain" style={game.card} source={seerCard} />;
        break;
      case PlayerRole.WITCH:
        return <Image resizeMode="contain" style={game.card} source={witchCard} />;
        break;
      case PlayerRole.WOLF:
        return <Image resizeMode="contain" style={game.card} source={wolfCard} />;
        break;
      case PlayerRole.VILLAGER:
        return <Image resizeMode="contain" style={game.card} source={villagerCard} />;
        break;
      default:
        return <Text>Le jeu n'a pas commencé encore.</Text>;
        break;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={game.container}
      >
        <View style={game.header}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Quitter',
                'Êtes vous sûre de quitter le jeu ?',
                [
                  {
                    text: 'Annuler',
                    style: 'cancel',
                  },
                  { text: 'Oui', onPress: () => props.navigation.goBack() },
                ],
                { cancelable: true },
              );
            }}
            style={game.headerIcon}
          >
            <Ionicons name="chevron-back-circle" size={30} color="#CDCBD1" />
          </TouchableOpacity>
          {
            room.state === RoomState.LOBBY && room.admin === self.username
            && (
            <TouchableOpacity
              onPress={() => { Vibration.vibrate([100]); playSound();}}
              style={game.btn}
            >
              <Text style={basic.btnText}>Commencer</Text>
            </TouchableOpacity>
            )
          }
          {
            room.state === RoomState.STARTED
            && (
            <TouchableOpacity
              onPress={() => { setshowCard(true); }}
              style={game.headerIcon}
            >
              <AntDesign name="questioncircle" size={24} color="#CDCBD1" />
            </TouchableOpacity>
            )
          }
        </View>
        <View style={game.row}>
          <View style={game.col}>
            {showPlayer(0, 5)}
          </View>
          <View style={game.body}>
            <Text style={game.title}>{room.state === RoomState.STARTED ? 'En jeu' : 'En attente'}</Text>
            {showMsg()}
            <TextInput
              editable={self && self.state !== PlayerState.DEAD}
              style={basic.input}
              placeholder="Message"
              onChangeText={setMsg}
              value={msg}
              onSubmitEditing={sendMsg}
              returnKeyType="send"
            />
          </View>
          <View style={game.col}>
            {showPlayer(6, 11)}
          </View>
        </View>
        <Modal isVisible={showCard} animationIn="tada">
          <View style={game.modalView}>
            <Text style={game.title}>
              Vous êtes
              {rule[self.role].name}
            </Text>
            <Text style={game.sub}>{rule[self.role].info}</Text>
            {diplayCard()}
            <TouchableOpacity style={basic.button} onPress={() => { setshowCard(false); }}>
              <Text style={basic.btnText}>Compris</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Game;
