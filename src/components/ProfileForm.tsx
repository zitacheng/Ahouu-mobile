import React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  MaterialIcons, Entypo, MaterialCommunityIcons,
} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import basic from '../constants/Styles';

function ProfileForm(username: string, setUsername: React.Dispatch<React.SetStateAction<string>>,
  email: string, setEmail: React.Dispatch<React.SetStateAction<string>>, password: string,
  setPassword: React.Dispatch<React.SetStateAction<string>>,
  setImage: React.Dispatch<React.SetStateAction<string>>, image: string,
  btnLabel: string, updateUser: VoidFunction,
  setChooseImg: React.Dispatch<React.SetStateAction<boolean>>, chooseImg: boolean) {
  const pickImage = async (cameraMode: boolean) => {
    if (cameraMode === true) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (perm.granted === true) {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.cancelled) {
          setImage(result.uri);
          setChooseImg(false);
        }
      }
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result.uri);
        setChooseImg(false);
      }
    }
  };

  return (
    <View>
      <View style={basic.body}>
        <TouchableOpacity onPress={() => { setChooseImg(true); }} style={styles.camera}>
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
        <TouchableOpacity onPress={updateUser} style={basic.button}>
          <Text style={basic.btnText}>{btnLabel}</Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={chooseImg} animationIn="tada">
        <View style={styles.modalView}>
          <TouchableOpacity style={basic.button} onPress={() => { pickImage(true); }}>
            <Text style={basic.btnText}>Caméra</Text>
          </TouchableOpacity>
          <TouchableOpacity style={basic.button} onPress={() => { pickImage(false); }}>
            <Text style={basic.btnText}>Librairie</Text>
          </TouchableOpacity>
          <TouchableOpacity style={basic.buttonOff} onPress={() => { setChooseImg(false); }}>
            <Text style={basic.btnText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
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
});

export default ProfileForm;
