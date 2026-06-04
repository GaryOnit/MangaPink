import React, { useState, useCallback, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { store, persistor } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';

// 在模块顶层立即阻止原生 Splash 自动消失（必须在组件渲染前调用）
SplashScreen.preventAutoHideAsync();

// Splash 最短展示时长（ms）
const SPLASH_MIN_DURATION = 1200;

function LoadingScreen() {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size="large" color="#FF6B9D" />
      <Text style={loadingStyles.text}>萌漫 MangaPink</Text>
    </View>
  );
}

const loadingStyles = StyleSheet.create({
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
  const [isAppReady, setIsAppReady] = useState(false);
  // 记录组件首次 mount 时间，用于计算原生 Splash 已展示时长
  const mountTimeRef = useRef(Date.now());

  // 根 View 布局完成后，确保原生 Splash 至少展示 SPLASH_MIN_DURATION ms
  const onRootLayout = useCallback(async () => {
    if (!isAppReady) {
      const elapsed = Date.now() - mountTimeRef.current;
      const remaining = SPLASH_MIN_DURATION - elapsed;
      if (remaining > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, remaining));
      }
      setIsAppReady(true);
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  // 布局未完成前渲染空 View（触发 onLayout），原生 Splash 保持可见
  if (!isAppReady) {
    return <View style={styles.fill} onLayout={onRootLayout} />;
  }

  return (
    <View style={styles.fill}>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
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
});
