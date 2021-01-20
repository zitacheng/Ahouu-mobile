import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Keyboard,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import wolf from '../assets/images/wolf.png';
import basic from '../constants/Styles';

export interface LoginProps { navigation: any}

const Login = (props: LoginProps): React.ReactElement => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function authenticate() {
    if (!username || !password) {
      Alert.alert(
        'Error',
        'Please enter password and username',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          { text: 'OK' },
        ],
        { cancelable: false },
      );
    } else {
      console.log('authenticate');
      props.navigation.navigate('Home');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Image style={styles.logo} source={wolf} />
        <View style={basic.body}>
          <View style={styles.row}>
            <MaterialCommunityIcons style={basic.icon} name="account" size={20} color="#CDCBD1" />
            <TextInput
              style={basic.input}
              placeholder="Pseudo"
              autoCapitalize="none"
              onChangeText={setUsername}
              value={username}
            />
          </View>
          <View style={styles.row}>
            <Entypo name="lock" style={basic.icon} size={20} color="#CDCBD1" />
            <TextInput
              style={basic.input}
              placeholder="Mot de passe"
              onChangeText={setPassword}
              secureTextEntry
              value={password}
            />
          </View>
          <TouchableOpacity onPress={authenticate} style={basic.button}>
            <Text style={basic.btnText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Register');
            }}
            style={basic.button}
          >
            <Text style={basic.btnText}>S'inscrire</Text>
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
    width: 160,
    height: 160,
  },
});

export default Login;
