import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StoreProvider } from 'easy-peasy';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import BottomTab from './src/navigation/BottomTab';
import Login from './src/container/Login';
import Game from './src/container/Game';
import Register from './src/container/Register';
import store from './src/store';
import FeedbackToast from './src/components/FeedbackToast';
import { cardStyleInterpolator } from './src/utils';

const Stack = createStackNavigator();

const App = () => (
  <StoreProvider store={store}>
    <View style={styles.container}>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            gestureDirection: 'horizontal',
            cardStyleInterpolator,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Home" component={BottomTab} />
          <Stack.Screen name="Game" component={Game} />
        </Stack.Navigator>
      </NavigationContainer>
      <FeedbackToast />
    </View>
  </StoreProvider>
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
});

export default App;
