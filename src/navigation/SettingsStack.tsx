import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { cardStyleInterpolator } from '../utils';
import Profile from '../container/Profile';
import UpdateProfile from '../container/UpdateProfile';

const Stack = createStackNavigator();

const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
      gestureDirection: 'horizontal',
      cardStyleInterpolator,
    }}
  >
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
  </Stack.Navigator>
);

export default SettingsStack;
