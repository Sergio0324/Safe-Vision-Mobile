import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importar pantallas
import PrincipalScreen from './src/screens/PrincipalScreen';
import CapturaScreen from './src/screens/CapturaScreen';
import ListaScreen from './src/screens/ListaScreen';
import DetalleScreen from './src/screens/DetalleScreen';
import DashboardScreen from './src/screens/DashboardScreen';

// Crear navegadores
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Colores
const COLORS = {
  primary: '#dc2626',
  secondary: '#0f172a',
  white: '#ffffff',
  dark: '#111827',
};

// ============ STACKS ============

// Stack: Home
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Principal"
        component={PrincipalScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="Captura"
        component={CapturaScreen}
        options={{
          title: 'Tomar Inspección',
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="Detalle"
        component={DetalleScreen}
        options={{
          title: 'Detalles de Inspección',
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

// Stack: Lista
function ListaStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Lista"
        component={ListaScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="Detalle"
        component={DetalleScreen}
        options={{
          title: 'Detalles de Inspección',
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

// Stack: Dashboard
function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="DashboardMain"
        component={DashboardScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

// ============ TAB NAVIGATOR ============

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.dark,
          borderTopColor: COLORS.primary + '40',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          // Se quitó position:'absolute' + bottom/left/right: eso sacaba la
          // barra del flujo normal y quedaba flotando ENCIMA del contenido
          // de cada pantalla, tapando la parte de abajo. Sin "absolute",
          // el navigator reserva su propio espacio y el contenido ya no
          // se sobrepone.
        },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
          marginBottom: 10,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: '🏠 Inicio',
          tabBarLabel: '🏠 Inicio',
        }}
      />
      <Tab.Screen
        name="ListaTab"
        component={ListaStack}
        options={{
          title: '📋 Inspecciones',
          tabBarLabel: '📋 Inspecciones',
        }}
      />
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          title: '📊 Dashboard',
          tabBarLabel: '📊 Dashboard',
        }}
      />
    </Tab.Navigator>
  );
}

// ============ APP ROOT ============

export default function App() {
  return (
    // SafeAreaProvider es requerido por el SafeAreaView de
    // react-native-safe-area-context que usa PrincipalScreen; sin él los
    // márgenes seguros (notch, barra de estado) no se calculan bien.
    <SafeAreaProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}