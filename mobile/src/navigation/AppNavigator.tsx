import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Briefcase, MapPin, MessageSquare, User, Settings, Navigation, Camera } from 'lucide-react-native';

// Import screens
import HomeScreen from '@/screens/HomeScreen';
import JobPostScreen from '@/screens/JobPostScreen';
import JobDetailsScreen from '@/screens/JobDetailsScreen';
import SubmitBidScreen from '@/screens/SubmitBidScreen';
import TerritoriesScreen from '@/screens/TerritoriesScreen';
import JobsScreen from '@/screens/JobsScreen';
import MessagesScreen from '@/screens/MessagesScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import RouteScreen from '@/screens/RouteScreen';
import SettingsScreen from '@/screens/SettingsScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  JobPost: undefined;
  JobDetails: { jobId: string };
  Messages: { jobId?: string } | undefined;
  Route: undefined;
  Settings: undefined;
  SubmitBid: { jobId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Jobs: undefined;
  Territories: undefined;
  Messages: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#0ea5e9',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerTitle: 'FairTradeWorker',
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={JobsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
          headerTitle: 'Browse Jobs',
        }}
      />
      <Tab.Screen
        name="Territories"
        component={TerritoriesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} />,
          headerTitle: 'Territories',
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
          headerTitle: 'Messages',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          headerTitle: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0ea5e9',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobPost"
          component={JobPostScreen}
          options={{ 
            headerTitle: 'Post a Job',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="JobDetails"
          component={JobDetailsScreen}
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SubmitBid"
          component={SubmitBidScreen}
          options={{ 
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="Route"
          component={RouteScreen}
          options={{ headerTitle: 'Route Optimization' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerTitle: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
