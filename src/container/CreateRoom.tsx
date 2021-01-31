import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import basic from '../constants/Styles';
import services, { RoomCreateInput } from '../services';
import { useStoreActions, useStoreState } from '../store';
import { ExpiredSessionRedirect } from '../utils';

export interface HomeProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const CreateRoom = ({ navigation }: HomeProps): React.ReactElement => {
  const user = useStoreState((state) => state.user.data);
  const setUser = useStoreActions((actions) => actions.user.setUser);

  const [max, setMax] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const createRoom = async () => {
    if (!user) return;

    setLoading(true);

    if (!max) {
      Toast.show({
        type: 'error',
        text1: 'Informations manquantes',
        text2: 'Remplissez le nombre maximal de joueur.',
      });
      return;
    }

    try {
      const input: RoomCreateInput = {
        max: Number.isNaN(max) ? 0 : Number(max),
        name: !name ? undefined : name,
        password: !password ? undefined : password,
      };

      const room = await services.rooms.create(user, input);

      navigation.navigate('Game', room);
    } catch (e) {
      const { message } = e as Error;

      switch (message) {
        case 'auth/invalid-token':
          ExpiredSessionRedirect(navigation, setUser);
          break;
        case 'rooms/invalid-max':
          Toast.show({
            type: 'error',
            text1: 'Erreur',
            text2: 'Le nombre de joueurs doit être compris entre 4 et 12 (inclus).',
          });
          break;
        case 'rooms/invalid-password':
          Toast.show({
            type: 'error',
            text1: 'Erreur',
            text2: 'Le mot de passe doit contenir des letters et/ou des chiffres et faire au moins 6 caractères.',
          });
          break;
        case 'rooms/room-name-already-in-use':
          Toast.show({
            type: 'error',
            text1: 'Mot de passe invalide',
            text2: 'Le nom de la salle est déjà utilisée.',
          });
          break;
        default:
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={basic.container}
      >
        <Text style={styles.title}>Créer une salle</Text>
        <View style={basic.body}>
          <View style={basic.row}>
            <MaterialCommunityIcons style={basic.icon} name="account" size={20} color="#CDCBD1" />
            <TextInput
              style={basic.input}
              placeholder="Name"
              placeholderTextColor="grey"
              maxLength={16}
              autoCapitalize="none"
              onChangeText={setName}
              value={name}
            />
          </View>
          <View style={basic.row}>
            <Entypo name="game-controller" size={20} style={basic.icon} color="#CDCBD1" />
            <TextInput
              style={basic.input}
              placeholder="Nombre de joueurs maximum"
              placeholderTextColor="grey"
              autoCapitalize="none"
              keyboardType="numeric"
              maxLength={2}
              onChangeText={(value) => setMax(value.replace(/[^0-9]/g, ''))}
              value={max}
            />
          </View>
          <View style={basic.row}>
            <Entypo name="lock" size={20} style={basic.icon} color="#CDCBD1" />
            <TextInput
              style={basic.input}
              placeholder="Mot de passe"
              placeholderTextColor="grey"
              autoCapitalize="none"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
          </View>
          <Text style={styles.info}>Rentrez un mot de passe pour que la salle soit en privée.</Text>
          <TouchableOpacity
            onPress={createRoom}
            style={loading ? basic.buttonOff : basic.button}
            disabled={loading}
          >
            <Text style={basic.btnText}>Créer</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontWeight: '900',
    fontSize: 28,
    marginBottom: 20,
  },
  info: {
    color: 'white',
    fontSize: 12,
    alignSelf: 'center',
  },
});

export default CreateRoom;
