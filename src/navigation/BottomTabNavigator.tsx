import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabParamList } from './types';
import HomeStack from './HomeStack';
import ShelfStack from './ShelfStack';
import CategoryStack from './CategoryStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator<BottomTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const iconMap: Record<string, string> = {
    首页: '🏠',
    书架: '📚',
    分类: '🏷️',
    我的: '👤',
  };
  return (
    <Text style={{ fontSize: focused ? 22 : 20 }}>
      {iconMap[label] ?? '●'}
    </Text>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#FFD6E7',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: '#FF6B9D',
        tabBarInactiveTintColor: '#A0608A',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused }) => {
          const labelMap: Record<string, string> = {
            HomeTab: '首页',
            ShelfTab: '书架',
            CategoryTab: '分类',
            ProfileTab: '我的',
          };
          return <TabIcon label={labelMap[route.name] ?? ''} focused={focused} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: '首页' }} />
      <Tab.Screen name="ShelfTab" component={ShelfStack} options={{ title: '书架' }} />
      <Tab.Screen name="CategoryTab" component={CategoryStack} options={{ title: '分类' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
}
