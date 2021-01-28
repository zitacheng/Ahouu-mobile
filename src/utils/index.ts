import * as mime from 'mime';
import Toast from 'react-native-toast-message';
import { ActionCreator } from 'easy-peasy';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { StackCardStyleInterpolator } from '@react-navigation/stack';
import { User } from '../services';

export const URIToFormDataValue = (uri: string): FormDataValue => {
  const name = uri.split('/').pop() as string;
  const type = mime.getType(name) as string;

  return { uri, name, type };
};

export const ExpiredSessionRedirect = (
  navigation: NavigationScreenProp<NavigationState, NavigationParams>,
  setUser: ActionCreator<User | undefined>,
) => {
  Toast.show({
    type: 'error',
    text1: 'Erreur',
    text2: 'Votre session a expirée, veuillez vous reconnecter.',
  });

  setUser(undefined);
  navigation.navigate('Login');
};

export const cardStyleInterpolator: StackCardStyleInterpolator = ({ current, layouts }) => ({
  cardStyle: {
    transform: [
      {
        translateX: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [layouts.screen.width, 0],
        }),
      },
    ],
  },
});
