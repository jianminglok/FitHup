import { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './lib/supabase'
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import Launchpage from './components/Launchpage';
import Homepage from './components/Homepage';
import SetupProfile from './components/SetupProfile';
import BottomBar from './components/BottomBar';
import ActivityLoggerExercise from './components/ActivityLoggerExercise';
import 'react-native-url-polyfill/auto'
import { Alert } from 'react-native';
import AddActivityButton from './components/AddActivityButton';
import { View } from 'react-native-web';
import ActivityLoggerCalorie from './components/ActivityLoggerCalorie';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    let isMounted = true

    if (isMounted) {
      setSession(supabase.auth.session())
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => { isMounted = false };
  }, [])

  return (
    
    <NavigationContainer>
      {session && session.user ?

        <Stack.Navigator>
          <Stack.Screen
            name="TabStack"
            component={BottomBar}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SetupProfile"
            component={SetupProfile}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="ActivityLoggerExercise"
            component={ActivityLoggerExercise}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="ActivityLoggerCalorie"
            component={ActivityLoggerCalorie}
            options={{
              headerShown: false,
            }}
          />

        </Stack.Navigator> :

        <Stack.Navigator>
          <Stack.Screen
            name="Launchpage"
            component={Launchpage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Sign Up"
            component={Signup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Forgot Password"
            component={ForgotPassword}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      }
    </NavigationContainer>
  )
}