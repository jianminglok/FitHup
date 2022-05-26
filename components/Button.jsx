import React from "react";
import colours from "../assets/colours/colours";
import { Pressable, Text } from "react-native";
import Style from "./Style";

export default Button = (props) => {
  const { title, onPress, disabled } = props;
  return (
    <Pressable
      disabled = {disabled}
      onPress={onPress}
      android_ripple={{
        color: colours.text,
        borderless: true,
        radius: 161,
      }}
      hitSlop={{
        bottom: 14,
        left: 139,
        right: 138,
        top: 13,
      }}
    >
      <Text style={Style.loginOrSignUpText}>{title}</Text>
    </Pressable>
  );
};
