import { supabase } from '../lib/supabase'
import React, { useState, useEffect, useRef, useCallback } from "react"
import * as SplashScreen from 'expo-splash-screen';
import colours from "../assets/colours/colours";
import {
    Alert,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as Font from 'expo-font';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { setName, setProfilePic } from "../slices/profileSlice";
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
    const [target, setTarget] = useState();
    const [exerciseRanking, setExerciseRanking] = useState([]);
    const [foodRanking, setFoodRanking] = useState([]);
    const [userRanking, setUserRanking] = useState();
    const [userPoints, setUserPoints] = useState();

    const dispatch = useDispatch();
    const { name, profilePic } = useSelector((state) => state.profile);
    
    const downloadImage = async (path) => {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path)
            if (error) {
                throw error
            }

            const fileReaderInstance = new FileReader();
            fileReaderInstance.readAsDataURL(data);
            fileReaderInstance.onload = () => {
                let base64data = fileReaderInstance.result;
                dispatch(setProfilePic(base64data));
            }
        } catch (error) {
            console.log(error)
            Alert.alert('Error retrieving image: ', error.message)
        }
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

        const getProfile = async () => {
            try {
                setLoading(true);
                const user = supabase.auth.user();
                if (!user) throw new Error("No user on the session!");

                let { data, error, status } = await supabase
                    .from("profiles")
                    .select(`name, profilePic`)
                    .eq("id", user.id)
                    .single();
                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    if (data.name) dispatch(setName(data.name));
                    if (data.profilePic) downloadImage(data.profilePic);
                }
            } catch (error) {
                console.log(error)
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
                    setTarget(data[0]['targetType'])
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
                    .select(`caloriesAmount, id(name), userId(targetType)`)
                    .gte('date', today.toISOString())
                    .lt('date', tmr.toISOString())
                    
                if (data) {
                    
                    const dict = {}
                    for (let i=0; i<data.length; i++) {
                        if (data[i]['userId']['targetType'] === 'Maintain Weight') {
                            let key = data[i]['id']['name']
                            if (key in dict) {
                                dict[key] += parseFloat(data[i]['caloriesAmount'])
                            } else {
                                dict[key] = parseFloat(data[i]['caloriesAmount'])
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
                    .select(`caloriesAmount, id(name), userId(targetType,recommendedCaloriesIntakeAmount)`)
                    .gte('date', today.toISOString())
                    .lt('date', tmr.toISOString())          
    
                if (data) {
                    //console.log(data)
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
                                dict[key] = arr;
                            }
                        }
                    }
                    
                   
                    pointsForCalorieIntake(dict);

                    let results = sortDict(dict,name);
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
            }
        }


        prepare();
        if (mounted.current != false) {
            getProfile();
            getTarget();
            getExercise();
            getDietaryIntake();
        }


        return () => {
            mounted.current = false;
            
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

            <Image
                    style={Style.topBarProfileIcon}
                    source={{
                        uri: profilePic,
                    }}
            />
            <Text testID="title" style={[styles.header, { alignSelf: 'flex-start',marginTop:20 }]}>
                Ranking: {userRanking}, Points: {userPoints}
            </Text>

            {target === "Lose Weight" || target === "Gain Weight"?
            <ScrollView style={[Style.homepageScrollview, { marginTop: 19 }]}>
                {foodRanking.map((foodRanking, index) => {
                    return (
                        <Card key={index} cardTitle ={foodRanking} style={{ marginBottom: 19 }}>
                            <View style={{ marginTop: 15 }}>
                                <Text style={[styles.recommendationTitle]}>
                                    {target}
                                </Text>
                            </View>
                        </Card>
                    )
                })}
            </ScrollView> : 

            target === "Maintain Weight"?
            //second leaderboard
            <ScrollView style={[Style.homepageScrollview, { marginTop: 19 }]}>
                {exerciseRanking.map((exerciseRanking, index) => {
                    return (
                        <Card key={index} cardTitle ={exerciseRanking} style={{ marginBottom: 19 }}>
                            <View style={{ marginTop: 15 }}>
                               
                            </View>
                        </Card>
                    )
                })}
            </ScrollView>:
            
            //if havent set up target
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


