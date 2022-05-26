import React from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import colours from "../assets/colours/colours";
import { useFonts } from "expo-font";
import Style from "./Style";
import Button from "./Button";

export default LaunchPage = ({ navigation }) => {
  const [loaded] = useFonts({
    RobotoMedium: require("../assets/fonts/Roboto-Medium.ttf"),
    ZenDots: require("../assets/fonts/ZenDots-Regular.ttf"),
  });

  return (
    <View style={styles.container}>
      <StatusBar />
      <Image
        source={require("../assets/images/LaunchPageImage.jpg")}
        style={styles.launchImage}
      />

      <Text style={styles.name}>FitHup</Text>

      <View style={[Style.loginOrSignUpButton, { marginTop: 15 }]}>
        <Button title={"Login"} onPress={() => navigation.navigate("Login")} />
      </View>

      <View style={[Style.loginOrSignUpButton, { marginTop: 23 }]}>
        <Button
          title={"Sign Up"}
          onPress={() => navigation.navigate("Sign Up")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },

  launchImage: {
    width: 470,
    height: 631 - StatusBar.currentHeight,
    opacity: 0.3,
  },

  name: {
    color: colours.text,
    fontFamily: "ZenDots",
    fontSize: 48,
    position: "absolute",
    marginTop: 105,
    marginLeft: 100,
  },
});
