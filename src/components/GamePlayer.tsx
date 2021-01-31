import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { MaterialIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import basic from '../constants/Styles';
import {
  PlayerState, RoomState, Player, Room, PlayerRole,
} from '../services/types/rooms';
import { useStoreState } from '../store';
import { GameInstance } from '../services';

export interface GamePlayerProps {
  instance?: GameInstance,
  room: Room,
  admin: string,
  self?: Player
  player?: Player
}

type PlayerActions = 'kick' | 'user-vote' | 'seer-vote' | 'wolf-vote' | 'witch-vote';

const GamePlayer = ({
  instance, room, admin, self, player,
}: GamePlayerProps) => {
  const user = useStoreState((state) => state.user.data);

  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [action, setAction] = useState<PlayerActions>('kick');
  const [question, setQuestion] = useState('');
  const [buttonText, setButtonText] = useState('');

  const actions: Record<PlayerActions, ((player: Player) => void) | undefined> = {
    kick: instance?.kickUser,
    'user-vote': instance?.userVote,
    'seer-vote': instance?.sendSeerVote,
    'wolf-vote': instance?.sendWolfVote,
    'witch-vote': instance?.sendWitchVote,
  };

  if (!player) {
    return (
      <View style={[styles.player, { opacity: 0.3 }]}>
        <MaterialIcons name="account-circle" size={50} color="#CDCBD1" />
        <Text style={styles.number}>Vide</Text>
      </View>
    );
  }

  const onAction = () => {
    const exec = actions[action];
    if (!exec) return;

    setLoading(true);
    exec(player);
    setConfirm(false);
    setLoading(false);
  };

  const kick = () => {
    setAction('kick');
    setQuestion(`Êtes-vous sûr de vouloir exclure ${player.username} ?`);
    setButtonText('Exclure');
    setConfirm(true);
  };

  const vote = () => {
    if (player.state === PlayerState.VOTING) {
      setAction('user-vote');
      setQuestion(`Êtes-vous sûr de vouloir voter pour ${player.username} ?`);
      setButtonText('Voter');
    } else if (self?.role === PlayerRole.SEER) {
      setAction('seer-vote');
      setQuestion(`Êtes-vous sûr de vouloir découvrir l'identité de ${player.username} ?`);
      setButtonText("Découvrir l'identité");
    } else if (self?.role === PlayerRole.WITCH) {
      setAction('witch-vote');
      setQuestion(`Êtes-vous sûr de vouloir utiliser votre potion sur ${player.username} ?`);
      setButtonText('Utiliser la potion');
    } else if (self?.role === PlayerRole.WOLF) {
      setAction('wolf-vote');
      setQuestion(`Êtes-vous sûr de vouloir essayer de tuer ${player.username} ?`);
      setButtonText('Tuer');
    }

    setConfirm(true);
  };

  const PlayerAvatar = () => {
    const add = room.state !== RoomState.LOBBY && !player.connected ? styles.disconnected : {};

    if (player.state === PlayerState.DEAD) return (<FontAwesome5 style={add} name="ghost" size={50} color="grey" />);
    if (player.picture) return <Image style={[styles.img, add]} source={{ uri: player.picture }} />;

    return <MaterialIcons style={add} name="account-circle" size={50} color="#CDCBD1" />;
  };

  const PlayerIcon = () => {
    if (admin === player.username) return <FontAwesome5 style={styles.avatarIcon} name="crown" size={15} color="orange" />;
    if (!player.connected) return <FontAwesome5 style={styles.avatarIcon} name="exclamation-circle" size={15} color="orange" />;

    return admin === user?.username && room.state === RoomState.LOBBY
      ? (
        <TouchableOpacity style={styles.avatarIcon} onPress={kick}>
          <AntDesign name="closecircle" size={15} color="red" />
        </TouchableOpacity>
      )
      : <></>;
  };

  return (
    <TouchableOpacity
      onPress={vote}
      disabled={
        (self?.state !== PlayerState.ROLE_BASED_ACTION && self?.state !== PlayerState.VOTING)
        || (self?.username === player.username
          && (self.role !== PlayerRole.WITCH
            || (self.role === PlayerRole.WITCH && self.state === PlayerState.VOTING)))
        || player.state === PlayerState.DEAD
        || !player.connected
      }
      style={styles.player}
    >
      <View style={styles.kickBody}>
        {PlayerAvatar()}
        {PlayerIcon()}
      </View>
      <Text
        style={styles.number}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {player.username}
      </Text>
      <Modal isVisible={confirm} animationIn="tada">
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{question}</Text>
          <TouchableOpacity
            style={loading ? basic.buttonOff : basic.button}
            onPress={onAction}
            disabled={loading}
          >
            <Text style={basic.btnText}>{buttonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={basic.buttonOff} onPress={() => setConfirm(false)}>
            <Text style={basic.btnText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </TouchableOpacity>
  );
};

export default GamePlayer;

const styles = StyleSheet.create({
  player: {
    backgroundColor: '#33466F',
    borderRadius: 5,
    marginRight: 5,
    marginLeft: 5,
    display: 'flex',
    alignItems: 'center',
    padding: 5,
  },
  number: {
    color: 'white',
    fontWeight: '800',
  },
  kickBody: {
    position: 'relative',
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  modalTitle: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    flexShrink: 1,
    fontSize: 18,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  disconnected: {
    opacity: 0.3,
  },
});
