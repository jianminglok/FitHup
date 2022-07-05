import { supabase } from '../lib/supabase'
import React, { useState, useEffect, useRef, useCallback } from "react"
import * as SplashScreen from 'expo-splash-screen';
import colours from "../assets/colours/colours";
import {
    Alert,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as Font from 'expo-font';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TopBar from './TopBar';
import Style from './Style';
import Button from "./Button";
import SelectDropdown from "react-native-select-dropdown";
import Entypo from "react-native-vector-icons/Entypo";

let customFonts = {
    'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
    'RobotoRegular': require("../assets/fonts/Roboto-Regular.ttf"),
    'MontserratBold': require("../assets/fonts/Montserrat-Bold.ttf"),
};

export default ActivityLoggerCalorie = ({ navigation }) => {

    state = {
        fontsLoaded: false
    }
    const [appIsReady, setAppIsReady] = useState(false);
    const mounted = useRef(false);
    const [loading, setLoading] = useState(false);
    const targets = ['Maintain Weight', 'Lose Weight', 'Gain Weight'];
    const severityOfTarget = ['Mild(0.25kg/week)', 'Moderate(0.5kg/week)', 'Extreme(1 kg/week)'];
    const [targetType, setTargetType] = useState('');
    const [severity, setSeverity] = useState('');
    const [calorieIntake, setCalorieIntake] = useState('');
    const [calorieOutput, setCalorieOutput] = useState('');


    useEffect(() => {
        mounted.current = true;
        // Prepare to load custom fonts
        async function prepare() {
            try {
                await SplashScreen.preventAutoHideAsync();
                await Font.loadAsync(customFonts);
            } catch (error) {
                console.warn(error);
            } finally {
                if (mounted.current != false) {
                    setAppIsReady(true);
                }
            }
        }

    
        prepare();

        return () => { mounted.current = false; };
    }, []);

   

    // Display splash screen while font is loading
    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <View style={Style.profileContainer} onLayout={onLayoutRootView}>
            <StatusBar />
            <TopBar navigation={navigation} />
            <Text style={styles.header}>
                Set Up Target
            </Text>

            <KeyboardAwareScrollView>
                {/*Target Type Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 18 }]}>Type of Target</Text>

                    <View style={Style.profileDropdownContainer}>
                        <SelectDropdown
                            data={targets}
                            defaultButtonText={'Select target type'}
                            buttonStyle={styles.selection}
                            buttonTextStyle={Style.dropdownText}
                            renderDropdownIcon={() => <Entypo
                                name="chevron-small-down"
                                size={24}
                                color={colours.text}

                            />}
                            dropdownIconPosition="right"
                            onSelect={(selectedItem, index) => 
                                setTargetType(selectedItem)
                            }
                            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                            rowTextForSelection={(item, index) => item}
                            rowStyle={{ backgroundColor: colours.background }}
                            rowTextStyle={Style.dropdownText}
                            
                        />
                    </View>
                </View>

                {targetType !== 'Maintain Weight'?

                    // if user choose gain or lose weight
                    
                    <View>
                        {/*Target Severity Type Field */}
                        <Text style={[Style.email, { marginTop: 18 }]}>Amount of Weight Loss/Gain</Text>

                        <View style={Style.profileDropdownContainer}>
                            <SelectDropdown
                                data={severityOfTarget}
                                defaultButtonText={'Select severity of weight loss/gain'}
                                buttonStyle={styles.selection}
                                buttonTextStyle={Style.dropdownText}
                                renderDropdownIcon={() => <Entypo
                                    name="chevron-small-down"
                                    size={24}
                                    color={colours.text}
                                    
                                />}
                                dropdownIconPosition="right"
                                onSelect={(selectedItem, index) => 
                                    setSeverity(selectedItem)
                                }
                                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                rowTextForSelection={(item, index) => item}
                                rowStyle={{ backgroundColor: colours.background }}
                                rowTextStyle={Style.dropdownText}
                                
                            />
                        </View>  

                    </View> :

                    <View></View>}

                {/*Calories Intake Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 18 }]}>Target Daily Calorie Intake (cal)</Text>
                    {/* Calories Intake Rectangle */}
                    <View style={Style.rect}>
                        <TextInput
                            style={[Style.sampleEmail]}
                            keyboardType='number-pad'
                            placeholder="Target Daily Calorie Intake"
                            placeholderTextColor={colours.text}
                            value={calorieIntake}
                            onChangeText={(calorieIntake) => setCalorieIntake(calorieIntake.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''))}
                            autoCapitalize="none"
                            returnKeyType="next"
                        />
                    </View>
                </View>
                
                {/*Calories Output Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 18 }]}>Target Daily Calorie Output (cal)</Text>
                    {/* Calories Output Rectangle */}
                    <View style={Style.rect}>
                        <TextInput
                            style={[Style.sampleEmail]}
                            keyboardType='number-pad'
                            placeholder="Target Daily Calorie Output"
                            placeholderTextColor={colours.text}
                            value={calorieOutput}
                            onChangeText={(calorieOutput) => setCalorieOutput(calorieOutput.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''))}
                            autoCapitalize="none"
                            returnKeyType="next"
                        />
                    </View>
                </View>
               
               {/* Save Target button */}
               <View style={[Style.loginOrSignUpButton, { marginVertical: 20 }]}>
                    <Button
                        testId="saveBtn"
                        title='Save Target'
                        onPress={() => navigation.push("TabStack")}
                    />
                </View>

    
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({

    header: {
        color: colours.text,
        fontFamily: "MontserratBold",
        fontSize: 24,
        marginTop: 19,
        marginLeft: 27
    },

    selection: {
        backgroundColor: colours.tab,
        marginTop: 6,
        borderRadius: 14,
        height: 45,
        width: '100%'
    },

});
