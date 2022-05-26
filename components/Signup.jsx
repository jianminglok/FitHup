import React, { useState } from "react";
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


export default Signup = ({navigation}) => {

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

      const [loading, setLoading] = useState(false)


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
                            onChangeText = {setPassword}
                            value = {password}
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

                {/*Sign up button*/}

                <View style={[Style.loginOrSignUpButton, {marginTop : 70, marginRight: 27}]}>
                    <Button 
                        title = {"Sign Up"}
                        onPress = {() => signUpWithEmail()}
                    />
                </View>

                {/*Back to Login */}
                <View >
                    <Text style={[Style.account]}>Already have an account?</Text>

                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={[Style.signUpOrLogin, {}]}>Log in</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>

    );
};



