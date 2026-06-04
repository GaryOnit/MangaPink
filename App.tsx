import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { store, persistor } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';

// 在模块顶层立即阻止原生 Splash 自动消失（必须在组件渲染前调用）
SplashScreen.preventAutoHideAsync();

// JS 层 Splash 最短展示时长（ms）
const SPLASH_DURATION = 1200;

const { width, height } = Dimensions.get('window');

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 原生 Splash 加载完毕后立即隐藏，交由 JS 层接管展示
    SplashScreen.hideAsync();
    // JS 层展示 splash.png，持续 SPLASH_DURATION ms 后切换到正式内容
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('./assets/splash.png')}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar style="dark" backgroundColor="#FFF0F5" />
          <RootNavigator />
        </PersistGate>
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    width,
    height,
    backgroundColor: '#FFF0F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImage: {
    width,
    height,
  },
});
