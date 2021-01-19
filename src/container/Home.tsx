import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from 'react-native';
import basic from '../constants/Styles';

const Home = (): React.ReactElement => {
  const [name, setName] = useState('');
  const [max, setMax] = useState('');

  function createRoom() {
    if (!name || !max || name.length > 15) {
      Alert.alert(
        'Erreur',
        'Veuillez fournir le nom et le nombre maximum de joueur.',
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          { text: 'OK' },
        ],
        { cancelable: false },
      );
    } else {
      console.log('create room');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Créer une salle</Text>
        <View style={styles.body}>
          <TextInput
            style={basic.input}
            placeholder="Name"
            maxLength={16}
            autoCapitalize="none"
            onChangeText={setName}
            value={name}
          />
          <TextInput
            style={basic.input}
            placeholder="Max joueur"
            autoCapitalize="none"
            keyboardType="numeric"
            onChangeText={setMax}
            value={max}
          />
          <TouchableOpacity
            onPress={createRoom}
            style={basic.button}
          >
            <Text style={basic.btnText}>Créer</Text>
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
    justifyContent: 'center',
    backgroundColor: '#1B222F',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  body: {
    backgroundColor: '#33466F',
    width: '85%',
    borderRadius: 20,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    padding: 10,
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: '900',
    fontSize: 28,
    marginBottom: 20,
  },
});

export default Home;
