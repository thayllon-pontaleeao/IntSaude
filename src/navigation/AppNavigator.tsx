import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import HospitalDetailScreen from '../screens/HospitalDetailScreen';
import AnamneseScreen from '../screens/AnamneseScreen';
import MapScreen from '../screens/MapScreen';
import PerfilScreen from '../screens/PerfilScreen';
import GestorPanelScreen from '../screens/GestorPanelScreen';
import SuperAdminDashboard from '../screens/SuperAdminDashboard';
import { AdminLoginScreen, AdminPanelScreen } from '../screens/AdminScreens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="HospitalDetail" component={HospitalDetailScreen} />
        <Stack.Screen name="Anamnese" component={AnamneseScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="GestorPanel" component={GestorPanelScreen} />
        <Stack.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}