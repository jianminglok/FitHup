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
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { LineChart } from "react-native-chart-kit";
import disc from '@jsamr/counter-style/presets/disc';
import MarkedList from '@jsamr/react-native-li';
import Style from './Style';
import Card from './Card';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

var fullWidth = Dimensions.get('window').width; //full width

/* Mock data for homepage */
const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
        {
            data: [20, 45, 28, 80, 99, 43],
            strokeWidth: 4 // optional
        }
    ],
};

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
    const [dailyExercise,setDailyExercise] = useState();
    const [dailyFood, setDailyFood] = useState();
    const [exerciseProgressBar, setExerciseProgressBar] = useState();
    const [foodProgressBar, setFoodProgressBar] = useState();
    
    function getNum() {
        return exerciseProgressBar;
    }

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
        
        async function getExerciseProgressBarRatio() {
            try {
                setLoading(true);
                // if (!user) throw new Error("No user on the session!");
                await getExerciseTarget();
                await getExercise();
                
                
                if (dailyExercise > exerciseTarget) {
                    setExerciseProgressBar(1);
                }
    
                setExerciseProgressBar(dailyExercise / exerciseTarget);
                // console.log(exerciseTarget);
                

                // console.log(dailyExercise)

            } catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }
    
    
        prepare();

        if (mounted.current != false) {
            getExerciseTarget();
            getExercise();
            getExerciseProgressBarRatio();
            // const arr = [
            //     new Promise((resolve, reject) => {
            //         resolve(getExerciseTarget());
                    
            //     }),
                
            //     new Promise((resolve, reject) => {
            //         resolve(getExercise());
                                
            //     }),
                
            // ]
    
            // Promise.all([arr[0], arr[1]]).then((resp) =>{
            //     // console.log(resp)
            //     getExerciseProgressBarRatio();
            //     // console.log(exerciseTarget)
            //     console.log(exerciseProgressBar)

            // }).catch((error) => {
            //     console.log(error);
            // })
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
            <TopBar testId="homeTopBar" navigation={navigation} />

            <ScrollView style={Style.homepageScrollview}>

                <TouchableOpacity onPress={()=> navigation.navigate('ExerciseLog')}>
                    <Card testId="exCard" cardTitle="Exercises" titleSize={24}>
                        <FontAwesome5
                            name = 'dumbbell'
                            size= {30}
                            style = {{transform:[{rotateZ: '-25deg'}], position: 'absolute', alignSelf:'center'}}
                            color={colours.orange}
                        />
                        <View style={Style.cardDescriptionContainer}>
                            <Text style={[Style.cardDescriptionBold]}>{exerciseTarget - dailyExercise} calories</Text>
                            <Text style={[Style.cardDescription]}>to target</Text>
                        </View>
                        <View style={{ flexDirection: 'column', marginBottom: 15 }}>
                            {exerciseProgressBar === undefined?
                            <Progress.Bar progress={0.5} height={10} borderWidth={0} borderRadius={5} width={fullWidth - 76} unfilledColor="#ffffff" color="linear-gradient(180deg, rgba(255,77,125,1) 0%, rgba(243,10,73,0) 100%)" />
                            : 
                
                            <ProgressBarAnimated width={fullWidth - 76} height={10} borderWidth={0} borderRadius={5} backgroundColorOnComplete="#6CC644" value = {exerciseProgressBar * 500}/>
                            // <Progress.Bar progress={exerciseProgressBar} height={10} borderWidth={0} borderRadius={5} width={fullWidth - 76} unfilledColor="#ffffff" color="linear-gradient(180deg, rgba(255,77,125,1) 0%, rgba(243,10,73,0) 100%)" />
                            }
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.cardPartitionContainer}>
                                <Text style={[styles.exerciseCalCount]}>16000</Text>
                                <Text style={[styles.exerciseCalText]}>cal</Text>
                            </View>
                            <View style={styles.cardPartitionContainer}>
                                <LineChart
                                    data={data}
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
                
                <TouchableOpacity onPress={()=> navigation.navigate('FoodLog')}>
                    <Card testId="calCard" cardTitle="Calories" style={{ marginVertical: 19 }} titleSize={24}>
                        <Image
                            source={require("../assets/images/Calorie_red.png")}
                            style ={{width:40, height:40, alignSelf:'center', position:'absolute', resizeMode: 'contain'}}
                            
                        />  
                        <View style={Style.cardDescriptionContainer}>
                            <Text style={[Style.cardDescriptionBold]}>{calorieTarget - dailyFood} calories</Text>
                            <Text style={[Style.cardDescription]}>to target</Text>
                        </View>
                        <View style={{ flexDirection: 'column', marginBottom: 15 }}>
                            <Progress.Bar progress={0.8} height={10} borderWidth={0} borderRadius={5} width={fullWidth - 76} unfilledColor="#ffffff" color="linear-gradient(180deg, rgba(255,77,125,1) 0%, rgba(243,10,73,0) 100%, )" />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.cardPartitionContainer}>
                                <Text style={[styles.dietCalCount]}>20000</Text>
                                <Text style={[styles.dietCalText]}>cal</Text>
                            </View>
                            <View style={styles.cardPartitionContainer}>
                                <LineChart
                                    data={data}
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
                
                <TouchableOpacity onPress={()=> navigation.navigate('Recommendations')}>
                    <Card testId="recCard" cardTitle="Recommendations" style={{ marginBottom: 19 }} titleSize={24}>
                        <View style={{ marginVertical: 15 }}>
                            <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationTitle}>
                                <View>
                                    <Text style={[styles.recommendationTitle]}>
                                        Recommendation 1
                                    </Text>
                                    <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationDetails} >
                                        <Text style={[styles.recommendationDetails]}>
                                            Detail of recommendation
                                        </Text>
                                    </MarkedList>
                                </View>
                                <View>
                                    <Text style={[styles.recommendationTitle]}>
                                        Recommendation 2
                                    </Text>
                                    <MarkedList counterRenderer={disc} markerTextStyle={styles.recommendationDetails} >
                                        <Text style={[styles.recommendationDetails]}>
                                            Detail of recommendation
                                        </Text>
                                    </MarkedList>
                                </View>
                            </MarkedList>
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
        flexShrink: 1
    },
})