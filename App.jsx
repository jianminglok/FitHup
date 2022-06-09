import { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './lib/supabase'
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import Launchpage from './components/Launchpage';
import Homepage from './components/Homepage';
import BottomBar from './components/BottomBar';
import SetupProfile from './components/SetupProfile';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null)

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
            name="Set up Profile"
            component={BottomBar}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TabStack"
            component={BottomBar}
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