import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider, useSelector } from "react-redux";

import colours from "./assets/colours/colours";
import ActivityLoggerCalorie from "./components/ActivityLoggerCalorie";
import ActivityLoggerExercise from "./components/ActivityLoggerExercise";
import BottomBar from "./components/BottomBar";
import ForgotPassword from "./components/ForgotPassword";
import Launchpage from "./components/Launchpage";
import Login from "./components/Login";
import SetupProfile from "./components/SetupProfile";
import Signup from "./components/Signup";
import FoodLog from "./components/FoodLog";
import ExerciseLog from "./components/ExerciseLog";
import Recommendations from "./components/Recommendations";
import Style from "./components/Style";
import { supabase } from "./lib/supabase";
import "react-native-url-polyfill/auto";
import "react-native-gesture-handler";
import { store } from "./store";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    } else {
      navigation.navigate("Launchpage");
    }
  } catch (error) {
    console.log(error);
  }
}

function CustomDrawerContent(props) {
  const { name } = useSelector((state) => state.profile);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[Style.header, { backgroundColor: colours.tab }]}>
        <Text style={[{ color: colours.text, marginLeft: 17, fontSize: 20 }]}>
          Hi, {name}
        </Text>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label="Sign Out"
          onPress={() => signOut()}
          labelStyle={{
            color: colours.text,
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
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: colours.background,
        },
      }}
    >
      <Drawer.Screen
        name="ActivityLoggerExerciseDrawer"
        component={ActivityLoggerExercise}
        options={{
          headerShown: false,
          drawerItemStyle: { height: 0 },
        }}
      />
    </Drawer.Navigator>
  );
}

function ActivityLoggerCalorieDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: colours.background,
        },
      }}
    >
      <Drawer.Screen
        name="ActivityLoggerCalorieDrawer"
        component={ActivityLoggerCalorie}
        options={{
          headerShown: false,
          drawerItemStyle: { height: 0 },
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App({ navigation }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setSession(supabase.auth.session());
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {session && session.user ? (
          <Stack.Navigator>
            <Stack.Screen
              name="TabStack"
              component={BottomBar}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="FoodLog"
              component={FoodLog}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ExerciseLog"
              component={ExerciseLog}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Recommendations"
              component={Recommendations}
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
          </Stack.Navigator>
        ) : (
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
        )}
      </NavigationContainer>
    </Provider>
  );
}
