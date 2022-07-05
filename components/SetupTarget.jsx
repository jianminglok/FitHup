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
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from "react-native-select-dropdown";
import Entypo from "react-native-vector-icons/Entypo";
import { values, exercises } from '../assets/activities';
import { useDispatch, useSelector } from 'react-redux';

let customFonts = {
    'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
    'RobotoRegular': require("../assets/fonts/Roboto-Regular.ttf"),
    'MontserratBold': require("../assets/fonts/Montserrat-Bold.ttf"),
};

function calculateAge(birthDate, otherDate) {
    birthDate = new Date(birthDate);
    otherDate = new Date(otherDate);

    var years = (otherDate.getFullYear() - birthDate.getFullYear());

    if (otherDate.getMonth() < birthDate.getMonth() ||
        otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
        years--;
    }

    return years;
}

export default SetupTarget = ({ navigation }) => {

    state = {
        fontsLoaded: false
    }
    const [appIsReady, setAppIsReady] = useState(false);
    const mounted = useRef(false);
    const [counter, setCounter] = useState(0);

    const dispatch = useDispatch();
    const { weight, dateOfBirth, gender, height, BMI, weightTargets, lifestyleType } = useSelector((state) => state.profile);

    const [loading, setLoading] = useState(false);
    const [recommendedCaloriesIntake, setRecommendedCaloriesIntake] = useState(0);

    const weights = ['0.25kg per week', '0.5kg per week']

    const computeCalIntake = (targetType, targetWeight) => {
        //Calculate BMR according to gender
        let BMR, TDEE;
        if (gender == 'Male') {
            BMR = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * calculateAge(new Date(dateOfBirth), new Date());
        } else if (gender == 'Female') {
            BMR = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * calculateAge(new Date(dateOfBirth), new Date());
        }

        //Calculate TDEE according to lifestyleType
        if (lifestyleType == 'Sedentary') {
            TDEE = BMR * 1.2;
        } else if (lifestyleType == 'Lightly Active') {
            TDEE = BMR * 1.375;
        } else if (lifestyleType == 'Moderately Active') {
            TDEE = BMR * 1.55;
        } else if (lifestyleType == 'Very Active') {
            TDEE = BMR * 1.725;
        } else if (lifestyleType == 'Extra Active') {
            TDEE = BMR * 1.9;
        }

        //Calculate final TDEE based on target type
        if (targetType == "Gain Weight") {
            if (targetWeight == "0.5kg per week") {
                TDEE += 500;
            } else if (targetWeight == "0.25kg per week") {
                TDEE += 250;
            }
        } else if (targetType == "Lose Weight") {
            if (targetWeight == "0.5kg per week") {
                TDEE -= 500;
            } else if (targetWeight == "0.25kg per week") {
                TDEE -= 250;
            }
        }

        setCaloriesIntakeAmount(Math.round(TDEE).toString());
        setRecommendedCaloriesIntake(Math.round(TDEE));
    };

    const [targetType, setTargetType] = useState(weightTargets[0]);
    const [targetWeight, setTargetWeight] = useState('');
    const [caloriesIntakeAmount, setCaloriesIntakeAmount] = useState('');
    const [caloriesBurntAmount, setCaloriesBurntAmount] = useState('');

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

        //Get current target from the database
        const getTarget = async () => {
            try {
                setLoading(true);
                const user = supabase.auth.user();
                if (!user) throw new Error("No user on the session!");

                let { data, error, status } = await supabase
                    .from("target")
                    .select(`targetType, targetWeight, caloriesIntakeAmount, caloriesBurntAmount`)
                    .eq("id", user.id)
                    .single();
                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    if (data.targetType) setTargetType(data.targetType);
                    if (data.targetWeight) setTargetWeight(data.targetWeight);
                    if (data.caloriesIntakeAmount) setCaloriesIntakeAmount(data.caloriesIntakeAmount.toString());
                    if (data.caloriesBurntAmount) setCaloriesBurntAmount(data.caloriesBurntAmount.toString());
                }
            } catch (error) {
                Alert.alert((error).message);
            } finally {
                setLoading(false);
            }
        }

        prepare();
        //Get saved target details
        if (mounted.current != false) {
            computeCalIntake();
            getTarget();
        }

        return () => { mounted.current = false; };
    }, []);

    async function updateTarget() {
        let success = false;
        try {
            setLoading(true);

            const user = supabase.auth.user();
            if (!user) throw new Error("No user on the session!");

            if (!targetType) {
                throw new Error("Please enter the type of target!")
            }

            if (!caloriesIntakeAmount) {
                throw new Error("Please enter the calories intake amount!")
            }

            if (parseInt(caloriesIntakeAmount) < 1500) {
                throw new Error("The value of calories intake is too low")
            }

            if (parseInt(caloriesIntakeAmount) > 1.25 * recommendedCaloriesIntake) {
                throw new Error("The value of calories intake is too high")
            }

            const updates = {
                id: user.id,
                targetType,
                targetWeight,
                caloriesIntakeAmount: parseInt(caloriesIntakeAmount),
                caloriesBurntAmount: parseInt(caloriesBurntAmount),
                recommendedCaloriesIntakeAmount: recommendedCaloriesIntake
            };

            const { data, error } = await supabase
                .from('target')
                .upsert(updates);

            if (data) {
                Alert.alert('Target successfully set!')
                success = true;
            }

            if (error) {
                throw error;
            }
        } catch (error) {
            Alert.alert((error).message);
        } finally {
            setLoading(false);
            if (success) {
                navigation.push("TabStack");
            }
        }
    }

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
                Setup Target
            </Text>

            <KeyboardAwareScrollView>
                {/*Target Type Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 18 }]}>Target Type</Text>

                    <View style={Style.profileDropdownContainer}>
                        <SelectDropdown
                            testId="targetTypeFIeld"
                            data={weightTargets}
                            defaultValueByIndex={0}
                            defaultButtonText={'Select target type'}
                            buttonStyle={styles.selection}
                            buttonTextStyle={Style.dropdownText}
                            renderDropdownIcon={() => <Entypo
                                name="chevron-small-down"
                                size={24}
                                color={colours.text}

                            />}
                            dropdownIconPosition="right"
                            onSelect={(selectedItem, index) => {
                                setTargetType(selectedItem)
                                computeCalIntake(selectedItem, targetWeight)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                            rowTextForSelection={(item, index) => item}
                            rowStyle={{ backgroundColor: colours.background }}
                            rowTextStyle={Style.dropdownText}
                            defaultValue={targetType}
                        />
                    </View>
                    <View display={(BMI > 18.5 && BMI < 24.9) ? "none" : "flex"}>
                        <Text style={[Style.email, { marginTop: 8 }]} >{BMI < 18.5 ? "You are currently underweight" : BMI < 24.9 ? "" : "You are currently overweight"}</Text>
                    </View>
                </View>

                {/*Target Weight Field */}
                <View display={targetType == "Maintain Weight" ? "none" : "flex"}>
                    <Text style={[Style.email, { marginTop: 13 }]}>Target Weight</Text>

                    <View style={Style.profileDropdownContainer}>
                        <SelectDropdown
                            testID="weightField"
                            data={weights}
                            defaultButtonText={'Select target weight'}
                            buttonStyle={styles.selection}
                            buttonTextStyle={Style.dropdownText}
                            renderDropdownIcon={() => <Entypo
                                name="chevron-small-down"
                                size={24}
                                color={colours.text}

                            />}
                            dropdownIconPosition="right"
                            onSelect={(selectedItem, index) => {
                                setTargetWeight(selectedItem)
                                computeCalIntake(targetType, selectedItem)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                            rowTextForSelection={(item, index) => item}
                            rowStyle={{ backgroundColor: colours.background }}
                            rowTextStyle={Style.dropdownText}
                            defaultValue={targetWeight}
                        />
                    </View>
                </View>

                {/*Calorie Intake Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 13 }]}>Target Calorie Intake (cal)</Text>
                    {/* Calories Intake Rectangle */}
                    <View style={Style.rect}>
                        <TextInput
                            testID='calorieIntakeField'
                            style={[Style.sampleEmail]}
                            keyboardType='number-pad'
                            placeholder="Target mount of calories taken in"
                            placeholderTextColor={colours.text}
                            value={caloriesIntakeAmount}
                            onChangeText={(caloriesIntakeAmount) => setCaloriesIntakeAmount(caloriesIntakeAmount.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''))}
                            autoCapitalize="none"
                            returnKeyType="next"
                        />
                    </View>
                </View>

                {/*Calorie Burnt Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 13 }]}>Target Calorie Burnt (cal)</Text>
                    {/* Calories Burnt Rectangle */}
                    <View style={Style.rect}>
                        <TextInput
                            testID='calorieBurntField'
                            style={[Style.sampleEmail]}
                            keyboardType='number-pad'
                            placeholder="Target amount of calories burnt"
                            placeholderTextColor={colours.text}
                            value={caloriesBurntAmount}
                            onChangeText={(caloriesBurntAmount) => setCaloriesBurntAmount(caloriesBurntAmount.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''))}
                            autoCapitalize="none"
                            returnKeyType="next"
                        />
                    </View>
                </View>

                {/* Save Activity button */}
                <View style={[Style.loginOrSignUpButton, { marginVertical: 20 }]}>
                    <Button
                        testId="saveBtn"
                        title='Save Target'
                        onPress={() => updateTarget()}
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
