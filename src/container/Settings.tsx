import { StackActions } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  MaterialIcons, Entypo, Ionicons, MaterialCommunityIcons,
} from '@expo/vector-icons';
import basic from '../constants/Styles';

export interface SettingsProps { navigation: any}

const Settings = (props: SettingsProps): React.ReactElement => {
  const [edit, setEdit] = useState(false);
  const [user] = useState({
    id: 1, username: 'zita', picture: null, email: 'zita.cheng@epitech.eu',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {
        user && user.picture
          ? <Image source={{ uri: user.picture }} style={styles.img} />
          : <MaterialIcons style={styles.avatar} name="account-circle" size={80} color="#CDCBD1" />
      }
      <View style={styles.row}>
        <MaterialCommunityIcons style={basic.icon} name="account" size={20} color="#CDCBD1" />
        <Text style={styles.txt}>{user?.username}</Text>
      </View>
      <View style={styles.row}>
        <MaterialIcons name="email" style={basic.icon} size={20} color="#CDCBD1" />
        <Text style={styles.txt}>{user?.email}</Text>
      </View>
      <View style={styles.row}>
        <Entypo name="lock" size={20} style={basic.icon} color="#CDCBD1" />
        <Text style={styles.txt}>••••</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          
        }}
        style={basic.button}
      >
        <Text style={basic.btnText}>Modifier</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.navigation.dispatch(StackActions.popToTop());
        }}
        style={basic.button}
      >
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
  row: {
    flexDirection: 'row',
    display: 'flex',
    width: '70%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#33466F',
    borderWidth: 0.2,
    borderRadius: 20,
    marginLeft: 5,
    backgroundColor: '#33466F',
    marginBottom: 20,
    paddingTop: 10,
    paddingLeft: 10,
  },
  txt: {
    color: 'white',
    marginLeft: 10,
    marginBottom: 15,
    fontSize: 24,
    fontWeight: '400',
  },
});

export default Settings;
