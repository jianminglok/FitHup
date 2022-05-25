import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Checkbox from "expo-checkbox";
import { SafeAreaView } from "react-native-safe-area-context";
import colours from "../assets/colours/colours";
import { useFonts } from "expo-font";
import Style from "./Style";
import MailIcon from "./MailIcon";
import LockIcon from "./LockIcon";
import EyeIcon from "./EyeIcon";
import Button from "./Button";


export default Login = ({navigation}) => {
  const [loaded] = useFonts({
    RobotoMedium: require("../assets/fonts/Roboto-Medium.ttf"),
    RobotoRegular: require("../assets/fonts/Roboto-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  {
    /*CheckBox */
  }
  const [isChecked, setChecked] = useState(false);

  {
    /*Email*/
  }
  const [email, setEmail] = useState("");

  {
    /*Password*/
  }
  const [password, setPassword] = useState("");

  {
    /*Eye icon*/
  }
  const [showPassword, setShowPassword] = useState(false);

  if (!loaded) {
    return null;
  }

  return (
    <View style={Style.container}>
      <StatusBar />
      {/* Header */}
      <SafeAreaView style={Style.header}>
        <Text style={Style.headerText}>Welcome {"\n"}Back!</Text>
      </SafeAreaView>

      {/*Body */}
      <View style={Style.body}>
        {/*Email Field */}
        <View>
          <Text style={Style.email}>Email address</Text>

          {/* Email Rectangle */}
          <View style={Style.rect}>
            {/* Mail icon */}
            <MailIcon/>

            <TextInput
              style={Style.sampleEmail}
              placeholder="Enter your email"
              placeholderTextColor={colours.text}
              onChangeText={(email) => setEmail(email)}
              autoComplete="email"
            />
          </View>
        </View>

        {/* Password field */}
        <View>
          <Text style={Style.password}>Password</Text>

          {/* Password Rectangle */}
          <View style={Style.rect}>
            {/*Lock icon */}
            <LockIcon/>
            <TextInput
              style={Style.samplePassword}
              placeholder="Enter your password"
              placeholderTextColor={colours.text}
              secureTextEntry={showPassword}
            />

            {/* Eye icon */}
            <TouchableOpacity
              value={showPassword}
              onPress={() =>
                showPassword ? setShowPassword(false) : setShowPassword(true)
              }
            >
              <EyeIcon/>
            </TouchableOpacity>
          </View>
        </View>

        {/*Rememeber Me Field */}
        <View>
          
          <TouchableOpacity onPress={() => navigation.navigate("Forgot Password")}>
            <Text style={styles.forgotpw}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/*Log in button*/}

        <View style={[Style.loginOrSignUpButton, { marginTop: 130 }]}>
          <Button title ={"Login"}/>
        </View>

        {/*Create account */}
        <View>
          <Text style={Style.account}>Don't have an account?</Text>

          <TouchableOpacity onPress={() => navigation.navigate("Sign Up")}>
            <Text style={Style.signUpOrLogin}>Create one now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  checkBox: {
    marginLeft: 27,
    marginTop: 24,
    borderRadius: 3,
    position: "absolute",
  },

  rmbme: {
    color: colours.text,
    fontFamily: "RobotoRegular",
    fontSize: 12,
    marginLeft: 53,
    marginTop: 27,
    position: "absolute",
  },

  forgotpw: {
    position: "absolute",
    color: colours.password,
    fontFamily: "RobotoMedium",
    fontSize: 12,
    marginLeft: 250,
    marginTop: 27,
  },
});
