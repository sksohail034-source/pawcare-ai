import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AiScannerScreen from './src/screens/AiScannerScreen';
import RoutinesScreen from './src/screens/RoutinesScreen';
import DonationScreen from './src/screens/DonationScreen';
import LocationScreen from './src/screens/LocationScreen';
import PetsScreen from './src/screens/PetsScreen';
import VaccinationsScreen from './src/screens/VaccinationsScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import SubscriptionsScreen from './src/screens/SubscriptionsScreen';
import CareProtocolsScreen from './src/screens/CareProtocolsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="AiScanner" 
            component={AiScannerScreen} 
            options={{ title: 'AI Pet Scanner' }} 
          />
          <Stack.Screen 
            name="Routines" 
            component={RoutinesScreen} 
            options={{ title: 'Smart Routines & Alarms' }} 
          />
          <Stack.Screen 
            name="Donation" 
            component={DonationScreen} 
            options={{ title: 'Support Stray Pets' }} 
          />
          <Stack.Screen 
            name="Location" 
            component={LocationScreen} 
            options={{ title: 'Live Location' }} 
          />
          <Stack.Screen 
            name="Pets" 
            component={PetsScreen} 
            options={{ title: 'My Pets' }} 
          />
          <Stack.Screen 
            name="Vaccinations" 
            component={VaccinationsScreen} 
            options={{ title: 'Health Records' }} 
          />
          <Stack.Screen 
            name="Products" 
            component={ProductsScreen} 
            options={{ title: 'Pet Store' }} 
          />
          <Stack.Screen 
            name="Subscriptions" 
            component={SubscriptionsScreen} 
            options={{ title: 'Premium' }} 
          />
          <Stack.Screen 
            name="CareProtocols" 
            component={CareProtocolsScreen} 
            options={{ title: 'Natural Care' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
