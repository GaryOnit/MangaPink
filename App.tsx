import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { store, persistor } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';

function SplashScreen() {
  return (
    <View style={splashStyles.container}>
      <ActivityIndicator size="large" color="#FF6B9D" />
      <Text style={splashStyles.text}>萌漫 MangaPink</Text>
    </View>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F5',
  },
  text: {
    marginTop: 16,
    color: '#FF6B9D',
    fontSize: 16,
  },
});

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
