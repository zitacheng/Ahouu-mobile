import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import CreateRoom from '../container/CreateRoom';
import ListRoom from '../container/ListRoom';
import SettingsStack from './SettingsStack';

const Tab = createBottomTabNavigator();

export interface TabScreenProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export type RealNavigationEventPayload = {
  data: { action: { type: 'NAVIGATE' | 'GO_BACK' } }
  target: string,
  preventDefault: () => void
};

const BottomTab = (props: TabScreenProps) => {
  useEffect(() => {
    props.navigation.addListener('beforeRemove', (e) => {
      // The type NavigationEventPayload does not represent at all what the actual event is
      const event = e as unknown as RealNavigationEventPayload;

      if (!event
        || !event.data
        || !event.data.action
        || event.data.action.type !== 'GO_BACK') return;

      event.preventDefault();
    });
  }, [props.navigation]);

  return (
    <Tab.Navigator
      initialRouteName="ListRoom"
      tabBarOptions={{
        style: { borderTopWidth: 0, height: 80 },
        activeTintColor: '#EF864F',
        activeBackgroundColor: '#424242',
        inactiveBackgroundColor: '#212121',
      }}
    >
      <Tab.Screen
        name="CreateRoom"
        component={CreateRoom}
        options={{
          tabBarLabel: 'Créer',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ListRoom"
        component={ListRoom}
        options={{
          tabBarLabel: 'Rejoindre',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Paramètre',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
