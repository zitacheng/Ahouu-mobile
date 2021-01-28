import { Entypo, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import Modal from 'react-native-modal';
import { TextInput } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import basic from '../constants/Styles';
import services, { User } from '../services';
import { Room, RoomJoinInput, RoomState } from '../services/types/rooms';
import { useStoreActions, useStoreState } from '../store';
import { ExpiredSessionRedirect } from '../utils';

export interface RoomItemProps {
  room: Room
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const RoomItem = ({ room, navigation }: RoomItemProps) => {
  const user = useStoreState((state) => state.user.data) as User;
  const setUser = useStoreActions((actions) => actions.user.setUser);

  const [secured, setSecured] = useState(false);
  const [password, setPassword] = useState('');

  const onJoin = () => {
    if (room.private) setSecured(true);
    // TODO: go to game with room id
    else navigation.navigate('Game');
  };

  const onSecuredJoin = async () => {
    try {
      const input: RoomJoinInput = {
        id: room.id,
        password,
      };

      await services.rooms.join(user, input);
      setSecured(false);

      // TODO: go to game with room id
      navigation.navigate('Game');
    } catch (e) {
      setPassword('');
      setSecured(false);
      const { message } = e as Error;

      switch (message) {
        case 'auth/invalid-token':
          ExpiredSessionRedirect(navigation, setUser);
          break;
        case 'rooms/invalid-body':
        case 'rooms/room-not-found':
        case 'rooms/invalid-password':
          Toast.show({
            type: 'error',
            text1: 'Mot de passe invalide',
            text2: 'Le mot de passe est invalide.',
          });
          break;
        default:
      }
    }
  };

  return (
    <View style={styles.list} key={room.id}>
      <View style={styles.row}>
        <MaterialIcons
          style={styles.icon}
          name={room.private ? 'lock' : 'meeting-room'}
          size={25}
          color="#CDCBD1"
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.title, { flex: 1 }]}
        >
          {room.name}
        </Text>
        <Text style={styles.title}>{`${room.players.length}/${room.max}`}</Text>
        <Text style={styles.title}>{room.state === RoomState.READY ? 'En cours' : 'En attente'}</Text>
        <TouchableOpacity
          disabled={room.state !== RoomState.LOBBY}
          onPress={onJoin}
          style={room.state === RoomState.LOBBY ? basic.smBtn : basic.smBtnOff}
        >
          <Text style={styles.btnTxt}>Jouer</Text>
        </TouchableOpacity>
        <Modal isVisible={secured} animationIn="fadeIn">
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Entrez le mot de passe</Text>
            <View style={basic.row}>
              <Entypo name="lock" size={20} style={basic.icon} color="#CDCBD1" />
              <TextInput
                style={basic.input}
                secureTextEntry
                placeholderTextColor="grey"
                placeholder="Mot de passe"
                onChangeText={setPassword}
                value={password}
              />
            </View>
            <TouchableOpacity style={basic.button} onPress={onSecuredJoin}>
              <Text style={basic.btnText}>Rejoindre</Text>
            </TouchableOpacity>
            <TouchableOpacity style={basic.buttonOff} onPress={() => setSecured(false)}>
              <Text style={basic.btnText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 2,
    alignItems: 'center',
  },
  list: {
    backgroundColor: '#33466F',
    width: '95%',
    borderRadius: 30,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    padding: 5,
    marginTop: '5%',
  },
  title: {
    color: 'white',
    fontWeight: '700',
    flexShrink: 1,
    fontSize: 15,
    marginLeft: 5,
    marginRight: 5,
  },
  icon: {
    paddingRight: 5,
    alignSelf: 'center',
  },
  btnTxt: {
    fontSize: 13,
    color: 'white',
    fontWeight: '700',
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
    marginTop: 5,
    marginBottom: 20,
  },
});

export default RoomItem;