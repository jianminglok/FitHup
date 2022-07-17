import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from "react-native";
import colours from "../assets/colours/colours";
import { FloatingAction } from "react-native-floating-action";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default AddActivityButton = ({ navigation }) => {

  const actions = [
    {
      text: "Exercise",
      icon: <FontAwesome5
        name="dumbbell"
        size={20}
        style={{ transform: [{ rotateZ: '-25deg' }], position: 'absolute', alignSelf: 'center' }}
        color={colours.button}
      />,
      name: "ActivityLoggerExercise",
      position: 1,
    },

    {
      text: "Dietary Intake",
      icon: require("../assets/images/Calorie_red.png"),
      name: "ActivityLoggerCalorie",
      position: 2
    },
  ];

  return (
    <View>
      <FloatingAction
        actions={actions}
        onPressItem={(name) => {
          navigation.push(name)
        }}
        color={colours.button}
        tintColor={colours.button}
        distanceToEdge= {{vertical: 0, horizontal: -25}}
        buttonSize={60}
        iconHeight={25}
        iconWidth={25}

      >
      </FloatingAction>
    </View>
  );
}