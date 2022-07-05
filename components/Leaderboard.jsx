import { supabase } from '../lib/supabase'
import React, { useState, useEffect, useRef, useCallback } from "react"
import * as SplashScreen from 'expo-splash-screen';
import colours from "../assets/colours/colours";
import {
    Alert,
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
import TopBar from './TopBar';
import Style from './Style';
import Button from "./Button";
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from "react-native-select-dropdown";
import Entypo from "react-native-vector-icons/Entypo";
import Card from './Card';

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
    const [profile, setProfile] = useState([]);
    const [gender, setGender] = useState();
    const [exercise, setExercise] = useState()
    


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

        async function getProfile() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                const { data, error } = await supabase
                    .from('profiles')
                    .select('gender')
                    .eq('id', user.id)
                    

                if (data) {
                    //console.log(data)
                    setProfile(data)
                    //console.log(data[0]['gender'])
                    setGender(data[0]['gender'])
                } else if (error) {
                    throw error;
                }
            }
            catch (error) {
                console.log('error')
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
                tmr.setDate(tmr.getDate()+1);
                tmr.setUTCHours(0, 0, 0, 0);
                const { data, error } = await supabase
                    .from('ActivityLoggerExercise')
                    .select('caloriesAmount, id')
                    //.eq('id', user.id)
                    .gte('date', today.toISOString())
                    .lt('date', tmr.toISOString())
                    
                
                if (data) {
                    const dict = {}
                    for (let i=0; i<data.length; i++) {
                        let key = data[i]['id']
                        if (key in dict) {
                            dict[key] += parseFloat(data[i]['caloriesAmount'])
                        } else {
                            dict[key] = parseFloat(data[i]['caloriesAmount'])
                        }
                    }
                    //console.log(typeof(data[0]['caloriesAmount']))
                    console.log(dict)
                    //console.log(data)
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
        prepare();
        if (mounted.current != false) {
            getProfile();
            getExercise();
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

            {gender === "Male"?
            <ScrollView style={[Style.homepageScrollview, { marginTop: 19 }]}>
                {profile.map((profile, index) => {
                    return (
                        <Card key={index} cardTitle ={gender} style={{ marginBottom: 19 }}>
                            <View style={{ marginTop: 15 }}>
                                <Text style={[styles.recommendationTitle]}>
                                    {gender}
                                </Text>
                            </View>
                        </Card>
                    )
                })}
            </ScrollView> : 

            //second leaderboard
            <ScrollView style={[Style.homepageScrollview, { marginTop: 19 }]}>
                {profile.map((profile, index) => {
                    return (
                        <Card key={index} cardTitle ={gender} style={{ marginBottom: 19 }}>
                            <View style={{ marginTop: 15 }}>
                                <Text style={[styles.recommendationTitle]}>
                                    {gender}
                                </Text>
                            </View>
                        </Card>
                    )
                })}
            </ScrollView>}

            
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


