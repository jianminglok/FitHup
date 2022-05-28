import React, { useState, useRef } from "react";
import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colours from "../assets/colours/colours";
import { useFonts } from "expo-font";
import Style from "./Style";
import MailIcon from "./MailIcon";
import LockIcon from "./LockIcon";
import EyeIcon from "./MailIcon";
import Button from "./Button";
import { supabase } from '../lib/supabase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  /*Eye icon*/
  const [showPassword, setShowPassword] = useState(false);

  const passwordInput = useRef();

  const [loaded] = useFonts({
    RobotoMedium: require("../assets/fonts/Roboto-Medium.ttf"),
    RobotoRegular: require("../assets/fonts/Roboto-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  async function signInWithEmail() {
    try {
      setLoading(true);

      const { user, error } = await supabase.auth.signIn({
        email: email,
        password: password,
      });

      if (error) {
        throw error
      } else if (user) {
        Alert.alert("Successfully logged in");
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <View style={Style.container}>
      <StatusBar />
      {/* Header */}
      <SafeAreaView style={Style.header}>
        <Text adjustsFontSizeToFit style={Style.headerText}>Welcome {"\n"}Back!</Text>
      </SafeAreaView>

      {/*Body */}
      <KeyboardAwareScrollView 
        style={Style.body} 
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true} 
        contentContainerStyle={{flexGrow: 1}} >
        {/*Email Field */}
        <View>
          <Text style={Style.email}>Email address</Text>

          {/* Email Rectangle */}
          <View style={Style.rect}>
            {/* Mail icon */}
            <MailIcon />

            <TextInput
              style={Style.sampleEmail}
              placeholder="Enter your email"
              placeholderTextColor={colours.text}
              onChangeText={setEmail}
              autoComplete="email"
              autoCapitalize="none"
              onSubmitEditing={() => { passwordInput.current.focus(); }}
              returnKeyType="next"
            />
          </View>
        </View>

        {/* Password field */}
        <View>
          <Text style={Style.password}>Password</Text>

          {/* Password Rectangle */}
          <View style={Style.rect}>
            {/*Lock icon */}
            <LockIcon />
            <TextInput
              style={Style.samplePassword}
              placeholder="Enter your password"
              placeholderTextColor={colours.text}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              ref={passwordInput}
            />

            {/* Eye icon */}
            <TouchableOpacity
              value={showPassword}
              onPress={() =>
                showPassword ? setShowPassword(false) : setShowPassword(true)
              }
            >
              <EyeIcon />
            </TouchableOpacity>

          </View>
        </View>

        {/*Rememeber Me Field */}
        <View >
          <TouchableOpacity onPress={() => navigation.navigate("Forgot Password")}>
            <Text style={styles.forgotpw}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={[Style.loginOrSignUpButtonContainer]}>
          {/*Log in button*/}
          <View style={[Style.loginOrSignUpButton]}>
            <Button title={"Login"} onPress={signInWithEmail} />
          </View>

          {/*Create account */}
          <View style={Style.signUpOrLoginContainer}>
            <Text style={[Style.account]}>Don't have an account?</Text>

            <TouchableOpacity onPress={() => navigation.navigate("Sign Up")}>
              <Text style={[Style.signUpOrLogin]}>Create one now</Text>
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAwareScrollView>
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

  forgotpw: {
    color: colours.password,
    fontFamily: "RobotoMedium",
    fontSize: 12,
    marginTop: 27,
    marginRight: 27,
    alignSelf: "flex-end"
  },
});