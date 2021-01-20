import { Alert } from 'react-native';
import { Player } from '../services/types/rooms';

export const kickUser = (selectedPlayer: Player) => {
  Alert.alert(
    'Attention',
    `Êtes vous sûre de vouloir exclure ${selectedPlayer ? selectedPlayer.username : 'ce joueur'} du jeu ?`,
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

export const voteUser = (selectedPlayer: Player) => {
  Alert.alert(
    'Voter',
    `Êtes vous sûre de voter contre ${selectedPlayer ? selectedPlayer.username : 'ce joueur'} ?`,
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

export const wolfVote = (selectedPlayer: Player) => {
  Alert.alert(
    'Voter',
    `Êtes vous sûre de tuer ${selectedPlayer ? selectedPlayer.username : 'ce joueur'} ?`,
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

export const seerVote = (selectedPlayer: Player) => {
  Alert.alert(
    'Voir',
    `Êtes vous sûre vouloir voir l'identité de ${selectedPlayer ? selectedPlayer.username : 'ce joueur'} ?`,
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

export const witchVote = (selectedPlayer: Player, save: boolean) => {
  Alert.alert(
    'Sauver',
    `Êtes vous sûre de ${save ? 'sauver' : 'empoisoner'} ${selectedPlayer ? selectedPlayer.username : 'ce joueur'} ?`,
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
