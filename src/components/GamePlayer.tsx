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
  PlayerState, RoomState, Player, Room,
} from '../services/types/rooms';
import { useStoreState } from '../store';
import { GameInstance, User } from '../services';

export interface GamePlayerProps {
  instance: GameInstance | undefined,
  room: Room,
  admin: string,
  player?: Player
}

const GamePlayer = ({
  instance, room, admin, player,
}: GamePlayerProps) => {
  const user = useStoreState((state) => state.user.data) as User;

  const [kick, setKick] = useState(false);

  if (!player) {
    return (
      <View style={[styles.player, { opacity: 0.3 }]}>
        <MaterialIcons name="account-circle" size={50} color="#CDCBD1" />
        <Text style={styles.number}>Vide</Text>
      </View>
    );
  }

  const onKick = () => {
    if (!instance) return;

    instance.kickUser(player);
    setKick(false);
  };

  // const onVote = (selected: Player) => {
  //   if (selectedPlayer.state === PlayerState.DEAD) {
  //     Alert.alert(
  //       'Erreur',
  //       `Le joueur ${selectedPlayer ? selectedPlayer.username : ''} est décédé`,
  //       [
  //         {
  //           text: 'Annuler',
  //           style: 'cancel',
  //         },
  //         { text: 'Ok' },
  //       ],
  //       { cancelable: false },
  //     );
  //   } else if (room.state === RoomState.STARTED
  //       && self.state === PlayerState.VOTING) gameAlert.voteUser(selectedPlayer);
  //   else if (room.state === RoomState.STARTED && self.state === PlayerState.ROLE_BASED_ACTION
  //       && self.role === PlayerRole.WOLF) gameAlert.wolfVote(selectedPlayer);
  //   else if (room.state === RoomState.STARTED && self.state === PlayerState.ROLE_BASED_ACTION
  //       && self.role === PlayerRole.SEER) gameAlert.seerVote(selectedPlayer);
  //   else if (room.state === RoomState.STARTED && self.state === PlayerState.ROLE_BASED_ACTION
  //       && self.role === PlayerRole.WITCH) gameAlert.witchVote(selectedPlayer, true);
  // };

  const PlayerAvatar = () => {
    if (player.state === PlayerState.DEAD) return (<FontAwesome5 name="ghost" size={50} color="grey" />);

    if (player.picture) return <Image style={styles.img} source={{ uri: player.picture }} />;
    return <MaterialIcons name="account-circle" size={50} color="#CDCBD1" />;
  };

  const PlayerIcon = () => {
    if (admin === player.username) return <FontAwesome5 style={styles.avatarIcon} name="crown" size={15} color="orange" />;

    return admin === user.username && room.state === RoomState.LOBBY
      ? (
        <TouchableOpacity style={styles.avatarIcon} onPress={() => setKick(true)}>
          <AntDesign name="closecircle" size={15} color="red" />
        </TouchableOpacity>
      )
      : <></>;
  };

  return (
    <TouchableOpacity
      // onPress={onVote}
      disabled={player.state === PlayerState.DEAD}
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
      <Modal isVisible={kick} animationIn="tada">
        <View style={styles.modalView}>
          {/* TODO: text too long */}
          <Text style={styles.modalTitle}>{`Êtes-vous sûr de vouloir exclure ${player.username} ?`}</Text>
          <TouchableOpacity style={basic.button} onPress={onKick}>
            <Text style={basic.btnText}>Exclure</Text>
          </TouchableOpacity>
          <TouchableOpacity style={basic.buttonOff} onPress={() => setKick(false)}>
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
    flexShrink: 1,
    fontSize: 18,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 20,
    marginBottom: 20,
  },
});
