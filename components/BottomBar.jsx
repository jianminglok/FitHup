import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colours from '../assets/colours/colours';
import Feather from "react-native-vector-icons/Feather";
import Homepage from './Homepage';
import AddActivityButton from './AddActivityButton';

const Tab = createBottomTabNavigator();

export default function BottomBar() {
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
              <Feather
                name="bar-chart-2"
                size={25}
                color={colours.text}
              />
            )
          }} />
        <Tab.Screen
          name="Calories"
          component={Homepage}
          options={{
            tabBarIcon: ({ focused }) => (
              <Feather
                name="x-square"
                size={25}
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
                name="plus"
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
              <Feather
                name="x-square"
                size={25}
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