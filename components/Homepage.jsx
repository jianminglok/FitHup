import { supabase } from '../lib/supabase'
import React, { useState, useCallback, useEffect, useRef } from "react"
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import colours from "../assets/colours/colours";
import { StyleSheet, StatusBar, Image, Text, View, TouchableOpacity, Button, ScrollView } from "react-native"
import TopBar from './TopBar';
import { Dimensions } from "react-native";
import * as Progress from 'react-native-progress';
import { LineChart } from "react-native-chart-kit";
import disc from '@jsamr/counter-style/presets/disc';
import MarkedList from '@jsamr/react-native-li';
import Style from './Style';
import Card from './Card';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useSelector, useDispatch } from 'react-redux';

var fullWidth = Dimensions.get('window').width; //full width

let customFonts = {
    'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
    'RobotoRegular': require("../assets/fonts/Roboto-Regular.ttf"),
    'MontserratBold': require("../assets/fonts/Montserrat-Bold.ttf"),
};

export default function Homepage({ navigation }) {
    const user = supabase.auth.user();
    const [appIsReady, setAppIsReady] = useState(false);
    const mounted = useRef(false);
    const [loading, setLoading] = useState(false);
    const [exerciseTarget, setExerciseTarget] = useState();
    const [calorieTarget, setCalorieTarget] = useState();
    const [dailyExercise, setDailyExercise] = useState();
    const [weeklyExercise, setWeeklyExercise] = useState();
    const [weeklyExerciseChart, setWeeklyExerciseChart] = useState([]);
    const [dailyFood, setDailyFood] = useState();
    const [weeklyFood, setWeeklyFood] = useState();
    const [weeklyFoodChart, setWeeklyFoodChart] = useState([]);
    const [exerciseProgressBar, setExerciseProgressBar] = useState();
    const [foodProgressBar, setFoodProgressBar] = useState();

    const dispatch = useDispatch();
    const { BMI } = useSelector((state) => state.profile);

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

            }
        }

        async function getExerciseTarget() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                const { data, error } = await supabase
                    .from('target')
                    .select('caloriesBurntAmount')
                    .eq('id', user.id)
                    .single()


                if (data) {
                    setExerciseTarget(data['caloriesBurntAmount']);

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

        async function getCalorieTarget() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                const { data, error } = await supabase
                    .from('target')
                    .select('caloriesIntakeAmount')
                    .eq('id', user.id)
                    .single()


                if (data) {
                    setCalorieTarget(data['caloriesIntakeAmount']);

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

        async function getDailyExercise() {
            try {

                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                let today = new Date();
                today.setTime(today.getTime() + 8 * 60 * 60 * 1000)
                today.setUTCHours(0, 0, 0, 0);
                let tmr = new Date();
                tmr.setTime(today.getTime());
                tmr.setDate(today.getDate() + 1);

                const { data, error } = await supabase
                    .from('ActivityLoggerExercise')
                    .select(`caloriesAmount`)
                    .gte('date', today.toISOString())
                    .lt('date', tmr.toISOString())
                    .eq('id', user.id)

                if (data) {

                    let total = 0;
                    for (let i = 0; i < data.length; i++) {
                        total += parseInt(data[i]['caloriesAmount'])
                    }
                    setDailyExercise(total);



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

                    setWeeklyExerciseChart(exerciseChartData);
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

        async function getDailyDietaryIntake() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                let today = new Date();
                today.setTime(today.getTime() + 8 * 60 * 60 * 1000)
                today.setUTCHours(0, 0, 0, 0);
                let tmr = new Date();
                tmr.setTime(today.getTime());
                tmr.setDate(today.getDate() + 1);

                const { data, error } = await supabase
                    .from('ActivityLoggerCalorie')
                    .select(`caloriesAmount`)
                    .gte('date', today.toISOString())
                    .lt('date', tmr.toISOString())
                    .eq('id', user.id)


                if (data) {

                    let total = 0;
                    for (let i = 0; i < data.length; i++) {
                        total += parseInt(data[i]['caloriesAmount'])
                    }
                    setDailyFood(total);


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

                    setWeeklyFoodChart(foodChartData);
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

        async function getExerciseProgressBarRatio() {
            try {
                setLoading(true);
                // if (!user) throw new Error("No user on the session!");
                await getExerciseTarget();
                await getDailyDietaryIntake();


                if (dailyExercise > exerciseTarget) {
                    setExerciseProgressBar(1);
                }

                setExerciseProgressBar(dailyExercise / exerciseTarget);

            } catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }

        async function getFoodProgressBarRatio() {
            try {
                setLoading(true);
                // if (!user) throw new Error("No user on the session!");
                await getCalorieTarget();
                await getDailyExercise();


                if (dailyFood > calorieTarget) {
                    setFoodProgressBar(1);
                }

                setFoodProgressBar(dailyFood / calorieTarget);

            } catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false);

            }
        }

        prepare();

        if (mounted.current != false) {
            const arr = [
                new Promise((resolve, reject) => {
                    resolve(getExerciseProgressBarRatio());
                }),
                new Promise((resolve, reject) => {
                    resolve(getFoodProgressBarRatio());
                }),
                new Promise((resolve, reject) => {
                    resolve(getWeeklyExercise());
                }),
                new Promise((resolve, reject) => {
                    resolve(getWeeklyDietaryIntake());
                }),

            ];

            Promise.all([arr[0], arr[1], arr[2], arr[3]]).then(() => {
                setAppIsReady(true);
            })
            // getExerciseProgressBarRatio();
            // getFoodProgressBarRatio();
            // getWeeklyExercise();
            // getWeeklyDietaryIntake();
        }

        //Subscribe to real time changes to list of food performed
        const exerciseSubscription = supabase
            .from('ActivityLoggerExercise')
            .on('*', () => getDailyExercise())
            .subscribe()

        //Subscribe to real time changes to list of food performed
        const foodSubscription = supabase
            .from('ActivityLoggerCalorie')
            .on('*', () => getDailyDietaryIntake())
            .subscribe()

        return () => {
            mounted.current = false;
            supabase.removeSubscription(exerciseSubscription);
            supabase.removeSubscription(foodSubscription);

        };
    }, [user, appIsReady]);

    // Display splash screen while font is loading
    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    const exerciseData = {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        datasets: [
            {
                data: weeklyExerciseChart,
                strokeWidth: 4 // optional
            }
        ],
    };

    const foodData = {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        datasets: [
            {
                data: weeklyFoodChart,
                strokeWidth: 4 // optional
            }
        ],
    };

    return (
        <View style={Style.homepageContainer} onLayout={onLayoutRootView}>
            <StatusBar />
            <TopBar testId="homeTopBar" navigation={navigation} />

            <ScrollView style={Style.homepageScrollview}>

                <TouchableOpacity onPress={() => navigation.navigate('ExerciseLog')}>
                    <Card testId="exCard" cardTitle="Exercises" titleSize={24}>
                        <FontAwesome5
                            name='dumbbell'
                            size={30}
                            style={{ transform: [{ rotateZ: '-25deg' }], position: 'absolute', alignSelf: 'center' }}
                            color={colours.orange}
                        />
                        <View style={Style.cardDescriptionContainer}>
                            {exerciseTarget && dailyExercise
                                ? <View>
                                    <Text style={[Style.cardDescriptionBold]}>{exerciseTarget - dailyExercise} calories</Text>
                                    <Text style={[Style.cardDescription]}>to target</Text>
                                </View>
                                : <Text style={[Style.cardDescriptionBold]}>Target not set</Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'column', marginBottom: 15 }}>
                            {isNaN(exerciseProgressBar) ?
                                <Progress.Bar progress={0} height={10} borderWidth={0} borderRadius={5} width={fullWidth - 76} unfilledColor="#ffffff" color="linear-gradient(180deg, rgba(255,77,125,1) 0%, rgba(243,10,73,0) 100%)" />
                                :


                                <Progress.Bar progress={exerciseProgressBar} height={10} borderWidth={0} borderRadius={5} width={fullWidth - 76} unfilledColor="#ffffff" color="linear-gradient(180deg, rgba(255,77,125,1) 0%, rgba(243,10,73,0) 100%)" />
                            }
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.cardPartitionContainer}>
                                <Text style={[styles.exerciseCalCount]}>{weeklyExercise}</Text>
                                <Text style={[styles.exerciseCalText]}>cal</Text>
                            </View>
                            <View style={styles.cardPartitionContainer}>
                                <LineChart
                                    data={exerciseData}
                                    width={(fullWidth - 76) / 2 + 16}
                                    height={100}
                                    withVerticalLabels={false}
                                    withHorizontalLabels={false}
                                    withVerticalLines={false}
                                    withHorizontalLines={false}
                                    withDots={false}
                                    withShadow={false}
                                    backgroundColor={"transparent"}
                                    chartConfig={{
                                        backgroundGradientFromOpacity: 0,
                                        backgroundGradientToOpacity: 0,
                                        color: (opacity = 255) => `rgba(251, 152, 37, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                            paddingRight: 0,
                                        },
                                    }}
                                    bezier
                                />
                            </View>
                        </View>
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('FoodLog')}>
                    <Card testId="calCard" cardTitle="Calories" style={{ marginVertical: 19 }} titleSize={24}>
                        <Image
                            source={require("../assets/images/Calorie_red.png")}
                            style={{ width: 40, height: 40, alignSelf: 'center', position: 'absolute', resizeMode: 'contain' }}

                        />
                        <View style={Style.cardDescriptionContainer}>
                            {calorieTarget && dailyFood
                                ? <View>
                                    <Text style={[Style.cardDescriptionBold]}>{calorieTarget - dailyFood} calories</Text>
                                    <Text style={[Style.cardDescription]}>to target</Text>
                                </View>
                                : <Text style={[Style.cardDescriptionBold]}>Target not set</Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'column', marginBottom: 15 }}>
                            {isNaN(foodProgressBar) ?
                                <Progress.Bar progress={0} height={10} borderWidth={0} borderRadius={5} width={fullWidth - 76} unfilledColor="#ffffff" color="linear-gradient(180deg, rgba(255,77,125,1) 0%, rgba(243,10,73,0) 100%, )" />
                                :
                                <Progress.Bar progress={foodProgressBar} height={10} borderWidth={0} borderRadius={5} width={fullWidth - 76} unfilledColor="#ffffff" color="linear-gradient(180deg, rgba(255,77,125,1) 0%, rgba(243,10,73,0) 100%, )" />
                            }
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.cardPartitionContainer}>
                                <Text style={[styles.dietCalCount]}>{weeklyFood}</Text>
                                <Text style={[styles.dietCalText]}>cal</Text>
                            </View>
                            <View style={styles.cardPartitionContainer}>
                                <LineChart
                                    data={foodData}
                                    width={(fullWidth - 76) / 2 + 16}
                                    height={100}
                                    withVerticalLabels={false}
                                    withHorizontalLabels={false}
                                    withVerticalLines={false}
                                    withHorizontalLines={false}
                                    withDots={false}
                                    withShadow={false}
                                    backgroundColor={"transparent"}
                                    chartConfig={{
                                        backgroundGradientFromOpacity: 0,
                                        backgroundGradientToOpacity: 0,
                                        color: (opacity = 255) => `rgba(251, 74, 84, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                            paddingRight: 0,
                                        },
                                    }}
                                    bezier
                                />
                            </View>
                        </View>
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Recommendations')}>
                    <Card testId="recCard" cardTitle="Recommendations" style={{ marginBottom: 19 }} titleSize={24}>
                        <View style={{ marginVertical: 15, marginRight: 19 }}>
                            <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationTitle}>
                                <View>
                                    <Text style={[styles.recommendationTitle]}>
                                        General
                                    </Text>
                                    <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationDetails} >
                                        <Text style={[styles.recommendationDetails, { marginRight: 19 }]}>
                                            You current BMI is {BMI ? BMI.toFixed(2) : ''}, which indicates that you are {BMI > 18.5 && BMI < 24.9 ? 'healthy' : BMI < 18.5 ? 'underweight. You should try gaining some weight' : 'overweight. You should try losing some weight'}.
                                        </Text>
                                    </MarkedList>
                                </View>
                            </MarkedList>
                            {(weeklyFood / (calorieTarget * 7)) < 0.5 || (weeklyFood / (calorieTarget * 7)) > 1.5
                                ? <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationTitle}>
                                    <View>
                                        <Text style={[styles.recommendationTitle]}>
                                            Dietary
                                        </Text>
                                        <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationDetails} >
                                            <Text style={[styles.recommendationDetails, { marginRight: 50 }]}>
                                                {(weeklyFood / (calorieTarget * 7)) < 0.5
                                                    ? "It appears that you haven't been reaching your daily calorie intake target most of the week."
                                                    : (weeklyFood / (calorieTarget * 7)) > 1.5
                                                        ? "It appears that you have been taking in more calories than your target most of the week."
                                                        : ""
                                                }
                                            </Text>
                                        </MarkedList>
                                    </View>
                                </MarkedList>
                                : <View></View>
                            }
                            {(weeklyExercise / (exerciseTarget * 7)) < 0.5 || (weeklyExercise / (exerciseTarget * 7)) > 1.5
                                ? <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationTitle}>
                                    <View style={{ marginRight: 19 }}>
                                        <Text style={[styles.recommendationTitle]}>
                                            Exercise
                                        </Text>
                                        <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationDetails} >
                                            <Text style={[styles.recommendationDetails, { marginRight: 30 }]}>
                                                {(weeklyExercise / (exerciseTarget * 7)) < 0.25
                                                    ? "It appears that you haven't been reaching your daily target most of the week. Do consider working harder."
                                                    : (weeklyExercise / (exerciseTarget * 7)) < 0.5
                                                        ? "You're making good progress, just work slightly harder to reach your target"
                                                        : (weeklyExercise / (exerciseTarget * 7)) > 1.5
                                                            ? "Good work for exercising way more than your target but do remember not to push your limits too hard!"
                                                            : ''
                                                }
                                            </Text>
                                        </MarkedList>
                                    </View>
                                </MarkedList>
                                : <View></View>
                            }
                        </View>
                    </Card>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    cardPartitionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    exerciseCalCount: {
        fontSize: 45,
        fontFamily: "MontserratBold",
        fontWeight: "700",
        color: colours.orange,
    },

    exerciseCalText: {
        fontSize: 22,
        fontFamily: "MontserratBold",
        fontWeight: "700",
        color: colours.orange,
    },

    dietCalCount: {
        fontSize: 45,
        fontFamily: "MontserratBold",
        fontWeight: "700",
        color: colours.red,
    },

    dietCalText: {
        fontSize: 22,
        fontFamily: "MontserratBold",
        fontWeight: "700",
        color: colours.red,
    },

    recommendationTitle: {
        fontSize: 18,
        fontFamily: "MontserratBold",
        fontWeight: "700",
        color: colours.text,
        flexShrink: 1
    },

    recommendationDetails: {
        fontSize: 16,
        fontFamily: "MontserratBold",
        fontWeight: "200",
        color: colours.text,
        flexShrink: 1,

    },
})