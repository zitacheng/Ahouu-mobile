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
} from 'react-native';
import Modal from 'react-native-modal';
import {
  MaterialIcons, AntDesign, Ionicons, FontAwesome5
} from '@expo/vector-icons';
import {
  PlayerState, RoomState, Player, PlayerRole,
} from '../services/types/rooms';
import basic from '../constants/Styles';
import game from '../constants/GameStyles';
import rule from '../constants/Rules';
import wolfCard from '../assets/images/loupgarou.png';
import witchCard from '../assets/images/sorciere.png';
import seerCard from '../assets/images/voyant.png';
import villagerCard from '../assets/images/paysan.png';

export interface GameProps { navigation: any}

const Game = (props: GameProps): React.ReactElement => {
  const [msg, setMsg] = useState('');
  const [thePlayer, setThePlayer] = useState(null);
  const [playerAction, setPlayerAction] = useState(false);
  const [showCard, setshowCard] = useState(false);
  const [self, setSelf] = React.useState<Player>({
    username: 'tata', state: PlayerState.AWAKE, picture: '', role: PlayerRole.WITCH, messages: [], connected: true,
  });

  const room = {
    id: 'rw',
    name: 'fefe',
    max: 10,
    players: [{
      id: 1, username: 'marc', state: PlayerState.AWAKE, picture: null, role: PlayerRole.NONE,
    }, {
      id: 2, username: 'toto', state: PlayerState.DEAD, picture: null, role: PlayerRole.NONE,
    }, {
      id: 3, username: 'Thomas', state: PlayerState.AWAKE, picture: null, role: PlayerRole.NONE,
    }],
    state: RoomState.LOBBY,
  };

  const kickUser = () => {
    Alert.alert(
      'Attention',
      `Êtes vous sûre de vouloir exclure ${thePlayer ? thePlayer.username : 'ce joueur'} du jeu ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        { text: 'Oui', onPress: () => console.log('KICK USER') },
      ],
      { cancelable: false },
    );
  };

  const showPlayer = (start: number, end: number) => {
    const indents = [];
    if (!room) return;
    for (let i = start; i <= end; i += 1) {
      if (i < room.players.length) {
        indents.push(
          <View style={game.player} key={i}>
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
                room.state === RoomState.LOBBY
                && (
                <TouchableOpacity style={game.kick} onPress={() => { setThePlayer(room.players[i]); kickUser(); }}>
                  <AntDesign name="closecircle" size={15} color="red" />
                </TouchableOpacity>
                )
              }
            </View>
            <Text
              style={game.number}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {room.players[i].username}
            </Text>
          </View>,
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
      <View style={game.col}>
        <Text style={game.labelSystem}>System</Text>
        <Text style={game.system}>En attente</Text>
      </View>
      <View style={game.col}>
        <Text style={game.labelUser}>Toto</Text>
        <Text style={game.userMsg}>Hello</Text>
      </View>
      <View style={game.col}>
        <Text style={game.labelOther}>Tata</Text>
        <Text style={game.otherMsg}>JE suis villageoios</Text>
      </View>
      <View style={game.col}>
        <Text style={game.labelSystem}>System</Text>
        <Text style={game.system}>Le jeu commence</Text>
      </View>
      <View style={game.col}>
        <Text style={game.labelOther}>titi</Text>
        <Text style={game.otherMsg}>ALLo</Text>
      </View>
      <View style={game.col}>
        <Text style={game.labelOther}>titi</Text>
        <Text style={game.otherMsg}>Bonjour</Text>
      </View>
      <View style={game.col}>
        <Text style={game.labelUser}>Toto</Text>
        <Text style={game.userMsg}>qui est la</Text>
      </View>
    </ScrollView>
  );

  const sendMsg = () => {
    console.log('msg = ', msg);
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
          <TouchableOpacity
            onPress={() => { setshowCard(true); }}
            style={game.headerIcon}
          >
            <AntDesign name="questioncircle" size={24} color="#CDCBD1" />
          </TouchableOpacity>
        </View>
        <View style={game.row}>
          <View style={game.col}>
            {showPlayer(0, 5)}
          </View>
          <View style={game.body}>
            <Text style={game.title}>{room.state === RoomState.LOBBY ? 'En attente' : 'En jeu'}</Text>
            {showMsg()}
            <TextInput
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
            <Image resizeMode="contain" style={game.card} source={witchCard} />
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
