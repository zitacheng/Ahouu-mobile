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
import {
  MaterialIcons, MaterialCommunityIcons, AntDesign, Ionicons,
} from '@expo/vector-icons';
import { PlayerState, RoomState } from '../services/types/rooms';
import basic from '../constants/Styles';

const Game = (): React.ReactElement => {
  const [msg, setMsg] = useState('');

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
                <TouchableOpacity style={styles.kick}>
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
    <ScrollView>
      <Text>Test MSG</Text>
      <Text>Test MSG</Text>
      <Text>Test MSG</Text>
      <Text>Test MSG</Text>
      <Text>Test MSG</Text>
      <Text>Test MSG</Text>
      <Text>Test MSG</Text>
      <Text>Test MSG</Text>
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
            props.navigation.goBack();
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
});

export default Game;
