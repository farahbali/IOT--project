// import 'react-native-gesture-handler';
// import React, { useEffect, useState } from 'react';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { LoginScreen, HomeScreen, RegistrationScreen, SettingsScreen } from './src/screens';
// import LoadScreen from './src/screens/LoadScreen/LoadScreen';

// import { decode, encode } from 'base-64';
// if (!global.btoa) { global.btoa = encode }
// if (!global.atob) { global.atob = decode }

// const Stack = createStackNavigator();
// const auth = getAuth(); 
// const db = getFirestore(); 

// export default function App() {
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
//       if (authUser) {
//         try {
//           const userDoc = doc(db, 'users', authUser.uid);
//           const docSnapshot = await getDoc(userDoc);
//           if (docSnapshot.exists()) {
//             const userData = docSnapshot.data();
//             setUser(userData);
//           } else {
//             setUser(null);
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//           setUser(null);
//         }
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe(); // Cleanup on unmount
//   }, []);

//   if (loading) {
//     return <LoadScreen />;
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         {user ? (
//           <>
//             <Stack.Screen name="Home">
//               {props => <HomeScreen {...props} extraData={user} />}
//             </Stack.Screen>
//             <Stack.Screen name="Settings">
//               {props => <SettingsScreen {...props} user={user} />}
//             </Stack.Screen>
//           </>
//         ) : (
//           <>
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Registration" component={RegistrationScreen} />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
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
            setUser(userData);
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

  // Bottom Tab Navigator for authenticated users
  const AuthenticatedTabs = () => (
    <Tab.Navigator>
      <Tab.Screen name="Home">
        {props => <HomeScreen {...props} extraData={user} />}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {props => <SettingsScreen {...props} user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen name="Authenticated" component={AuthenticatedTabs} options={{ headerShown: false }} />
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
