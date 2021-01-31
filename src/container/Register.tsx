import React from 'react';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import Toast from 'react-native-toast-message';
import { Vibration } from 'react-native';
import { useStoreActions } from '../store';
import services, { UserFromInput } from '../services';
import ProfileForm from '../components/ProfileForm';

export interface RegisterProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const Register = ({ navigation }: RegisterProps) => {
  const setUser = useStoreActions((actions) => actions.user.setUser);

  const register = async (input: UserFromInput) => {
    const { email, username, password } = input;

    if (!email || !password || !username) {
      Vibration.vibrate([100]);
      Toast.show({
        type: 'error',
        text1: 'Informations manquantes',
        text2: "Remplissez votre nom d'utilisateur, email et mot de passe.",
      });

      return;
    }

    try {
      const data = await services.users.register(input);
      setUser(data);

      navigation.navigate('Home');
    } catch (e) {
      const { message } = e as Error;
      Vibration.vibrate([100]);

      switch (message) {
        case 'auth/invalid-body':
          Toast.show({
            type: 'error',
            text1: 'Erreur',
            text2: 'Une erreur est survenue, veuillez réessayer.',
          });
          break;
        case 'auth/invalid-email':
          Toast.show({
            type: 'error',
            text1: 'Email invalide',
            text2: 'Entrez une adresse email valide.',
          });
          break;
        case 'auth/invalid-password':
          Toast.show({
            type: 'error',
            text1: 'Mot de passe invalide',
            text2: 'Votre mot de passe doit contenir des letters et/ou des chiffres et faire au moins 6 caractères.',
          });
          break;
        case 'auth/email-already-in-use':
          Toast.show({
            type: 'error',
            text1: 'Email déjà utilisé',
            text2: 'Choisissez une autre address email.',
          });
          break;
        case 'auth/username-already-in-use':
          Toast.show({
            type: 'error',
            text1: "Nom d'utilisateur déjà utilisé",
            text2: "Choisissez un autre nom d'utilisateur.",
          });
          break;
        default:
      }
    }
  };

  return (<ProfileForm label="S'inscrire" action={register} onBack={() => navigation.goBack()} />);
};

export default Register;
