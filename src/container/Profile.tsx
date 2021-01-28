import React from 'react';
import {
  StyleSheet, View, Text, Image, TouchableOpacity,
} from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import basic from '../constants/Styles';
import { useStoreActions, useStoreState } from '../store';

export interface SettingsProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const Profile = ({ navigation }: SettingsProps): React.ReactElement => {
  const user = useStoreState((state) => state.user.data);
  const setUser = useStoreActions((actions) => actions.user.setUser);

  const signOut = () => {
    setUser(undefined);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {
        user && user.picture
          ? <Image source={{ uri: user.picture }} style={styles.img} />
          : <MaterialIcons style={styles.avatar} name="account-circle" size={80} color="#CDCBD1" />
      }
      <View style={styles.profile}>
        <View style={basic.row}>
          <MaterialCommunityIcons style={basic.icon} name="account" size={20} color="#CDCBD1" />
          <Text style={styles.txt}>{user?.username}</Text>
        </View>
        <View style={basic.row}>
          <MaterialIcons name="email" style={basic.icon} size={20} color="#CDCBD1" />
          <Text style={styles.txt}>{user?.email}</Text>
        </View>
        <View style={basic.row}>
          <Entypo name="lock" size={20} style={basic.icon} color="#CDCBD1" />
          <Text style={styles.txt}>••••••</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('UpdateProfile')}
        style={basic.button}
      >
        <Text style={basic.btnText}>Modifier</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={signOut} style={basic.button}>
        <Text style={basic.btnText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1B222F',
    justifyContent: 'center',
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 20,
  },
  profile: {
    alignItems: 'flex-start',
  },
  txt: {
    color: 'white',
    marginLeft: 10,
    marginBottom: 15,
    fontSize: 24,
    fontWeight: '400',
  },
});

export default Profile;
