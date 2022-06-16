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
import {values, exercises} from '../assets/activities';




let customFonts = {
    'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
    'RobotoRegular': require("../assets/fonts/Roboto-Regular.ttf"),
    'MontserratBold': require("../assets/fonts/Montserrat-Bold.ttf"),
};

export default ActivityLoggerExercise = ({navigation}) => {

    state = {
        fontsLoaded: false
    }
    const [appIsReady, setAppIsReady] = useState(false);
    const mounted = useRef(false);
    const [counter, setCounter] = useState(0);
    //const [googleAuth, setGoogleAuth] = useState(false);
    const [weight,setWeight] = useState(0.0)
    const [loading, setLoading] = useState(false);  

    const activities = ['Exercise', 'Dietary Intake'];
    const exercies = exercises;


   
     const computeCal = (weight, duration, value) =>{
    
        value = Math.floor(value);
        
        //duration in minutes
        duration = Math.floor(duration);
        //get weight in kg and convert to pounds
        weight = Math.floor(weight * 2.20462);
        const tmpCalories = value.toFixed(2);
        const tmpTotal = Math.abs(tmpCalories* (weight/2.2)* (duration/60)).toFixed(0);
        return tmpTotal;
    
    };

   

    
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
        let fDate = String(tempDate.getHours()).padStart(2, '0') + ':' + String(tempDate.getMinutes()).padStart(2, '0');
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
        let fDate = String(tempDate.getHours()).padStart(2, '0') + ':' + String(tempDate.getMinutes()).padStart(2, '0');
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

        async function getListValue() {
            try {
                setLoading(true);
                const user = supabase.auth.user();
                if (!user) throw new Error("No user on the session!");
                

                const { data, error, count } = await supabase
                .from('ActivityLoggerExercise')
                .select('*', {count: 'exact' })
                .eq("id", user.id)
                setCounter(count+1)

           
            }

     
            catch (error) {
                console.log('error')
            }

           

            finally {
                setLoading(false)
            }

        }
        
        async function getWeight() {
            try {
                setLoading(true);
                const user = supabase.auth.user();
                if (!user) throw new Error("No user on the session!");
                

                const { data, error } = await supabase
                .from('profiles')
                .select('weight')
                .eq("id", user.id)
                .single();
                setWeight(data['weight'])
                
           
            }

     
            catch (error) {
                console.log('error')
            }

           

            finally {
                setLoading(false)
            }

        }
       

        // const options = {
        //     scopes: [
        //         Scopes.FITNESS_ACTIVITY_READ,
        //         Scopes.FITNESS_ACTIVITY_WRITE,
        //         Scopes.FITNESS_BODY_READ,
        //         Scopes.FITNESS_BODY_WRITE,
        //         Scopes.FITNESS_LOCATION_READ,
        //     ],

        // };

        // GoogleFit.authorize(options)
        //     .then(authResult => {
        //         if (authResult.success) {
        //             console.log('AUTH_SUCCESS');
        //             setGoogleAuth(true);
        //         } else {
        //             console.log("AUTH_DENIED", authResult);
        //         }
        //     })
        //     .catch(() => {
        //         console.log("AUTH_ERROR")
        //     });

        // // Call when authorized
        //GoogleFit.startRecording((callback)=>{
        //     // Process data from Google Fit Recording API (no google fit app needed)

        //})


        prepare();
        getListValue();
        getWeight();

        return () => { mounted.current = false; };
    }, []);

    function diff(start, end) {
        start = start.split(":");
        end = end.split(":");
        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = endDate.getTime() - startDate.getTime();
        var hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        var minutes = Math.floor(diff / 1000 / 60);
    
        // If using time pickers with 24 hours format, add the below line get exact hours
        if (hours < 0)
           hours = hours + 24;
    
      return minutes + hours * 60 
    }

    async function addActivity() {
        let success = false;
        try {
            setLoading(true);

            const user = supabase.auth.user();
            if (!user) throw new Error("No user on the session!");


            //calculate duration in minutes
            let duration = diff(exerciseStartTimeText, exerciseEndTimeText);
            let exerciseNumber = values[exerciseType];
            let recommendedCalories = computeCal(weight, duration, exerciseNumber);
            

            if (!exerciseType) {
                throw new Error("Enter the type of exercise")
            }
            
            if (!caloriesAmount) {
                throw new Error("Enter the calories amount!")
            }

            if (caloriesAmount > 1.25 * recommendedCalories) {
                throw new Error("The value of calories is too high")
            }

            const updates = {
                id : user.id,
                listValue : counter,
                exerciseType,
                date : exerciseDate.toISOString(),
                startTime: exerciseStartTimeText,
                endTime: exerciseEndTimeText,
                caloriesAmount: parseInt(caloriesAmount)
            };

            

            const { data, error } = await supabase
                .from('ActivityLoggerExercise')
                .upsert(updates);

        

            //console.log(data)
            //console.log(error)

   
            if (data) {
                Alert.alert('Activity successfully added')
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
                            data={activities}
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
                                    data={exercies}
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
                                onPress = {()=> addActivity()}
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
        marginTop: 19,
        marginLeft : 27


    },

    selection: {
        backgroundColor: colours.tab,
        marginTop: 6,
        borderRadius: 14,
        height: 45,
        width: '100%'
    },

});
