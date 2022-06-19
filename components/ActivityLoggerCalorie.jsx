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

export default ActivityLoggerCalorie = ({ navigation }) => {
    const [appIsReady, setAppIsReady] = useState(false);
    const mounted = useRef(false);

    state = {
        fontsLoaded: false
    }

    const activityTypes = ['Exercise', 'Dietary Intake']
    const foodTypes = [
        'Rice',
        'Chicken',
        'Noodles'
    ]
    const units = ['grams', 'bowls'];
    const [portionValue, setPortionValue] = useState('');

   

    const [foodDate, setFoodDate] = useState(new Date());
    const [foodDateShow, setFoodDateShow] = useState(false);
    const [foodDateText, setFoodDateText] = useState('DD/MM/YYYY');

    const onFoodDateChange = (event, selectedDate) => {
        setFoodDateShow(false);
        const currentDate = selectedDate || date;
        setFoodDate(currentDate);
        let tempDate = new Date(currentDate);
        //Convert date to a readable format
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        setFoodDateText(fDate);
    }

    const [foodStartTime, setFoodStartTime] = useState(new Date());
    const [foodStartTimeShow, setFoodStartTimeShow] = useState(false);
    const [foodStartTimeText, setFoodStartTimeText] = useState('hh:mm');

    const onfoodStartTimeChange = (event, selectedDate) => {
        setFoodStartTimeShow(false);
        const currentDate = selectedDate || date;
        setFoodStartTime(currentDate);
        let tempDate = new Date(currentDate);
        //Convert date to a readable format
        let fDate = tempDate.getHours() + ':' + String(tempDate.getMinutes()).padStart(2, '0');
        setFoodStartTimeText(fDate);
    }


    const [activityType, setActivityType] = useState('Dietary Intake');
    const [foodType, setFoodType] = useState('');
    

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
                            defaultValueByIndex={1}
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
                                if (selectedItem === 'Dietary Intake') {
                                    setActivityType(selectedItem)
                                } else {
                                    navigation.push('ActivityLoggerExercise')
                                }
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                            rowTextForSelection={(item, index) => item}
                            rowStyle={{ backgroundColor: colours.background }}
                            rowTextStyle={Style.dropdownText}
                            defaultValue={activityType}
                        />
                    </View>
                </View>

                    <View>
                        {/*Food Type Field */}
                        <View>
                            <Text style={[Style.email, { marginTop: 18 }]}>Type of Food</Text>

                            <View style={Style.profileDropdownContainer}>
                                <SelectDropdown
                                    data={foodTypes}
                                    defaultButtonText={'Select food type'}
                                    buttonStyle={styles.selection}
                                    buttonTextStyle={Style.dropdownText}
                                    renderDropdownIcon={() => <Entypo
                                        name="chevron-small-down"
                                        size={24}
                                        color={colours.text}

                                    />}
                                    dropdownIconPosition="right"
                                    onSelect={(selectedItem, index) => {
                                        setFoodType(selectedItem)
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                    rowTextForSelection={(item, index) => item}
                                    rowStyle={{ backgroundColor: colours.background }}
                                    rowTextStyle={Style.dropdownText}
                                />
                            </View>
                        </View>

                        
                        <View style={{ flexDirection: 'row' }}>
                            {/* Portion Field */}
                            <View style={{ flex: 1 }}>
                                <Text style={[Style.email, { marginTop: 18 }]}>Portion Size</Text>

                                <View style = {Style.rect}>
                                    <TextInput
                                        style={[Style.sampleEmail]}
                                        keyboardType='number-pad'
                                        placeholder="0"
                                        placeholderTextColor={colours.text}
                                        value={portionValue}
                                        onChangeText={(portionValue) => setPortionValue(portionValue.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''))}
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        
                                    />
                                </View>
                            </View>
                            
                            <View style={{ flex: 1 }}>
                                <Text style={[Style.email, { marginTop: 18 }]}> 
                                    Unit of measurement
                                </Text>
                                <View style={Style.profileDropdownContainer}>
                                    <SelectDropdown
                                        data={units}
                                        defaultButtonText={'Select unit'}
                                        buttonStyle={styles.selection}
                                        buttonTextStyle={Style.dropdownText}
                                        renderDropdownIcon={() => <Entypo
                                            name="chevron-small-down"
                                            size={24}
                                            color={colours.text}

                                        />}
                                        dropdownIconPosition="right"
                                        onSelect={(selectedItem, index) => {
                                            setFoodType(selectedItem)
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                        rowTextForSelection={(item, index) => item}
                                        rowStyle={{ backgroundColor: colours.background }}
                                        rowTextStyle={Style.dropdownText}
                                    />
                                </View>
                            </View>
                        </View>



                        {/*Date of Food intake Field */}
                        <View>
                            <Text style={[Style.email, { marginTop: 13 }]}>Date of dietary intake</Text>

                            {/* Date of Food intake Rectangle */}
                            <View style={Style.rect}>
                                <Text
                                    onPress={() => setFoodDateShow(true)}
                                    style={Style.sampleEmail}>
                                    {foodDateText}
                                </Text>
                            </View>

                            {foodDateShow && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={foodDate}
                                    display='default'
                                    onChange={onFoodDateChange}
                                />)}
                        </View>

                        {/*Food Start Time Field */}
                        <View>
                            <Text style={[Style.email, { marginTop: 13 }]}>Dietary Intake Start Time</Text>

                            {/* Date of Food Rectangle */}
                            <View style={Style.rect}>
                                <Text
                                    onPress={() => setFoodStartTimeShow(true)}
                                    style={Style.sampleEmail}>
                                    {foodStartTimeText}
                                </Text>
                            </View>

                            {foodStartTimeShow && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={foodStartTime}
                                    display='default'
                                    mode='time'
                                    onChange={onfoodStartTimeChange}
                                />)}
                        </View>

                        
                        {/* Save Activity button */}
                        <View style={[Style.loginOrSignUpButton, { marginVertical: 100 }]}>
                            <Button
                                title='Add Activity'
                            />
                        </View>
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
