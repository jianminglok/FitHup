import React, { useState, useRef, useEffect, useCallback } from "react";
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
import colours from "../assets/colours/colours";
import { useFonts } from "expo-font";
import Style from "./Style";
import Button from "./Button";
import { supabase } from '../lib/supabase';
import UploadImage from "./UploadImage";
import SelectDropdown from "react-native-select-dropdown";
import Entypo from "react-native-vector-icons/Entypo";
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import TopBar from "./TopBar";

let customFonts = {
    'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
    'RobotoRegular': require("../assets/fonts/Roboto-Regular.ttf"),
    'MontserratBold': require("../assets/fonts/Montserrat-Bold.ttf"),
};

export default ActivityLogger = ({ navigation }) => {
    const [appIsReady, setAppIsReady] = useState(false);
    const mounted = useRef(false);

    state = {
        fontsLoaded: false
    }

    const activityTypes = ['Exercise', 'Dietary Intake']
    const exerciseTypes = [
        'Aerobics',
        'Backpacking',
        'Badminton (singles)',
        'Baseball',
        'Basketball (half-court)',
        'Bicycling indoors (stationary bike)',
        'Bicycling stationary 100 w light error',
        'Bicycling stationary 150 w moderate effort',
        'Bicycling outdoors < 10 mph leisure',
        'Bicycling outdoors 10 - 11.9 mph leisuire light effort',
        'Bicycling outdoors 12 - 13.9 mph leisure moderate error',
        'Bicycling outdoors 14 - 15.9 mph fast or vigorous effort',
        'Calisthenics pushups pullups situps vigorous effort',
        'Calisthenics home exercise light or moderate effort'
    ]

    const [name, setName] = useState('');

    const [exerciseDate, setExerciseDate] = useState(new Date());
    const [exerciseDateShow, setExerciseDateShow] = useState(false);
    const [exerciseDateText, setExerciseDateText] = useState('DD/MM/YYYY');

    const onExerciseDateChange = (event, selectedDate) => {
        setExerciseDateShow(false);
        const currentDate = selectedDate || date;
        setExerciseDate(currentDate);
        let tempDate = new Date(currentDate);
        //Convert date to a readable format
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        setExerciseDateText(fDate);
    }

    const [exerciseStartTime, setExerciseStartTime] = useState(new Date());
    const [exerciseStartTimeShow, setExerciseStartTimeShow] = useState(false);
    const [exerciseStartTimeText, setExerciseStartTimeText] = useState('hh:mm');

    const onExerciseStartTimeChange = (event, selectedDate) => {
        setExerciseStartTimeShow(false);
        const currentDate = selectedDate || date;
        setExerciseStartTime(currentDate);
        let tempDate = new Date(currentDate);
        //Convert date to a readable format
        let fDate = tempDate.getHours() + ':' + String(tempDate.getMinutes()).padStart(2, '0');
        setExerciseStartTimeText(fDate);
    }

    const [exerciseEndTime, setExerciseEndTime] = useState(new Date());
    const [exerciseEndTimeShow, setExerciseEndTimeShow] = useState(false);
    const [exerciseEndTimeText, setExerciseEndTimeText] = useState('hh:mm');

    const onExerciseEndTimeChange = (event, selectedDate) => {
        setExerciseEndTimeShow(false);
        const currentDate = selectedDate || date;
        setExerciseEndTime(currentDate);
        let tempDate = new Date(currentDate);
        //Convert date to a readable format
        let fDate = tempDate.getHours() + ':' + String(tempDate.getMinutes()).padStart(2, '0');
        setExerciseEndTimeText(fDate);
    }

    const [activityType, setActivityType] = useState('Exercise');
    const [exerciseType, setExerciseType] = useState('');
    const [caloriesAmount, setCaloriesAmount] = useState('');

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
                Activity Logger
            </Text>

            <KeyboardAwareScrollView>
                {/*Activity Type Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 18 }]}>Activity Type</Text>

                    <View style={Style.profileDropdownContainer}>
                        <SelectDropdown
                            data={activityTypes}
                            defaultButtonText={'Select activity type'}
                            buttonStyle={styles.selection}
                            buttonTextStyle={Style.dropdownText}
                            renderDropdownIcon={() => <Entypo
                                name="chevron-small-down"
                                size={24}
                                color={colours.text}

                            />}
                            dropdownIconPosition="right"
                            onSelect={(selectedItem, index) => {
                                setActivityType(selectedItem)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                            rowTextForSelection={(item, index) => item}
                            rowStyle={{ backgroundColor: colours.background }}
                            rowTextStyle={Style.dropdownText}
                            defaultValue={activityType}
                        />
                    </View>
                </View>

                {activityType == 'Exercise' ?
                    // Exercise
                    <View>
                        {/*Exercise Type Field */}
                        <View>
                            <Text style={[Style.email, { marginTop: 18 }]}>Exercise Type</Text>

                            <View style={Style.profileDropdownContainer}>
                                <SelectDropdown
                                    data={exerciseTypes}
                                    defaultButtonText={'Select exercise type'}
                                    buttonStyle={styles.selection}
                                    buttonTextStyle={Style.dropdownText}
                                    renderDropdownIcon={() => <Entypo
                                        name="chevron-small-down"
                                        size={24}
                                        color={colours.text}

                                    />}
                                    dropdownIconPosition="right"
                                    onSelect={(selectedItem, index) => {
                                        setExerciseType(selectedItem)
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                    rowTextForSelection={(item, index) => item}
                                    rowStyle={{ backgroundColor: colours.background }}
                                    rowTextStyle={Style.dropdownText}
                                />
                            </View>
                        </View>

                        {/*Date of Exercise Field */}
                        <View>
                            <Text style={[Style.email, { marginTop: 13 }]}>Date of Exercise</Text>

                            {/* Date of Exercise Rectangle */}
                            <View style={Style.rect}>
                                <Text
                                    onPress={() => setExerciseDateShow(true)}
                                    style={Style.sampleEmail}>
                                    {exerciseDateText}
                                </Text>
                            </View>

                            {exerciseDateShow && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={exerciseDate}
                                    display='default'
                                    onChange={onExerciseDateChange}
                                />)}
                        </View>

                        {/*Exercise Start Time Field */}
                        <View>
                            <Text style={[Style.email, { marginTop: 13 }]}>Exercise Start Time</Text>

                            {/* Date of Exercise Rectangle */}
                            <View style={Style.rect}>
                                <Text
                                    onPress={() => setExerciseStartTimeShow(true)}
                                    style={Style.sampleEmail}>
                                    {exerciseStartTimeText}
                                </Text>
                            </View>

                            {exerciseStartTimeShow && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={exerciseStartTime}
                                    display='default'
                                    mode='time'
                                    onChange={onExerciseStartTimeChange}
                                />)}
                        </View>

                        {/*Exercise End Time Field */}
                        <View>
                            <Text style={[Style.email, { marginTop: 13 }]}>Exercise End Time</Text>

                            {/* Date of Exercise Rectangle */}
                            <View style={Style.rect}>
                                <Text
                                    onPress={() => setExerciseEndTimeShow(true)}
                                    style={Style.sampleEmail}>
                                    {exerciseEndTimeText}
                                </Text>
                            </View>

                            {exerciseEndTimeShow && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={exerciseEndTime}
                                    display='default'
                                    mode='time'
                                    onChange={onExerciseEndTimeChange}
                                />)}
                        </View>

                        {/*Calories Field */}
                        <View>
                            <Text style={[Style.email, { marginTop: 13 }]}>Amount of Calories Burnt (cal)</Text>
                            {/* Calories Rectangle */}
                            <View style={Style.rect}>
                                <TextInput
                                    style={[Style.sampleEmail]}
                                    keyboardType='number-pad'
                                    placeholder="Amount of Calories Burnt"
                                    placeholderTextColor={colours.text}
                                    value={caloriesAmount}
                                    onChangeText={(caloriesAmount) => setCaloriesAmount(caloriesAmount.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''))}
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                />
                            </View>
                        </View>

                        {/* Save Activity button */}
                        <View style={[Style.loginOrSignUpButton, { marginVertical: 20 }]}>
                            <Button
                                title='Save Activity'
                            />
                        </View>
                    </View> :
                    // View for Dietary Intage Logger
                    <View></View>}
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({

    header: {
        color: colours.text,
        fontFamily: "MontserratBold",
        fontSize: 24,
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
