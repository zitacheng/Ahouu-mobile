import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import RoomItem from '../components/RoomItem';
import services from '../services';
import { Room } from '../services/types/rooms';
import { useStoreActions, useStoreState } from '../store';
import { ExpiredSessionRedirect } from '../utils';

export interface ListRoomProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const ListRoom = ({ navigation }: ListRoomProps) => {
  const user = useStoreState((state) => state.user.data);
  const setUser = useStoreActions((actions) => actions.user.setUser);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;

    try {
      setRooms(await services.rooms.getAll(user));
    } catch (e) {
      const { message } = e as Error;

      switch (message) {
        case 'auth/invalid-token':
          ExpiredSessionRedirect(navigation, setUser);
          break;
        default:
      }
    }
  }, [navigation, user, setUser]);

  useEffect(() => {
    setLoading(true);

    refresh()
      .then(() => new Promise<void>((next) => setTimeout(() => next(), 750)))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));

    const unsubscribe = navigation.addListener('focus', () => { refresh(); });

    return unsubscribe.remove;
  }, [navigation, refresh]);

  const onRefresh = async () => {
    setRefreshing(true);

    await refresh();

    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.mainTitle}>Liste des salles</Text>
      </View>
      {loading
        ? (<ActivityIndicator style={styles.loader} size="large" color="#EF864F" />)
        : (
          <View style={{ flex: 1 }}>
            <ScrollView
              directionalLockEnabled
              style={styles.scrollBody}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              refreshControl={(
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  progressBackgroundColor="black"
                  colors={['#EF864F']}
                  tintColor="#EF864F"
                />
            )}
            >
              {
                rooms.length === 0
                  ? (
                    <View style={styles.infoContainer}>
                      <MaterialIcons style={styles.icon} name="no-meeting-room" size={100} color="#CDCBD1" />
                      <Text style={styles.info}>Aucune salle de jeu créée pour le moment.</Text>
                    </View>
                  )
                  : rooms.map((room) => (
                    <RoomItem
                      key={room.id}
                      navigation={navigation}
                      room={room}
                    />
                  ))
            }
            </ScrollView>
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B222F',
  },
  titleContainer: {
    paddingTop: '20%',
    alignItems: 'center',
  },
  infoContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    flexGrow: 1,
  },
  createBody: {
    marginTop: '30%',
  },
  mainTitle: {
    color: 'white',
    fontWeight: '900',
    fontSize: 28,
    marginBottom: 20,
  },
  info: {
    color: 'white',
    fontSize: 14,
    padding: 10,
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 25,
  },
  scrollBody: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});

export default ListRoom;
