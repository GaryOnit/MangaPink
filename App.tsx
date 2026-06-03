import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { View, Text, ActivityIndicator } from 'react-native';
import { store, persistor } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';

function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-pink-50">
      <ActivityIndicator size="large" color="#FF6B9D" />
      <Text className="mt-4 text-pink-400 text-base">萌漫 MangaPink</Text>
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <StatusBar style="dark" backgroundColor="#FFF0F5" />
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
}
