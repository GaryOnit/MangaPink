import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from './types';
import HomeScreen from '../screens/home/HomeScreen';
import MangaDetailScreen from '../screens/detail/MangaDetailScreen';
import ReaderScreen from '../screens/reader/ReaderScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF0F5' },
        headerTintColor: '#E91E8C',
        headerTitleStyle: { fontWeight: '600', color: '#2D1B2E' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '萌漫', headerShown: false }}
      />
      <Stack.Screen
        name="MangaDetail"
        component={MangaDetailScreen}
        options={{ title: '漫画详情' }}
      />
      <Stack.Screen
        name="Reader"
        component={ReaderScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
