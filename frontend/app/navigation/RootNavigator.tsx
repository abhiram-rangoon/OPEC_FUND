import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppStore } from '../store/useAppStore';
import AuthScreen from '../screens/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';

// Import New Sub-Screens
import NotificationScreen from '../screens/NotificationScreen';
import ChatScreen from '../screens/ChatScreen';
import RechargeScreen from '../screens/RechargeScreen';
import WithdrawScreen from '../screens/WithdrawScreen';
import BonusScreen from '../screens/BonusScreen';
import NoticeScreen from '../screens/NoticeScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import WithdrawalAccountScreen from '../screens/WithdrawalAccountScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ContractScreen from '../screens/ContractScreen';
import NoticeDetailScreen from '../screens/NoticeDetailScreen';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const token = useAppStore((state) => state.token);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={BottomTabNavigator} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Recharge" component={RechargeScreen} />
            <Stack.Screen name="Withdraw" component={WithdrawScreen} />
            <Stack.Screen name="Bonus" component={BonusScreen} />
            <Stack.Screen name="Notice" component={NoticeScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="WithdrawalAccount" component={WithdrawalAccountScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="Contract" component={ContractScreen} />
            <Stack.Screen name="NoticeDetail" component={NoticeDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
