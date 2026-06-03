import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ShelfStackParamList } from './types';
import ShelfScreen from '../screens/shelf/ShelfScreen';
import MangaDetailScreen from '../screens/detail/MangaDetailScreen';
import ReaderScreen from '../screens/reader/ReaderScreen';

const Stack = createNativeStackNavigator<ShelfStackParamList>();

export default function ShelfStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF0F5' },
        headerTintColor: '#E91E8C',
        headerTitleStyle: { fontWeight: '600', color: '#2D1B2E' },
      }}
    >
      <Stack.Screen
        name="Shelf"
        component={ShelfScreen}
        options={{ title: '我的书架', headerShown: false }}
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
