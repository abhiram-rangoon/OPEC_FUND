import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import RootNavigator from './app/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#007A5E" />
      <RootNavigator />
      <Toast />
    </SafeAreaProvider>
  );
}
