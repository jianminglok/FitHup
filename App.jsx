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
import { View, Text, Alert } from 'react-native';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './store'
import ActivityLoggerCalorie from './components/ActivityLoggerCalorie';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import colours from './assets/colours/colours';
import { SafeAreaView } from 'react-native-safe-area-context';
import Style from "./components/Style";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  const { name } = useSelector((state) => state.profile);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[Style.header, { backgroundColor: colours.tab }]}>
        <Text style={[{ color: colours.text, marginLeft: 17, fontSize: 20 }]}>Hi, {name}</Text>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label="Sign Out"
          onPress={() => signOut()}
          labelStyle={{
            color: colours.text
          }}
        />
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

function ActivityLoggerExerciseDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props}
      />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: colours.background
        },
      }}>
      <Drawer.Screen
        name="ActivityLoggerExerciseDrawer"
        component={ActivityLoggerExercise}
        options={{
          headerShown: false,
          drawerItemStyle: { height: 0 }
        }} />
    </Drawer.Navigator >
  );
}

function ActivityLoggerCalorieDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props}
      />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: colours.background
        },
      }}>
      <Drawer.Screen
        name="ActivityLoggerCalorieDrawer"
        component={ActivityLoggerCalorie}
        options={{
          headerShown: false,
          drawerItemStyle: { height: 0 }
        }} />
    </Drawer.Navigator >
  );
}

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
    <Provider store={store}>
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
              component={ActivityLoggerExerciseDrawer}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ActivityLoggerCalorie"
              component={ActivityLoggerCalorieDrawer}
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
    </Provider>
  )
}