import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import Launchpage from './components/Launchpage';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen 
          name="Launchpage" 
          component={Launchpage} 
          options ={{
            headerShown: false,
        }}
      />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options ={{
            headerShown: false,
        }}
      />
        <Stack.Screen 
          name="Sign Up" 
          component={Signup} 
          options ={{
            headerShown: false,
        }}
      />
        <Stack.Screen 
          name="Forgot Password" 
          component={ForgotPassword} 
          options ={{
            headerShown: false,
          }}
      />

      </Stack.Navigator>
    </NavigationContainer>
  )
}  



