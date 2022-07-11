import { supabase } from '../lib/supabase'
import React, { useState, useEffect, useRef, useCallback } from "react"
import * as SplashScreen from 'expo-splash-screen';
import colours from "../assets/colours/colours";
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
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
import Card from './Card';
import sortDict from '../assets/sortDict';
import pointsForCalorieIntake from '../assets/pointsForCalorieIntake';


let customFonts = {
    'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
    'RobotoRegular': require("../assets/fonts/Roboto-Regular.ttf"),
    'MontserratBold': require("../assets/fonts/Montserrat-Bold.ttf"),
};

export default function Leaderboard  ({ navigation }) {
    const user = supabase.auth.user();
    const [appIsReady, setAppIsReady] = useState(false);
    const mounted = useRef(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState();
    const [target, setTarget] = useState();
    const [exerciseRanking, setExerciseRanking] = useState([]);
    const [foodRanking, setFoodRanking] = useState([]);
    const [userRanking, setUserRanking] = useState();
    const [userPoints, setUserPoints] = useState();

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


        async function getProfile () {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                const { data, error } = await supabase
                    .from('profiles')
                    .select(`name`)
                    .eq('id', user.id)
                    .single()
                    
                if (data) {
                    setName(data['name'])
                    
                    
                } else if (error) {
                    throw error;
                }

            } catch (error) {
                Alert.alert((error).message);
            } finally {
                setLoading(false);
            }
        }

        async function getTarget() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                const { data, error } = await supabase
                    .from('target')
                    .select('targetType')
                    .eq('id', user.id)
                    

                if (data) {
                    if (data.length !==0) {
                        setTarget(data[0]['targetType'])
                        
                        if (target === 'Maintain Weight') {
                            getExercise();
                            
                        }
                        if (target === 'Gain Weight' || target === 'Lose Weight') {
                            getDietaryIntake();
                            
                        }
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
        
        async function getExercise() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                let today = new Date();
                today.setUTCHours(0, 0, 0, 0);
                let tmr = new Date();
                tmr.setDate(tmr.getDate() + 1);
                tmr.setUTCHours(0, 0, 0, 0);

                const { data, error } = await supabase
                    .from('ActivityLoggerExercise')
                    .select(`caloriesAmount, id(name, profilePic), userId(targetType)`)
                    .gte('date', today.toISOString())
                    .lt('date', tmr.toISOString())
                    
                if (data) {
                    
                    const dict = {}
                    for (let i=0; i<data.length; i++) {
                        if (data[i]['userId']['targetType'] === 'Maintain Weight') {
                            let key = data[i]['id']['name']
                            if (key in dict) {
                                dict[key][0] += parseFloat(data[i]['caloriesAmount'])
                            } else {
                                let arr = [];
                                arr[0] = parseFloat(data[i]['caloriesAmount'])
                                arr[1] = arr[3] = data[i]['id']['profilePic']
                                dict[key] = arr;
                            }
                        }
                    }
                    
                    let results = sortDict(dict,name);
            
                    setExerciseRanking(results[0]);
                    setUserRanking(results[1]);
                    setUserPoints(results[2]);
                    
                    // setExerciseRanking(sortDict(dict, name)[0]);
                    // setUserRanking(sortDict(dict, name)[1]);
                    //console.log(sortDict(dict));
                
                } else if (error) {
                    throw error;
                }
            }
            catch (error) {
                console.log('error2')
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
                today.setUTCHours(0, 0, 0, 0);
                let tmr = new Date();
                tmr.setDate(tmr.getDate() + 1);
                tmr.setUTCHours(0, 0, 0, 0);

                const { data, error } = await supabase
                    .from('ActivityLoggerCalorie')
                    .select(`caloriesAmount, id(name, profilePic), userId(targetType,recommendedCaloriesIntakeAmount)`)
                    .gte('date', today.toISOString())
                    .lt('date', tmr.toISOString())          
    
                if (data) {
                    await data
                    
                    const dict = {}
                    for (let i=0; i<data.length; i++) {

                        if (data[i]['userId']['targetType'] !== 'Maintain Weight') {
                            let key = data[i]['id']['name']
                            if (key in dict) {
                                dict[key][0] += parseFloat(data[i]['caloriesAmount'])
                            } else {
                                let arr=[];
                                arr[0] = parseFloat(data[i]['caloriesAmount']);
                                arr[1] = data[i]['userId']['targetType'];
                                arr[2] = data[i]['userId']['recommendedCaloriesIntakeAmount'];
                                arr[3] = data[i]['id']['profilePic']
                                dict[key] = arr;
                            }
                        }
                    }
                    
                    console.log(dict)
                    await pointsForCalorieIntake(dict);
                    

                    let results = sortDict(dict,name);
                    //console.log(results)
                    setFoodRanking(results[0]);
                    setUserRanking(results[1]);
                    setUserPoints(results[2]);
            
                
                } else if (error) {
                    throw error;
                }
            }
            catch (error) {
                console.log('error3')
            }
            finally {
                setLoading(false)
                // console.log(foodRanking);
            }
        }

        prepare();
        if (mounted.current != false) {
            getProfile();
            
            getTarget();
            
            
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
        <View style={Style.profileContainer} onLayout={onLayoutRootView}>
            <StatusBar />
            <TopBar navigation={navigation} />
            <Text testID="title" style={[styles.header, { alignSelf: 'flex-start' }]}>
                Leaderboard
            </Text>

            
            {target !== undefined ?
                userRanking !== undefined?

                //show ranking
                <View>
                    <Text style={[styles.header, { alignSelf: 'flex-start',marginTop:20 }]}>
                        Ranking: {userRanking}, Points: {userPoints}
                    </Text>
                </View>
                :
                
                //if no ranking but got target
                target === "Lose Weight" || target === "Gain Weight"?
                <Text style={[styles.header, { alignSelf: 'flex-start',marginTop:20 }]}>
                    You are currently unranked. To be placed in the leaderboard, please add a Dietary Intake Activitiy.
                </Text>:
            
                //if no ranking but got target
                <Text style={[styles.header, { alignSelf: 'flex-start',marginTop:20 }]}>
                    You are currently unranked. To be placed in the leaderboard, please add an Exercise Activitiy.
                </Text> :
                
                //if no target
                <Text style={[styles.header, { alignSelf: 'flex-start',marginTop:20 }]}>
                    You are currently unranked. To be placed in the leaderboard, please set your target in the Target Page.
                </Text>
            }

             
            {target === "Lose Weight" || target === "Gain Weight"?
            //show leaderboard 1

            <ScrollView style={[Style.homepageScrollview, { marginTop: 19 }]}>
                {foodRanking.map((foodRanking, index) => {
                    return (
                        <Card key={index} cardTitle ={foodRanking[0]} style={{ marginBottom: 19 }}>
                            <View style={{ marginTop: 15 }}>
                                <Text style={[styles.recommendationTitle]}>
                                    {foodRanking[1]}
                                </Text>
                                <Image
                                    style={Style.topBarProfileIcon}
                                    source={{
                                        uri: foodRanking[2]
                                    }}
                                />

                            </View>
                        </Card>
                    )
                })}
            </ScrollView> :
        
            //show leaderboard 2
            target === "Maintain Weight" ?
            <ScrollView style={[Style.homepageScrollview, { marginTop: 19 }]}>
                {exerciseRanking.map((exerciseRanking, index) => {
                    return (
                        <Card key={index} cardTitle ={exerciseRanking[0]} style={{ marginBottom: 19 }}>
                            <View style={{ marginTop: 15 }}>
                                <Text style={[styles.recommendationTitle]}>
                                        {exerciseRanking[1]}
                                </Text>                             
                            </View>
                        </Card>
                    )
                })}
            </ScrollView>
            :
            
            //dont show anything if target is not set
            <ScrollView></ScrollView>
            
            
            }

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
})