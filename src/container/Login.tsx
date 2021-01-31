import React, { useEffect, useState } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Keyboard,
  Text,
  TouchableOpacity,
  Image,
  Vibration,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import logo from '../assets/images/logo.png';
import basic from '../constants/Styles';
import services from '../services';
import { useStoreActions, useStoreState } from '../store';

export interface LoginProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const Login = ({ navigation }: LoginProps) => {
  const user = useStoreState((state) => state.user.data);
  const setUser = useStoreActions((actions) => actions.user.setUser);

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const autoSingIn = async () => {
      if (user) {
        try {
          const valid = await services.users.verify(user);

          if (!valid) setUser(undefined);
          else navigation.navigate('Home');
        } catch (e) {
          // Silently skip error, token invalid or expired, login required
        }
      }
    };

    autoSingIn();
  }, [user, setUser, navigation]);

  const signIn = async () => {
    if (!emailOrUsername || !password) {
      Vibration.vibrate([100]);
      Toast.show({
        type: 'error',
        text1: 'Informations manquantes',
        text2: "Remplissez votre email/nom d'utilisateur et mot de passe.",
      });
      return;
    }

    try {
      const data = await services.users.signIn(emailOrUsername, password);
      setUser(data);

      navigation.navigate('Home');
    } catch (e) {
      const { message } = e as Error;
      Vibration.vibrate([100]);

      switch (message) {
        case 'auth/invalid-body':
        case 'auth/invalid-email-or-password':
        case 'auth/invalid-password':
          Toast.show({
            type: 'error',
            text1: 'Erreur',
            text2: 'Une erreur est survenue, veuillez réessayer.',
          });
          break;
        case 'auth/user-not-found':
          Toast.show({
            type: 'error',
            text1: "Email/Nom d'utilisateur invalide",
            text2: "Votre email/nom d'utilisateur est incorrect.",
          });
          break;
        case 'auth/invalid-credentials':
          Toast.show({
            type: 'error',
            text1: 'Mot de passe invalide',
            text2: 'Votre mot de passe est incorrect.',
          });
          break;
        default:
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Image resizeMode="contain" style={styles.logo} source={logo as ImageSourcePropType} />
        <View style={basic.body}>
          <View style={basic.row}>
            <MaterialCommunityIcons style={basic.icon} name="account" size={20} color="#CDCBD1" />
            <TextInput
              style={basic.input}
              placeholder="Email ou nom d'utilusateur"
              placeholderTextColor="grey"
              autoCapitalize="none"
              onChangeText={setEmailOrUsername}
              value={emailOrUsername}
            />
          </View>
          <View style={basic.row}>
            <Entypo name="lock" style={basic.icon} size={20} color="#CDCBD1" />
            <TextInput
              style={basic.input}
              placeholder="Mot de passe"
              placeholderTextColor="grey"
              onChangeText={setPassword}
              secureTextEntry
              value={password}
            />
          </View>
          <TouchableOpacity onPress={signIn} style={basic.button}>
            <Text style={basic.btnText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={basic.button}
          >
            <Text style={basic.btnText}>S&apos;inscrire</Text>
          </TouchableOpacity>
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
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginTop: '30%',
    marginBottom: 20,
    width: '90%',
    height: '20%',
  },
});

export default Login;
