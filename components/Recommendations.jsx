import { supabase } from '../lib/supabase'
import React, { useState, useCallback, useEffect, useRef } from "react"
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import colours from "../assets/colours/colours";
import { StyleSheet, StatusBar, Text, View, TouchableOpacity, Button, ScrollView, ActivityIndicator } from "react-native"
import TopBar from './TopBar';
import Style from './Style';
import Card from './Card';
import { useDispatch, useSelector } from 'react-redux';
import disc from '@jsamr/counter-style/presets/disc';
import MarkedList from '@jsamr/react-native-li';

let customFonts = {
    'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
    'RobotoRegular': require("../assets/fonts/Roboto-Regular.ttf"),
    'MontserratBold': require("../assets/fonts/Montserrat-Bold.ttf"),
};

export default function Recommendations({ navigation }) {
    const user = supabase.auth.user();
    const [appIsReady, setAppIsReady] = useState(false);
    const mounted = useRef(false);
    const [loading, setLoading] = useState(false);
    const [calorieIntakeData, setCalorieIntakeData] = useState('');
    const [calorieIntakeTotal, setCalorieIntakeTotal] = useState();
    const [target, setTarget] = useState();
    const [caloriesIntakeAmount, setCaloriesIntakeAmount] = useState('');
    const [recommendedCaloriesIntakeAmount, setRecommendedCaloriesIntakeAmount] = useState('');
    const [caloriesBurntAmount, setCaloriesBurntAmount] = useState('');

    const [exerciseData, setExerciseData] = useState('');
    const [exerciseTotal, setExerciseTotal] = useState();

    const [weeklyExercise, setWeeklyExercise] = useState();
    const [weeklyFood, setWeeklyFood] = useState();

    const dispatch = useDispatch();
    const { BMI, lifestyleType } = useSelector((state) => state.profile);

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

        async function getTarget() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                const { data, error } = await supabase
                    .from('target')
                    .select('targetType, caloriesIntakeAmount, caloriesBurntAmount, recommendedCaloriesIntakeAmount')
                    .eq('id', user.id)

                if (data) {
                    if (data.length !== 0) {
                        setTarget(data[0].targetType)
                        setCaloriesIntakeAmount(data[0].caloriesIntakeAmount)
                        setCaloriesBurntAmount(data[0].caloriesBurntAmount)
                        setRecommendedCaloriesIntakeAmount(data[0].recommendedCaloriesIntakeAmount)
                    }
                } else if (error) {
                    throw error;
                }
            }
            catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }

        async function getDietaryIntake() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                let today = new Date();
                today.setTime(today.getTime() + 8 * 60 * 60 * 1000)
                today.setUTCHours(0, 0, 0, 0);
                let tmr = new Date();
                tmr.setTime(today.getTime());
                tmr.setDate(today.getDate() + 1);

                let caloriesAmount = 0;

                const { data, error } = await supabase
                    .from('ActivityLoggerCalorie')
                    .select(`caloriesAmount`)
                    .eq("id", user.id)
                    .gte('date', today.toISOString())
                    .lt('date', tmr.toISOString())

                if (data) {
                    let promise = new Promise(function (resolve, reject) {
                        resolve(data);
                    })

                    setCalorieIntakeData(data);
                    if (data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            caloriesAmount += data[i].caloriesAmount
                        }
                        setCalorieIntakeTotal(caloriesAmount.toFixed(2));
                    }
                } else if (error) {
                    throw error;
                }
            }
            catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }

        async function getWeeklyDietaryIntake() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                let today = new Date();
                today.setTime(today.getTime() + 8 * 60 * 60 * 1000)
                today.setUTCHours(0, 0, 0, 0);
                today.setDate(today.getDate() + 1)
                let weekBefore = new Date();
                weekBefore.setTime(today.getTime());
                weekBefore.setDate(today.getDate() - 7);

                const { data, error } = await supabase
                    .from('ActivityLoggerCalorie')
                    .select(`caloriesAmount, date`)
                    .gte('date', weekBefore.toISOString())
                    .lt('date', today.toISOString())
                    .eq('id', user.id)

                if (data) {
                    let arr = [1, 2, 3, 4, 5, 6, 7];
                    const dict = {};
                    for (let i = 0; i < arr.length; i++) {
                        if (i > 0) {
                            arr[i] = new Date();
                            arr[i].setTime(weekBefore.getTime());
                            arr[i].setDate(weekBefore.getDate() + i);
                            arr[i] = arr[i].toISOString().slice(0, 10)
                        }
                        if (i === 0) {
                            arr[i] = weekBefore.toISOString().slice(0, 10);
                        }
                        dict[arr[i]] = 0;

                    }


                    for (let i = 0; i < data.length; i++) {
                        const date = data[i]['date'];
                        dict[date] += parseInt(data[i]['caloriesAmount'])
                    }

                    //convert dict to arr
                    const foodChartData = Object.values(dict)

                    //get weekly value
                    let total = 0;
                    for (let i = 0; i < foodChartData.length; i++) {
                        total += foodChartData[i];
                    }

                    setWeeklyFood(total);
                } else if (error) {
                    throw error;
                }
            }
            catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }

        async function getExercise() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                let today = new Date();
                today.setTime(today.getTime() + 8 * 60 * 60 * 1000)
                today.setUTCHours(0, 0, 0, 0);
                let tmr = new Date();
                tmr.setTime(today.getTime());
                tmr.setDate(today.getDate() + 1);

                let caloriesOutputAmount = 0;

                const { data, error } = await supabase
                    .from('ActivityLoggerExercise')
                    .select(`caloriesAmount`)
                    .eq("id", user.id)
                    .gte('date', today.toISOString())
                    .lt('date', tmr.toISOString())

                if (data) {
                    let promise = new Promise(function (resolve, reject) {
                        resolve(data);
                    })

                    setExerciseData(data);
                    if (data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            caloriesOutputAmount += data[i].caloriesAmount
                        }
                        setExerciseTotal(parseFloat(caloriesOutputAmount).toFixed(2));
                    }
                } else if (error) {
                    throw error;
                }
            }
            catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }

        async function getWeeklyExercise() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                let today = new Date();
                today.setTime(today.getTime() + 8 * 60 * 60 * 1000)
                today.setUTCHours(0, 0, 0, 0);
                today.setDate(today.getDate() + 1)
                let weekBefore = new Date();
                weekBefore.setTime(today.getTime());
                weekBefore.setDate(today.getDate() - 7);

                const { data, error } = await supabase
                    .from('ActivityLoggerExercise')
                    .select(`caloriesAmount, date`)
                    .gte('date', weekBefore.toISOString())
                    .lt('date', today.toISOString())
                    .eq('id', user.id)

                if (data) {
                    let arr = [1, 2, 3, 4, 5, 6, 7];
                    const dict = {};
                    for (let i = 0; i < arr.length; i++) {
                        if (i > 0) {
                            arr[i] = new Date();
                            arr[i].setTime(weekBefore.getTime());
                            arr[i].setDate(weekBefore.getDate() + i);
                            arr[i] = arr[i].toISOString().slice(0, 10)
                        }
                        if (i === 0) {
                            arr[i] = weekBefore.toISOString().slice(0, 10);
                        }
                        dict[arr[i]] = 0;
                    }

                    for (let i = 0; i < data.length; i++) {
                        const date = data[i]['date'];
                        dict[date] += parseInt(data[i]['caloriesAmount'])
                    }

                    //convert dict to arr
                    const exerciseChartData = Object.values(dict)

                    //get weekly value
                    let total = 0;
                    for (let i = 0; i < exerciseChartData.length; i++) {
                        total += exerciseChartData[i];
                    }

                    setWeeklyExercise(total);
                } else if (error) {
                    throw error;
                }
            }
            catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }

        prepare();

        if (mounted.current != false) {
            getTarget();
            getDietaryIntake();
            getExercise();
            getWeeklyExercise();
            getWeeklyDietaryIntake();
        }

        //Subscribe to real time changes to list of food performed
        const exerciseSubscription = supabase
            .from('ActivityLoggerExercise')
            .on('*', () => getExercise())
            .subscribe()

        //Subscribe to real time changes to list of food performed
        const foodSubscription = supabase
            .from('ActivityLoggerCalorie')
            .on('*', () => getDietaryIntake())
            .subscribe()

        return () => {
            mounted.current = false;
            supabase.removeSubscription(exerciseSubscription);
            supabase.removeSubscription(foodSubscription);
        };
    }, [user]);

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
        <View style={Style.homepageContainer} onLayout={onLayoutRootView}>
            <StatusBar />
            <TopBar testID="recommendationBar" navigation={navigation} />
            <Text testID='title' style={[styles.header, { alignSelf: 'flex-start' }]}>
                Recommendations
            </Text>

            <ScrollView testID='recommendationContainer' style={[Style.homepageScrollview, { marginTop: 19 }]}>
                <Card cardTitle="General Recommendations" titleSize={20} style={{ marginBottom: 19 }}>
                    <View style={{ marginTop: 5, marginRight: 19 }}>
                        <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationDetails} >
                            <Text style={[styles.recommendationDetails]}>
                                You current BMI is {BMI.toFixed(2)}, which indicates that you are {BMI > 18.5 && BMI < 24.9 ? 'healthy' : BMI < 18.5 ? 'underweight. You should try gaining some weight' : 'overweight. You should try losing some weight'}.
                            </Text>
                            <Text style={[styles.recommendationDetails]}>
                                You have a {lifestyleType} lifestyle. {lifestyleType == 'Sedentary' || lifestyleType == 'Lightly Active' ? 'Do consider having a more active lifestyle!' : 'Do keep being active!'}
                            </Text>
                        </MarkedList>
                    </View>
                </Card>

                <Card cardTitle="Dietary Recommendations" titleSize={20} style={{ marginBottom: 19 }}>
                    <View style={{ marginTop: 5, marginRight: 19 }}>
                        <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationDetails} >
                            <Text style={[styles.recommendationDetails]}>
                                {calorieIntakeData.length > 0
                                    ? "Your current calorie intake amount is " + calorieIntakeTotal + ' cal. You are ' + Math.abs(caloriesIntakeAmount - calorieIntakeTotal).toFixed(2) + ' cal away from your target.'
                                    : "You haven't recorded any dietary activity yet today. Please do make good use of our app to note them down."
                                }
                            </Text>
                        </MarkedList>
                        {Math.abs(caloriesIntakeAmount - recommendedCaloriesIntakeAmount) > 0
                            ? <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationDetails} >
                                <Text style={[styles.recommendationDetails]}>
                                    {'You calorie intake target is '
                                        + Math.round(100 * 100 * Math.abs((caloriesIntakeAmount - recommendedCaloriesIntakeAmount) / ((caloriesIntakeAmount + recommendedCaloriesIntakeAmount) / 2))) / 100 + '%'
                                        + ((caloriesIntakeAmount - recommendedCaloriesIntakeAmount) > 0 ? 'higher' : ' lower')
                                        + ' than the recommended target. You may want to set a target closed to the recommended value.'}
                                </Text>
                            </MarkedList>
                            : <View></View>
                        }
                        {(weeklyFood / (caloriesIntakeAmount * 7)) < 0.5 || (weeklyFood / (caloriesIntakeAmount * 7)) > 1.5
                            ? <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationDetails} >
                                <Text style={[styles.recommendationDetails]}>
                                    {(weeklyFood / (caloriesIntakeAmount * 7)) < 0.5
                                        ? "It appears that you haven't been reaching your daily calorie intake target most of the week."
                                        : (weeklyFood / (caloriesIntakeAmount * 7)) > 1.5
                                            ? "It appears that you have been taking in more calories than your target most of the week."
                                            : ""
                                    }
                                </Text>
                            </MarkedList>
                            : <View></View>
                        }
                    </View>
                </Card>

                <Card cardTitle="Exercise Recommendations" titleSize={20} style={{ marginBottom: 19 }}>
                    <View style={{ marginTop: 5, marginRight: 19 }}>
                        <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationDetails} >
                            <Text style={[styles.recommendationDetails]}>
                                {exerciseData.length > 0
                                    ? "Your current calorie output amount is " + exerciseTotal + ' cal. You are ' + Math.abs(caloriesBurntAmount - exerciseTotal).toFixed(2) + ' cal away from your target.'
                                    : "You haven't recorded any exercise activity yet today. Please do make good use of our app to note them down."
                                }
                            </Text>
                        </MarkedList>
                        {(weeklyExercise / (caloriesBurntAmount * 7)) < 0.5 || (weeklyExercise / (caloriesBurntAmount * 7)) > 1.5
                            ? <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationDetails} >
                                <Text style={[styles.recommendationDetails]}>
                                    {(weeklyExercise / (caloriesBurntAmount * 7)) < 0.25
                                        ? "It appears that you haven't been reaching your daily target most of the week. Do consider working harder."
                                        : (weeklyExercise / (caloriesBurntAmount * 7)) < 0.5
                                            ? "You're making good progress, just work slightly harder to reach your target"
                                            : (weeklyExercise / (caloriesBurntAmount * 7)) > 1.5
                                                ? "Good work for exercising way more than your target but do remember not to push your limits too hard!"
                                                : ''
                                    }
                                </Text>
                            </MarkedList>
                            : <View></View>
                        }
                    </View>
                </Card>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        color: colours.text,
        fontFamily: "MontserratBold",
        fontSize: 24,
        marginLeft: 27
    },

    recommendationTitle: {
        fontSize: 18,
        fontFamily: "MontserratBold",
        fontWeight: "700",
        color: colours.text,
        flexShrink: 1
    },

    recommendationDetails: {
        fontSize: 18,
        fontWeight: "500",
        color: colours.text,
        flexShrink: 1
    },
})