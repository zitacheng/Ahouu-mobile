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
import basic from '../constants/Styles';

function ProfileForm(username: string, setUsername, email: string,
  setEmail, password: string, setPassword, setImage, image, btnLabel, updateUser) {
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
    <View>
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
        <TouchableOpacity onPress={updateUser} style={basic.button}>
          <Text style={basic.btnText}>{btnLabel}</Text>
        </TouchableOpacity>
      </View>
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
});

export default ProfileForm;
