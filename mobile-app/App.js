import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

import DashboardScreen from './screens/DashboardScreen';
import CapturarCorridaScreen from './screens/CapturarCorridaScreen';
import AdicionarDespesaScreen from './screens/AdicionarDespesaScreen';
import RelatoriosScreen from './screens/RelatoriosScreen';
import ConfiguracoesScreen from './screens/ConfiguracoesScreen';
import ProfileScreen from './screens/ProfileScreen';
import HistoricoCorridasScreen from './screens/HistoricoCorridasScreen';
import MetasScreen from './screens/MetasScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack do Dashboard - Dashboard, Relatórios e Metas
function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8B5CF6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Relatorios"
        component={RelatoriosScreen}
        options={{
          title: 'Relatórios',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="Metas"
        component={MetasScreen}
        options={{
          title: 'Metas e Objetivos',
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}

// Stack de Entradas - Capturar Corrida e Histórico
function EntradaStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8B5CF6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="CapturarCorrida"
        component={CapturarCorridaScreen}
        options={{
          title: 'Capturar Corrida',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="HistoricoCorridas"
        component={HistoricoCorridasScreen}
        options={{
          title: 'Histórico de Corridas',
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}

// Stack de Saídas - Adicionar Despesa
function SaidasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8B5CF6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="AdicionarDespesa"
        component={AdicionarDespesaScreen}
        options={{
          title: 'Adicionar Despesa',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

// Stack de Perfil
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8B5CF6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HistoricoCorridas"
        component={HistoricoCorridasScreen}
        options={{
          title: 'Histórico de Corridas',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="Metas"
        component={MetasScreen}
        options={{
          title: 'Metas e Objetivos',
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}

// Stack de Configurações
function ConfiguracoesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8B5CF6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Configuracoes"
        component={ConfiguracoesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          title: 'Política de Privacidade',
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Dashboard') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Entrada') {
                  iconName = focused ? 'add-circle' : 'add-circle-outline';
                } else if (route.name === 'Saidas') {
                  iconName = focused ? 'remove-circle' : 'remove-circle-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'person' : 'person-outline';
                } else if (route.name === 'Configuracoes') {
                  iconName = focused ? 'settings' : 'settings-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#8B5CF6',
              tabBarInactiveTintColor: '#9CA3AF',
              tabBarStyle: {
                paddingBottom: 5,
                paddingTop: 5,
                height: 60,
                backgroundColor: '#FFFFFF',
                borderTopWidth: 1,
                borderTopColor: '#F3F4F6',
              },
              headerShown: false,
            })}
          >
            <Tab.Screen
              name="Dashboard"
              component={DashboardStack}
              options={{ title: 'Dashboard' }}
            />
            <Tab.Screen
              name="Entrada"
              component={EntradaStack}
              options={{ title: 'Entrada' }}
            />
            <Tab.Screen
              name="Saidas"
              component={SaidasStack}
              options={{ title: 'Saídas' }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileStack}
              options={{ title: 'Perfil' }}
            />
            <Tab.Screen
              name="Configuracoes"
              component={ConfiguracoesStack}
              options={{ title: 'Configurações' }}
            />
          </Tab.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
