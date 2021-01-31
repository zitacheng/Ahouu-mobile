import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons,
} from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import { PermissionResponse } from 'expo-av/build/Audio';
import basic from '../constants/Styles';
import { UserFromInput } from '../services';
import { URIToFormDataValue } from '../utils';

export interface ProfileFormProps {
  label: string,
  info?: string,
  info2?: string,
  action: (input: UserFromInput) => Promise<void>
  onBack: () => void
}

type PermissionsRequest = 'camera' | 'media';

const ProfileForm = ({
  label, info, info2, action, onBack,
}: ProfileFormProps) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [chooseImg, setChooseImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickImage = async (mode: 'camera' | 'media') => {
    const request: Record<PermissionsRequest, () => Promise<PermissionResponse>> = {
      camera: ImagePicker.requestCameraPermissionsAsync,
      media: ImagePicker.requestMediaLibraryPermissionsAsync,
    };

    const { status } = await request[mode]();

    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Autorisations manquantes',
        text2: "Vous n'avez donner à l'application les autorisations nécessaires.",
      });

      return;
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    };

    switch (mode) {
      case 'camera': {
        const res = await ImagePicker.launchCameraAsync(options);
        if (!res.cancelled) setImage(res.uri);
        break;
      }
      case 'media': {
        const res = await ImagePicker.launchImageLibraryAsync(options);
        if (!res.cancelled) setImage(res.uri);
        break;
      }
      default:
        break;
    }

    setChooseImg(false);
  };

  const onSubmit = async () => {
    setLoading(true);
    const input: UserFromInput = {
      email,
      username,
      password: !password ? undefined : password,
      picture: image ? URIToFormDataValue(image) : undefined,
    };

    await action(input);
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={basic.container}
      >
        <View style={basic.body}>
          <TouchableOpacity
            onPress={onBack}
            style={basic.back}
          >
            <Ionicons name="chevron-back-circle" size={30} color="#CDCBD1" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setChooseImg(true); }} style={styles.camera}>
            {image
              ? <Image source={{ uri: image }} style={styles.img} />
              : <MaterialIcons name="account-circle" size={70} color="#CDCBD1" />}
          </TouchableOpacity>
          <View style={basic.row}>
            <MaterialCommunityIcons style={basic.icon} name="account" size={20} color="#CDCBD1" />
            <TextInput
              autoCapitalize="none"
              style={basic.input}
              placeholder="Nom d'utilisateur"
              placeholderTextColor="grey"
              onChangeText={setUsername}
              value={username}
            />
          </View>
          <View style={basic.row}>
            <MaterialIcons name="email" style={basic.icon} size={20} color="#CDCBD1" />
            <TextInput
              autoCapitalize="none"
              style={basic.input}
              placeholder="Email"
              placeholderTextColor="grey"
              onChangeText={setEmail}
              value={email}
            />
          </View>
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
          {info ? (<Text style={styles.info}>{info}</Text>) : <></>}
          {info2 ? (<Text style={styles.info}>{info2}</Text>) : <></>}
          <TouchableOpacity
            onPress={onSubmit}
            style={loading ? basic.buttonOff : basic.button}
            disabled={loading}
          >
            <Text style={basic.btnText}>{label}</Text>
          </TouchableOpacity>
        </View>
        <Modal isVisible={chooseImg} animationIn="tada">
          <View style={styles.modalView}>
            <TouchableOpacity style={basic.button} onPress={() => { pickImage('camera'); }}>
              <Text style={basic.btnText}>Caméra</Text>
            </TouchableOpacity>
            <TouchableOpacity style={basic.button} onPress={() => { pickImage('media'); }}>
              <Text style={basic.btnText}>Librairie</Text>
            </TouchableOpacity>
            <TouchableOpacity style={basic.buttonOff} onPress={() => { setChooseImg(false); }}>
              <Text style={basic.btnText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  camera: {
    marginBottom: 30,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
  centeredView: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
  },
  info: {
    color: 'white',
    fontSize: 12,
    alignSelf: 'center',
  },
});

export default ProfileForm;
