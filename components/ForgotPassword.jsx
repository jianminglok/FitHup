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
        <Text style={Style.headerText}>Forgot{"\n"}Password?</Text>
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
              value = {email}
              onChangeText={(email) => setEmail(email)}
              autoComplete="email"
            />
          </View>

          <Text style={styles.resetPassword}>
            *We will send a link to your email to reset your password.
          </Text>
        </View>

        {/*Continue button*/}

        <View style={[Style.loginOrSignUpButton, { marginTop: 130, marginRight: 11 }]}>
          <Button 
            title ={"Continue"}
            disabled = {loading}
            onPress = {() => sendResetEmail()}
          />
        </View>

        {/*Back to Login */}
        <View>
          <Text style={[Style.account, { marginLeft: 75,marginBottom :148 }]}>
            Remember your password?
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={[Style.signUpOrLogin, { marginLeft: 255 }]}>
              Log in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
