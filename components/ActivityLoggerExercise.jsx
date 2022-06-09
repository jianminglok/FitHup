import { supabase } from '../lib/supabase'
import React, { useState, useCallback, useEffect, useRef } from "react"
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import colours from "../assets/colours/colours";
import { Alert, StyleSheet, StatusBar, Image, Text, View, TouchableOpacity, ScrollView, TextInput, Touchable } from "react-native"
import TopBar from './TopBar';
import { Dimensions } from "react-native";
import Style from './Style';
import Card from './Card';
import Button from "./Button";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { ApiError, Session } from "@supabase/supabase-js";
import SelectDropdown from "react-native-select-dropdown";
import Entypo from "react-native-vector-icons/Entypo";



let customFonts = {
    'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
    'RobotoRegular': require("../assets/fonts/Roboto-Regular.ttf"),
    'MontserratBold': require("../assets/fonts/Montserrat-Bold.ttf"),
};

export default function SetupProfile() {

    const [loading, setLoading] = useState(false);
    const mounted = useRef(false);
    const activities = ['Exercise', 'Food'];
    const exercies = ['Running', 'Swimming'];

    const [date, setDate] = useState(new Date());
    const [mode,setMode] = useState('date')  
    const [show, setShow] = useState(false);
    const [text, setText] = useState('DD/MM/YYYY');
    const [startTime,setStartTime] = useState('Start Time');
    const [endTime,setEndTime] = useState('End Time');
    const[time, setTime] =useState('start');


    const [caloriesAmount, setCaloriesAmount] = useState('')


    const onChange = (event, selectedDate) => {
        setShow(false);
        const currentDate = selectedDate || date;
        setDate(currentDate);
        let tempDate = new Date(currentDate);
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        let fStart = tempDate.getHours() + ':' + tempDate.getMinutes();
        setText(fDate); 
        setStartTime(fStart);
        
          
      }

    const onChangeEnd = (event, selectedDate) => {
        setShow(false);
        const currentDate = selectedDate || date;
        setDate(currentDate);
        let tempDate = new Date(currentDate);
        let fEnd = tempDate.getHours() + ':' + tempDate.getMinutes();
        setEndTime(fEnd);
        

        


    }

    const showMode = (currentMode, startOrEnd) => {
        setShow(true);
        setMode(currentMode);
        setTime(startOrEnd)
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

        prepare();

        return () => { mounted.current = false; };
    }, []);

    async function addActivity() {
        let success = false;
        try {
            setLoading(true);

            const user = supabase.auth.user();
            //console.log(user)
            if (!user) throw new Error("No user on the session!");

            // const updates = {
            //     id : user.id,
            //     //exerciseNumber : 1
            //     exerciseType,
            //     date : date.toISOString(),
            //     startTime,
            //     endTime,
            //     caloriesAmount: parseInt(caloriesAmount)
            // };

            // console.log(updates)

            
            // const { data, error } = await supabase
            //     .from('ActivityLoggerExercise')
            //     .insert([
            //         { exerciseType: 'someValue'},
            // ]);

            let { data: ActivityLoggerExercise, error } = await supabase
            .from('ActivityLoggerExercise')
            .select('id')

            console.log(data)

            

            console.log(typeof 'sd')

           

            if (data) {
                Alert.alert('Activity successfully added')
                success = true;    
            }


            if (error) {
                throw error;
            }
            console.log(error)

        } catch (error) {
            
            console.log('hi')
            
        } finally {
            setLoading(false);
            if (success) {
                console.log('success')
            }

        }
    }




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
                    >{text}</Text>
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
            <View style={[Style.loginOrSignUpButton, {marginTop: 31}]}>
                <Button 
                    title={"Add activity"} 
                    onPress={()=> addActivity()}
            />
            </View>





        </View>

    )

}

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