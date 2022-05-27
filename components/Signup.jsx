import React, { useState, useRef } from "react";
import {
  Alert,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from '../lib/supabase';
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import colours from "../assets/colours/colours";
import { useFonts } from "expo-font";
import Style from './Style';
import MailIcon from "./MailIcon";
import LockIcon from "./LockIcon";
import EyeIcon from "./EyeIcon";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default Signup = ({ navigation }) => {

  const [loaded] = useFonts({
    RobotoMedium: require("../assets/fonts/Roboto-Medium.ttf"),
    RobotoRegular: require("../assets/fonts/Roboto-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  {
    /*Email*/
  }
  const [email, setEmail] = useState("");

  {
    /*Password*/
  }
  const [password, setPassword] = useState("");

  {
    /*Eye icon */
  }
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const passwordInput = useRef();
  const confirmPasswordInput = useRef();

  async function signUpWithEmail() {
    try {
      setLoading(true);

      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        throw error
      } else if (user) {
        Alert.alert("Successfully signed up. Please activate your account from your email.")
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={Style.container}>
      <StatusBar />

      {/* Header */}
      <SafeAreaView style={Style.header}>
        <Text style={Style.headerText}>Sign Up</Text>
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
              onChangeText={(email) => setEmail(email)}
              autoComplete="email"
              autoCapitalize="none"
              onSubmitEditing={() => { passwordInput.current.focus() }}
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
              value={password}
              ref={passwordInput}
              onSubmitEditing={() => { confirmPasswordInput.current.focus() }}
              returnKeyType="next"
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

        {/* Confirm Password field */}
        <View>
          <Text style={Style.password}>Confirm Password</Text>

          {/* Password Rectangle */}
          <View style={Style.rect}>
            {/*Lock icon */}
            <Feather
              name="lock"
              size={25}
              color={colours.text}
              style={Style.icon}
            />
            <TextInput
              style={Style.samplePassword}
              placeholder="Enter your password"
              placeholderTextColor={colours.text}
              secureTextEntry={!showConfirmPassword}
              ref={confirmPasswordInput}
            />

            {/* Eye icon */}
            <TouchableOpacity
              value={showConfirmPassword}
              onPress={() =>
                showConfirmPassword ? setShowConfirmPassword(false) : setShowConfirmPassword(true)
              }
            >
              <EyeIcon />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[Style.loginOrSignUpButtonContainer]}>
          {/*Sign up button*/}
          <View style={[Style.loginOrSignUpButton]}>
            <Button
              title={"Sign Up"}
              onPress={() => signUpWithEmail()}
            />
          </View>

          {/*Back to Login */}
          <View style={Style.signUpOrLoginContainer}>
            <Text style={[Style.account]}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[Style.signUpOrLogin]}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAwareScrollView>
    </View>

  );
};



