import React, { useState, useEffect } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  MaterialIcons, Entypo, Ionicons, MaterialCommunityIcons,
} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
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
        <View style={basic.body}>
          <TouchableOpacity onPress={pickImage} style={styles.camera}>
            {
            image
              ? <Image source={{ uri: image }} style={styles.img} />
              : <MaterialIcons name="account-circle" size={70} color="#CDCBD1" />
          }
          </TouchableOpacity>
          <View style={styles.row}>
            <MaterialCommunityIcons style={basic.icon} name="account" size={20} color="#CDCBD1" />
            <TextInput
              autoCapitalize="none"
              style={basic.input}
              placeholder="Pseudo"
              onChangeText={setUsername}
              value={username}
            />
          </View>
          <View style={styles.row}>
            <MaterialIcons name="email" style={basic.icon} size={20} color="#CDCBD1" />
            <TextInput
              autoCapitalize="none"
              style={basic.input}
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
            />
          </View>
          <View style={styles.row}>
            <Entypo name="lock" size={20} style={basic.icon} color="#CDCBD1" />
            <TextInput
              style={basic.input}
              secureTextEntry
              placeholder="Mot de passe"
              onChangeText={setPassword}
              value={password}
            />
          </View>
          <TouchableOpacity onPress={registerUser} style={basic.button}>
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
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  back: {
    position: 'absolute',
    top: 60,
    left: 30,
  },
  camera: {
    marginBottom: 30,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});

export default Register;
