import React from 'react';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import Toast from 'react-native-toast-message';
import { useStoreActions, useStoreState } from '../store';
import services, { User, UserFromInput } from '../services';
import ProfileForm from '../components/ProfileForm';
import { ExpiredSessionRedirect } from '../utils';

export interface RegisterProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const UpdateProfile = ({ navigation }: RegisterProps) => {
  const user = useStoreState((state) => state.user.data) as User;
  const setUser = useStoreActions((actions) => actions.user.setUser);

  const update = async (input: UserFromInput) => {
    const {
      email, username, password, picture,
    } = input;

    if (!email && !password && !username && !picture) {
      Toast.show({
        type: 'error',
        text1: 'Informations manquantes',
        text2: "Remplissez au moins l'un des champs.",
      });

      return;
    }

    try {
      const data = await services.users.update(user, input);
      setUser(data);

      navigation.navigate('Profile', { user: data });
    } catch (e) {
      const { message } = e as Error;

      switch (message) {
        case 'auth/invalid-token':
          ExpiredSessionRedirect(navigation, setUser);
          break;
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

  return (
    <ProfileForm
      label="Modifier"
      info="Tout les champs sont optionnels"
      info2="Remplissez uniquement les champs à modifier."
      action={update}
      onBack={() => navigation.goBack()}
    />
  );
};

export default UpdateProfile;
