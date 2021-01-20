import { StyleSheet } from 'react-native';

const basic = StyleSheet.create({
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
  input: {
    height: 40,
    borderColor: '#1A2C55',
    borderWidth: 0.2,
    width: '85%',
    borderRadius: 20,
    padding: 10,
    marginLeft: 5,
    backgroundColor: '#1A2C55',
    color: 'white',
    marginBottom: 15,
  },
  icon: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#EF864F',
    borderRadius: 20,
    padding: 10,
    width: '50%',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
  },
  smBtn: {
    backgroundColor: '#EF864F',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  information: {
    backgroundColor: '#33466F',
    borderRadius: 30,
    padding: 10,
  },
  infoTxt: {
    color: 'white',
    fontSize: 20,
    padding: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1B222F',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    top: 60,
    left: 30,
  },
});

export default basic;