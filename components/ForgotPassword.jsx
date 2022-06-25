import React, { useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from '../lib/supabase'
import { SafeAreaView } from "react-native-safe-area-context";
import colours from "../assets/colours/colours";
import { useFonts } from "expo-font";
import Style from "./Style";
import MailIcon from "./MailIcon";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Button from './Button';

export default ForgotPassword = ({ navigation }) => {
  const [loaded] = useFonts({
    RobotoMedium: require("../assets/fonts/Roboto-Medium.ttf"),
    RobotoRegular: require("../assets/fonts/Roboto-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  {
    /*Email*/
  }
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false)

  async function sendResetEmail() {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.api
        .resetPasswordForEmail(email)

      if (error) {
        throw error
      } else if (data) {
        Alert.alert("Password reset email sent successfully");
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
        <Text adjustsFontSizeToFit style={Style.headerText}>Forgot{"\n"}Password?</Text>
      </SafeAreaView>

      {/*Body */}
      <KeyboardAwareScrollView
        style={Style.body}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        contentContainerStyle={{ flexGrow: 1 }} >
        {/*Email Field */}
        <View>
          <Text style={Style.email}>Email address</Text>

          {/* Email Rectangle */}
          <View style={Style.rect}>
            {/* Mail icon */}
            <MailIcon />
            <TextInput
              testID="forgotPwdEmail"
              style={Style.sampleEmail}
              placeholder="Enter your email"
              placeholderTextColor={colours.text}
              value={email}
              onChangeText={(email) => setEmail(email)}
              autoComplete="email"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.resetPassword}>
            *We will send a link to your email to reset your password.
          </Text>
        </View>

        <View style={[Style.loginOrSignUpButtonContainer]}>
          {/*Continue button*/}
          <View style={[Style.loginOrSignUpButton]}>
            <Button
              testID="forgotPwdBtn"
              title={"Continue"}
              disabled={loading}
              onPress={() => sendResetEmail()}
            />
          </View>

          {/*Back to Login */}
          <View style={Style.signUpOrLoginContainer}>
            <Text style={[Style.account]}>
              Remember your password?
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text testID="loginBtn" style={[Style.signUpOrLogin]}>
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  resetPassword: {
    color: colours.text,
    fontFamily: "RobotoRegular",
    fontSize: 11,
    marginLeft: 27,
    marginTop: 12,
  },
});
