import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from './types';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF0F5' },
        headerTintColor: '#E91E8C',
        headerTitleStyle: { fontWeight: '600', color: '#2D1B2E' },
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: '我的', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
