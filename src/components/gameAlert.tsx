import { Alert } from 'react-native';
import { Player } from '../services/types/rooms';
export const kickUser = (thePlayer: Player) => {
  Alert.alert(
    'Attention',
    `Êtes vous sûre de vouloir exclure ${thePlayer ? thePlayer.username : 'ce joueur'} du jeu ?`,
    [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      { text: 'Oui', onPress: () => console.log('KICK USER') },
    ],
    { cancelable: false },
  );
};

export const voteUser = (thePlayer: Player) => {
  Alert.alert(
    'Voter',
    `Êtes vous sûre de voter contre ${thePlayer ? thePlayer.username : 'ce joueur'} ?`,
    [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      { text: 'Oui', onPress: () => console.log('Vote USER') },
    ],
    { cancelable: false },
  );
};

export const wolfVote = (thePlayer: Player) => {
  Alert.alert(
    'Voter',
    `Êtes vous sûre de tuer ${thePlayer ? thePlayer.username : 'ce joueur'} ?`,
    [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      { text: 'Oui', onPress: () => console.log('Wolf vote') },
    ],
    { cancelable: false },
  );
};

export const seerVote = (thePlayer: Player) => {
  Alert.alert(
    'Voir',
    `Êtes vous sûre vouloir voir l'identité de ${thePlayer ? thePlayer.username : 'ce joueur'} ?`,
    [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      { text: 'Oui', onPress: () => console.log('Seer check card') },
    ],
    { cancelable: false },
  );
};

export const witchVote = (thePlayer: Player, save: boolean) => {
  Alert.alert(
    'Sauver',
    `Êtes vous sûre de ${save ? 'sauver' : 'empoisoner'} ${thePlayer ? thePlayer.username : 'ce joueur'} ?`,
    [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      { text: 'Oui', onPress: () => console.log('Witch save or kill') },
    ],
    { cancelable: false },
  );
};
