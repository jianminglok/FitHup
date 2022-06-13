import { supabase } from '../lib/supabase'
import React, { useState, useEffect, useRef } from "react"
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import colours from "../assets/colours/colours";
import { Alert, StyleSheet, Text, View, TextInput, } from "react-native"
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
    const activities = ['Exercise', 'Food'];
    const exercies = exercises;
    const [date, setDate] = useState(new Date());
    const [mode,setMode] = useState('date')  
    const [show, setShow] = useState(false);
    const [text, setText] = useState('DD/MM/YYYY');
    const [startTime,setStartTime] = useState('Start Time');
    const [endTime,setEndTime] = useState('End Time');
    const[time, setTime] =useState('start');
    const [caloriesAmount, setCaloriesAmount] = useState('')
    const [minDiff, setMinDiff] = useState();
    const [hourDiff, setHourDiff] = useState();

   const onChange = (event, selectedDate) => {
        setShow(false);
        const currentDate = selectedDate || date;
        setDate(currentDate);
        let tempDate = new Date(currentDate);
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        let fStart = tempDate.getHours() + ':' + tempDate.getMinutes();
        setMinDiff(-1 * tempDate.getMinutes());
        setHourDiff(-1 * tempDate.getHours());
        setText(fDate); 
        setStartTime(fStart);
        
          
      }

    const onChangeEnd = (event, selectedDate) => {
        setShow(false);
        const currentDate = selectedDate || date;
        setDate(currentDate);
        let tempDate = new Date(currentDate);
        let fEnd = tempDate.getHours() + ':' + tempDate.getMinutes();
        setMinDiff(minDiff + tempDate.getMinutes());
        setHourDiff(hourDiff + tempDate.getHours());
        setEndTime(fEnd);
        
    }

    const showMode = (currentMode, startOrEnd) => {
        setShow(true);
        setMode(currentMode);
        setTime(startOrEnd)
    };

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

    const [activity, setActivity] = useState();
    const [exerciseType, setExerciseType] = useState();

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

    async function addActivity() {
        let success = false;
        try {
            setLoading(true);

            const user = supabase.auth.user();
            if (!user) throw new Error("No user on the session!");

            let duration = minDiff + hourDiff * 60;
            let exerciseNumber = values[exerciseType];

            let recommendedCalories = computeCal(weight, duration, exerciseNumber);
            console.log(recommendedCalories);

            if (!exerciseType) {
                throw new Error("Enter the type of exercise")
            }


            if (caloriesAmount > 1.25 * recommendedCalories) {
                throw new Error("The value of calories is too high")
            }

            const updates = {
                id : user.id,
                listValue : counter,
                exerciseType,
                date : date.toISOString(),
                startTime,
                endTime,
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
    



    return (
        <View style = {Style.profileContainer}>
            <TopBar/>
            <Text style = {styles.header}>
                Activity Logger
            </Text>

            {/*Type of Activity Field */}
            <View>
                <Text style={[Style.email,{marginTop: 5}]}>Type of Activity</Text>

                {/* Type of Activity Rectangle */}
                <View >
                    <SelectDropdown 
                        data = {activities}
                        defaultValueByIndex = {0}
                        buttonStyle = {styles.selection}
                        buttonTextStyle = {Style.sampleEmail}
                        renderDropdownIcon = {() => <Entypo 
                            name = "chevron-small-down"
                            size ={24}
                            color={colours.text}
                            
                            />}
                        dropdownIconPosition = "right"
                        onSelect={(selectedItem, index) => {
                            setActivity(selectedItem)
                        }}
                        
                        rowStyle = {{backgroundColor:colours.background}}
                        rowTextStyle = {{color: colours.text}}
                    />


                </View>
            </View>

            {/*Type of Exercise Field */}
            <View>
                <Text style={[Style.email,{marginTop: 15}]}>Type of Exercise</Text>

                {/* Type of Exercise Rectangle */}
                <View>
                    <SelectDropdown 
                        data = {exercies}
                        buttonStyle = {styles.selection}
                        buttonTextStyle = {Style.sampleEmail}
                        renderDropdownIcon = {() => <Entypo 
                            name = "chevron-small-down"
                            size ={24}
                            color={colours.text}
                            
                            />}
                        dropdownIconPosition = "right"
                        onSelect={(selectedItem, index) => {
                            setExerciseType(selectedItem)
                        }}
                        
                        rowStyle = {{backgroundColor:colours.background}}
                        rowTextStyle = {{color: colours.text}}
                    />

                </View>
            </View>

            {/*DOE Field */}
            <View>
                <Text style={[Style.email, {marginTop: 13}]}>Date of Exercise</Text>

                {/* DOE Rectangle */}
                <View style={Style.rect}>
                    <Text
                        onPress= {() => showMode('date')}
                        style={Style.sampleEmail}
                    >{text}
                    </Text>
                </View>

            </View>

            {/*start time Field */}
            <View>
                <Text style={[Style.email, {marginTop: 13}]}>Exercise Start Time</Text>

                {/* start time Rectangle */}
                <View style={Style.rect}>
                    <Text
                        onPress= {() => showMode('time','start')}
                        style={Style.sampleEmail}
                    >{startTime}</Text>
                </View>

            </View>

            {/*end time Field */}
            <View>
                <Text style={[Style.email, {marginTop: 13}]}>Exercise End Time</Text>

                {/* end time Rectangle */}
                <View style={Style.rect}>
                    <Text
                        onPress= {() => showMode('time', 'end')}
                        style={Style.sampleEmail}
                    >{endTime}</Text>
                </View>

            </View>

            {show &&(
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode = {mode}
                    is24Hour = {true}
                    display = 'default'
                    onChange={time==='start'? onChange : onChangeEnd}
                    
            />)}

            {/*Calories Field */}
            <View>
                <Text style={[Style.email, {marginTop:13}]}>Amount of Calories Burnt</Text>

                {/* Calories Rectangle */}
                <View style={Style.rect}>
                    <TextInput
                        style={Style.sampleEmail}
                        placeholder="Enter a number"
                        placeholderTextColor={colours.text}
                        onChangeText={setCaloriesAmount}
                        
                    />
                </View>


            </View>

            {/* Save Profile button */}
            <View style={[Style.loginOrSignUpButton, {marginTop: 20}]}>
                <Button 
                    title={"Add activity"} 
                    onPress={()=> addActivity()}
                    //onPress={()=> fetchData()}

            />
            </View>

        </View>

    )

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
        marginTop : 6,
        borderRadius: 14,
        marginHorizontal: 27,
        height : 45,


    }




})