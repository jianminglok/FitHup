import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import ProtectedView from './components/ProtectedView'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ForgotPassword from './components/ForgotPassword'

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
            name="ProtectedView"
            component={ProtectedView}
            initialParams={{ session: session }}
          />

        </Stack.Navigator> :
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={SignIn}
          />
          <Stack.Screen
            name="Sign Up"
            component={SignUp}
          />
          <Stack.Screen
            name="Forgot Password"
            component={ForgotPassword}
          />
        </Stack.Navigator>
      }
    </NavigationContainer>
  )
}