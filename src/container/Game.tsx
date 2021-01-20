import React, { useState } from 'react';
import {
  StyleSheet,
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
  MaterialIcons, MaterialCommunityIcons, AntDesign, Ionicons,
} from '@expo/vector-icons';
import { PlayerState, RoomState } from '../services/types/rooms';
import basic from '../constants/Styles';

export interface GameProps { navigation: any}

const Game = (props: GameProps): React.ReactElement => {
  const [msg, setMsg] = useState('');
  const [thePlayer, setThePlayer] = useState(null);
  const [playerAction, setPlayerAction] = useState(true);

  const room = {
    id: 'rw',
    name: 'fefe',
    max: 10,
    players: [{
      id: 1, username: 'marc', state: PlayerState.AWAKE, picture: null, role: 'none',
    }, {
      id: 2, username: 'toto', state: PlayerState.DEAD, picture: null, role: 'none',
    }, {
      id: 3, username: 'tata', state: PlayerState.AWAKE, picture: null, role: 'none',
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
          <View style={styles.player} key={i}>
            <View style={styles.kickBody}>
              {
                room.players[i].state === PlayerState.DEAD
                && <MaterialCommunityIcons name="grave-stone" size={50} color="black" />
              }
              {
                 room.players[i].state !== PlayerState.DEAD && room.players[i].picture
                   && <Image source={{ uri: room.players[i].picture }} style={styles.img} />
              }
              {
                 room.players[i].state !== PlayerState.DEAD && !room.players[i].picture
                   && <MaterialIcons name="account-circle" size={50} color="#CDCBD1" />
              }
              {
                room.state === RoomState.LOBBY
                && (
                <TouchableOpacity style={styles.kick} onPress={() => { setThePlayer(room.players[i]); kickUser(); }}>
                  <AntDesign name="closecircle" size={15} color="red" />
                </TouchableOpacity>
                )
              }
            </View>
            <Text style={styles.number}>{i + 1}</Text>
          </View>,
        );
      } else {
        indents.push(
          <View style={[styles.player, { opacity: 0.3 }]} key={i}>
            <MaterialIcons name="account-circle" size={50} color="#CDCBD1" />
            <Text style={styles.number}>{i + 1}</Text>
          </View>,
        );
      }
    }
    return indents;
  };

  const showMsg = () => (
    <ScrollView
      directionalLockEnabled
      style={styles.scrollBody}
    >
      <View style={styles.col}>
        <Text style={styles.labelSystem}>System</Text>
        <Text style={styles.system}>En attente</Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.labelUser}>Toto</Text>
        <Text style={styles.userMsg}>Hello</Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.labelOther}>Tata</Text>
        <Text style={styles.otherMsg}>JE suis villageoios</Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.labelSystem}>System</Text>
        <Text style={styles.system}>Le jeu commence</Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.labelOther}>titi</Text>
        <Text style={styles.otherMsg}>ALLo</Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.labelOther}>titi</Text>
        <Text style={styles.otherMsg}>Bonjour</Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.labelUser}>Toto</Text>
        <Text style={styles.userMsg}>qui est la</Text>
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
        style={styles.container}
      >
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
          style={styles.back}
        >
          <Ionicons name="chevron-back-circle" size={30} color="#CDCBD1" />
        </TouchableOpacity>
        <View style={styles.row}>
          <View style={styles.col}>
            {showPlayer(0, 5)}
          </View>
          <View style={styles.body}>
            <Text style={styles.title}>{room.state === RoomState.LOBBY ? 'En attente' : 'En jeu'}</Text>
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
          <View style={styles.col}>
            {showPlayer(6, 11)}
          </View>
        </View>
        <Modal isVisible={playerAction}>
          <View style={styles.modalView}>
            <Text>I am the modal content!</Text>
            <TouchableOpacity style={basic.button} onPress={() => { setPlayerAction(false); }}>
              <Text>Hide </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1B222F',
    paddingTop: '10%',
  },
  row: {
    flexDirection: 'row',
    display: 'flex',
    height: '85%',
  },
  col: {
    flexDirection: 'column',
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },
  colMsg: {
    flexDirection: 'column',
    display: 'flex',
    flex: 1,
  },
  body: {
    flexDirection: 'column',
    display: 'flex',
    backgroundColor: '#33466F',
    width: '60%',
    borderRadius: 5,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    padding: 10,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: '700',
    fontSize: 24,
    marginBottom: 20,
  },
  player: {
    backgroundColor: '#33466F',
    borderRadius: 5,
    marginRight: 5,
    marginLeft: 5,
    display: 'flex',
    alignItems: 'center',
    padding: 5,
  },
  number: {
    color: 'white',
    fontWeight: '800',
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  kickBody: {
    position: 'relative',
  },
  kick: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  back: {
    width: '90%',
    paddingBottom: 10,
  },
  scrollBody: {
    width: '95%',
    marginBottom: 20,
  },
  system: {
    color: 'yellow',
    textAlign: 'center',
  },
  userMsg: {
    backgroundColor: '#EF864F',
    padding: 5,
    color: 'white',
    alignSelf: 'flex-start',
    borderRadius: 10,
    overflow: 'hidden',
  },
  otherMsg: {
    backgroundColor: 'grey',
    padding: 5,
    color: 'white',
    alignSelf: 'flex-end',
    borderRadius: 10,
    overflow: 'hidden',
  },
  labelSystem: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'center',
    marginTop: 10,
  },
  labelOther: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'flex-end',
    margin: 3,
    marginTop: 5,
  },
  labelUser: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'flex-start',
    margin: 3,
    marginTop: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
  centeredView: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
});

export default Game;
