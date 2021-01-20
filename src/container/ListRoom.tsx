import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import basic from '../constants/Styles';
import { RoomState } from '../services/types/rooms';

export interface ListRoomProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const ListRoom = (props: ListRoomProps): React.ReactElement => {
  // const [rooms] = useState([]);
  const [rooms] = useState([{
    id: 1, name: 'toto', state: RoomState.READY, players: [4, 8, 9, 9, 6], max: 10,
  }, {
    id: 2, name: 'tata', state: RoomState.LOBBY, players: [4, 8, 9], max: 6,
  }]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        directionalLockEnabled
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
      >
        {
          rooms.length > 0
            ? rooms.map((room) => (
              <View style={styles.list} key={room.id}>
                <View style={styles.row}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.title}
                  >
                    {room.name}
                  </Text>
                  <Text style={styles.title}>{`${room.players.length}/${room.max}`}</Text>
                  <Text style={styles.title}>{room.state === RoomState.READY ? 'En cours' : 'En attente'}</Text>
                  <TouchableOpacity
                    disabled={room.state !== RoomState.LOBBY}
                    onPress={() => {
                      props.navigation.navigate('Game');
                    }}
                    style={room.state === RoomState.LOBBY ? basic.smBtn : basic.smBtnOff}
                  >
                    <Text style={styles.btnTxt}>Jouer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
            : (
              <View style={basic.information}>
                <Text style={basic.infoTxt}>Aucune salle de jeu créée pour le moment.</Text>
              </View>
            )
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1B222F',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  createBody: {
    marginTop: '30%',
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
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: '700',
    flexShrink: 1,
    fontSize: 15,
    marginLeft: 5,
    marginRight: 5,
  },
  btnTxt: {
    fontSize: 13,
    color: 'white',
    fontWeight: '700',
  },
  scrollContent: {
    alignItems: 'center',
  },
  scrollBody: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    paddingTop: '20%',
  },
});

export default ListRoom;
