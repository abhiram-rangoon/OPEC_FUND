import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, BarChart2, Crown, User } from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import VIPScreen from '../screens/VIPScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#00C896',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProjectTab"
        component={ProjectsScreen}
        options={{
          tabBarLabel: 'Project',
          tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="VIPTab"
        component={VIPScreen}
        options={{
          tabBarLabel: 'VIP',
          tabBarIcon: ({ color, size }) => <Crown color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
