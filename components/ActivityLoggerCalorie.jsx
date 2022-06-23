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
import { CALORIE_APININJA } from '@env';
import SelectDropdown from "react-native-select-dropdown";
import Entypo from "react-native-vector-icons/Entypo";
import foodUnits from '../assets/foodUnits';

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
    const [counter, setCounter] = useState(0);
    //const [googleAuth, setGoogleAuth] = useState(false);
    const [weight, setWeight] = useState(0.0)
    const [loading, setLoading] = useState(false);

    const [dietDate, setDietDate] = useState(new Date());
    const [dietDateShow, setDietDateShow] = useState(false);
    const [dietDateText, setDietDateText] = useState('DD/MM/YYYY');

    const onDietDateChange = (event, selectedDate) => {
        setDietDateShow(false);
        const currentDate = selectedDate || date;
        setDietDate(currentDate);
        let tempDate = new Date(currentDate);
        //Convert date to a readable format
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        setDietDateText(fDate);
    }

    const [dietTime, setDietTime] = useState(new Date());
    const [dietTimeShow, setDietTimeShow] = useState(false);
    const [dietTimeText, setDietTimeText] = useState('hh:mm');

    const onDietTimeChange = (event, selectedDate) => {
        setDietTimeShow(false);
        const currentDate = selectedDate || date;
        setDietTime(currentDate);
        let tempDate = new Date(currentDate);
        //Convert date to a readable format
        let fDate = String(tempDate.getHours()).padStart(2, '0') + ':' + String(tempDate.getMinutes()).padStart(2, '0');
        setDietTimeText(fDate);
    }

    const [foodType, setFoodType] = useState('');
    const [portionSize, setPortionSize] = useState('');

    const activityTypes = ['Exercise', 'Dietary Intake']
    const units = foodUnits;
    const [portionValue, setPortionValue] = useState('');
    const [unit, setUnit] = useState('');

    const [activityType, setActivityType] = useState('Dietary Intake');

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

        async function getListValue() {
            try {
                setLoading(true);
                const user = supabase.auth.user();
                if (!user) throw new Error("No user on the session!");

                const { data, error, count } = await supabase
                    .from('ActivityLoggerCalorie')
                    .select('*', { count: 'exact' })
                    .eq("id", user.id)
                setCounter(count + 1)
            } catch (error) {
                console.log('error')
            } finally {
                setLoading(false)
            }
        }

        prepare();
        getListValue();

        return () => { mounted.current = false; };
    }, []);

    async function addActivity() {
        let success = false;
        try {
            setLoading(true);

            const user = supabase.auth.user();
            if (!user) throw new Error("No user on the session!");

            if (!foodType) {
                throw new Error("Please enter the type of food!")
            } else if (!portionValue) {
                throw new Error("Please enter the portion value!")
            } else if (!unit) {
                throw new Error("Please enter the unit value!")
            }

            const response = await fetch(
                'https://api.api-ninjas.com/v1/nutrition?query=' + portionValue + unit + ' ' + foodType, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': CALORIE_APININJA
                },
            }
            );

            const json = await response.json();

            if (!json) {
                throw new Error("Error determining amount of calories!")
            }

            const updates = {
                id: user.id,
                listValue: counter,
                foodType : foodType.charAt(0).toUpperCase() + foodType.toLowerCase().slice(1),
                date: dietDate.toISOString(),
                time: dietTimeText,
                caloriesAmount: json[0]['calories'],
                portionValue,
                unit,
            };

            //console.log(data)
            //console.log(error)

            const { data, error } = await supabase
                .from('ActivityLoggerCalorie')
                .upsert(updates);

            if (data) {
                Alert.alert('Dietary activity successfully added')
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

    // let opt = {
    //     startDate: "2017-01-01T00:00:17.971Z",
    //     endDate: new Date().toISOString(),
    //     //bucketUnit: BucketUnit.DAY,
    //     bucketInterval: 1,
    // };

    // async function fetchData() {
    //     const res = await GoogleFit.getActivitySamples(opt)
    //     console.log(res);

    // };

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

                {/*Type of Food Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 18 }]}>Type of Food</Text>

                    {/*Type of Food Rectangle */}
                    <View style={Style.rect}>
                        <TextInput
                            autoCapitalize = {'none'}
                            style={[Style.sampleEmail]}
                            placeholder="Enter type of food"
                            placeholderTextColor={colours.text}
                            value={foodType}
                            onChangeText={setFoodType}
                            returnKeyType="next"
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    {/* Portion Field */}
                    <View style={{ flex: 1 }}>
                        <Text style={[Style.email, { marginTop: 18 }]}>Portion Size</Text>

                        <View style={Style.rect}>
                            <TextInput
                                style={[Style.sampleEmail]}
                                keyboardType='number-pad'
                                placeholder="0"
                                placeholderTextColor={colours.text}
                                value={portionValue}
                                onChangeText={(portionValue) => setPortionValue(portionValue.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''))}
                                autoCapitalize={'characters'}
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
                                    setUnit(selectedItem)
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                rowTextForSelection={(item, index) => item}
                                rowStyle={{ backgroundColor: colours.background }}
                                rowTextStyle={Style.dropdownText}
                            />
                        </View>
                    </View>
                </View>

                {/*Date of Dietary Intake Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 13 }]}>Date of dietary intake</Text>

                    {/* Date of Dietary Intake Rectangle */}
                    <View style={Style.rect}>
                        <Text
                            onPress={() => setDietDateShow(true)}
                            style={Style.sampleEmail}>
                            {dietDateText}
                        </Text>
                    </View>

                    {dietDateShow && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={dietDate}
                            display='default'
                            onChange={onDietDateChange}
                        />)}
                </View>

                {/*Dietary Intake Time Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 13 }]}>Dietary Intake Time</Text>

                    {/* Dietary Intake Tme Rectangle */}
                    <View style={Style.rect}>
                        <Text
                            onPress={() => setDietTimeShow(true)}
                            style={Style.sampleEmail}>
                            {dietTimeText}
                        </Text>
                    </View>

                    {dietTimeShow && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={dietTime}
                            display='default'
                            mode='time'
                            onChange={onDietTimeChange}
                        />)}
                </View>

                {/* Save Activity button */}
                <View style={[Style.loginOrSignUpButton, { marginVertical: 20 }]}>
                    <Button
                        title='Save Activity'
                        onPress={() => addActivity()}
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
