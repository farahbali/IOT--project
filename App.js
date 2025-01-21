import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import LoadScreen from './src/screens/LoadScreen/LoadScreen';
import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import RegistrationScreen from './src/screens/RegistrationScreen/RegistrationScreen';
import SettingsScreen from './src/screens/SettingsScreen/SettingsScreen';
import NotificationScreen from './src/screens/NotificationScreen/NotificationScreen';
import Icon from 'react-native-vector-icons/MaterialIcons'; 


// Firebase Polyfill for Base64
import { decode, encode } from 'base-64';
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const auth = getAuth();
const db = getFirestore();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDoc = doc(db, 'users', authUser.uid);
          const docSnapshot = await getDoc(userDoc);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUser({ id: authUser.uid, ...userData });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  if (loading) {
    return <LoadScreen />;
  }

  // Tabs for authenticated users
  const AuthenticatedTabs = () => (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        // Define icons for each tab
        if (route.name === 'Home') {
          iconName = 'home'; // Home icon
        } else if (route.name === 'Settings') {
          iconName = 'settings'; // Settings icon
        } else if (route.name === 'Notification') {
          iconName = 'notifications'; // Notification icon
        }

        // Render the icon
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#FF7F50', // Active tab color
      tabBarInactiveTintColor: 'gray', // Inactive tab color
      tabBarStyle: {
        backgroundColor: '#FDF6F0', // Tab bar background color
        borderTopWidth: 0,
        elevation: 5,
      },
    })}
  >
    <Tab.Screen
      name="Home"
      options={{ headerShown: false }}
      children={(props) => <HomeScreen {...props} route={{ params: { user } }} />}
    />
    <Tab.Screen
      name="Settings"
      options={{ headerShown: false }}
      children={(props) => <SettingsScreen {...props} route={{ params: { user } }} />}
    />
    <Tab.Screen
      name="Notification"
      options={{ headerShown: false }}
      children={(props) => <NotificationScreen {...props} route={{ params: { user } }} />}
    />
  </Tab.Navigator>
  );
  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Authenticated"
            component={AuthenticatedTabs}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
