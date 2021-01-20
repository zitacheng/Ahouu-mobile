import { StyleSheet } from 'react-native';

const game = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1B222F',
    paddingTop: '10%',
  },
  row: {
    flexDirection: 'row',
    display: 'flex',
    height: '85%',
  },
  col: {
    flexDirection: 'column',
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },
  colMsg: {
    flexDirection: 'column',
    display: 'flex',
    flex: 1,
  },
  body: {
    flexDirection: 'column',
    display: 'flex',
    backgroundColor: '#33466F',
    width: '60%',
    borderRadius: 5,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    padding: 10,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: '700',
    fontSize: 24,
    marginBottom: 20,
  },
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
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  kickBody: {
    position: 'relative',
  },
  avatarIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  headerIcon: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 10,
  },
  scrollBody: {
    width: '95%',
    marginBottom: 20,
  },
  system: {
    color: 'yellow',
    textAlign: 'center',
  },
  systemWolf: {
    color: 'red',
    textAlign: 'center',
  },
  userMsg: {
    backgroundColor: '#EF864F',
    padding: 5,
    color: 'white',
    alignSelf: 'flex-start',
    borderRadius: 10,
    overflow: 'hidden',
  },
  otherMsg: {
    backgroundColor: 'grey',
    padding: 5,
    color: 'white',
    alignSelf: 'flex-end',
    borderRadius: 10,
    overflow: 'hidden',
  },
  labelSystem: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'center',
    marginTop: 10,
  },
  labelOther: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'flex-end',
    margin: 3,
    marginTop: 5,
  },
  labelUser: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'flex-start',
    margin: 3,
    marginTop: 5,
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
  card: {
    width: '95%',
    height: '70%',
  },
  sub: {
    color: 'white',
    textAlign: 'center',
  },
});

export default game;
