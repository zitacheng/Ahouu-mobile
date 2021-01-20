import React, { useState, useEffect } from 'react';
import {
  Alert, Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import ProfileForm from '../components/ProfileForm';
import basic from '../constants/Styles';

export interface RegisterProps { navigation: any}

const Register = (props: RegisterProps) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  function registerUser() {
    if (!email || !password || !username) {
      Alert.alert(
        'Error',
        'Please fill email password and username',
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
      console.log('register');
      props.navigation.navigate('Home');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={basic.container}
      >
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
          style={basic.back}
        >
          <Ionicons name="chevron-back-circle" size={30} color="#CDCBD1" />
        </TouchableOpacity>
        {ProfileForm(username, setUsername, email,
          setEmail, password, setPassword, setImage, image, "S'inscrire", registerUser)}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Register;
