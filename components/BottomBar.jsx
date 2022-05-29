import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colours from '../assets/colours/colours';
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Homepage from './Homepage';
import AddActivityButton from './AddActivityButton';
import React, { useState, useCallback, useEffect } from "react"
import { Image } from 'react-native';


const Tab = createBottomTabNavigator();

export default function BottomBar() {

  const [appIsReady, setAppIsReady] = useState(false);

   
    return (
      <Tab.Navigator
        tabBarOptions={{
          showLabel: false,
        }}
        screenOptions={{
          tabBarStyle: { backgroundColor: colours.background, },
        }}>
        <Tab.Screen
          name="Leaderboard"
          component={Homepage}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Image
                source = {require("../assets/images/Leaderboard.png")}
                style = {{width:30, height: 30,marginTop :10}}
                color={colours.text}
              />
            )
          }} />
        <Tab.Screen
          name="Calories"
          component={Homepage}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={require("../assets/images/Calorie.png")}
                style ={{width:23, height:23, resizeMode: 'contain'}}
                color={colours.text}
              />
            )
          }} />
        <Tab.Screen
          name="Add Activity"
          component={Homepage}
          options={{
            tabBarIcon: ({ focused }) => (
              <Feather
                name = "plus"
                size={50}
                color={colours.text}
              />
            ),
            tabBarButton: (props) => (
              <AddActivityButton {...props} />
            )
          }} />
        <Tab.Screen
          name="Exercise"
          component={Homepage}
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesome5
                name="dumbbell"
                size={20}
                color={colours.text}
              />
            )
          }} />
        <Tab.Screen
          name="Target"
          component={Homepage}
          options={{
            tabBarIcon: ({ focused }) => (
              <Feather
                name="target"
                size={25}
                color={colours.text}
              />
            )
          }} />
      </Tab.Navigator>
    );
  }