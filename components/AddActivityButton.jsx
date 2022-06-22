import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Button, Text } from 'react-native-elements';
import Modal from 'react-native-modal';
import colours from "../assets/colours/colours";
import Feather from "react-native-vector-icons/Feather";
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
    <View style={{ marginLeft: 55 }}>
      <FloatingAction
        actions={actions}
        onPressItem={(name) => {
          navigation.push(name)
        }}
        color={colours.button}
        tintColor={colours.button}
        distanceToEdge={{ vertical: 0, horizontal: 0 }}
        buttonSize={60}
        iconHeight={25}
        iconWidth={25}
      >
      </FloatingAction>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    height: 60,
    width: 60,
    backgroundColor: colours.button,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 25,
    marginLeft: 20,
    marginRight: 20
  }
});
