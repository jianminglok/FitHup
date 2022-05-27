import React, { useCallback, useEffect, useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import colours from "../assets/colours/colours";
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import Style from "./Style";
import Button from "./Button";

let customFonts = {
  'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
  'ZenDots': require("../assets/fonts/ZenDots-Regular.ttf"),
};

export default function Launchpage({ navigation }) {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync(customFonts);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn(error);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container}
      onLayout={onLayoutRootView}>
      <StatusBar />
      <Image
        source={require("../assets/images/LaunchPageImage.jpg")}
        style={styles.launchImage}
      />

      <Text style={styles.name}>FitHup</Text>
      <View style={{}}>
        <View style={[Style.loginOrSignUpButton, { marginTop: 10 }]}>
          <Button title={"Login"} onPress={() => navigation.navigate("Login")} />
        </View>

        <View style={[Style.loginOrSignUpButton, { marginTop: 20, marginBottom: 40, }]}>
          <Button
            title={"Sign Up"}
            onPress={() => navigation.navigate("Sign Up")}
          />
        </View>

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
    height: 631,
    opacity: 0.3,
    flex: 631 + StatusBar.currentHeight / 812
  },

  name: {
    color: colours.text,
    fontFamily: "ZenDots",
    fontSize: 48,
    justifyContent: 'center',
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 105,
  },
});
