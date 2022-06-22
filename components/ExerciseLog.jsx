import { supabase } from '../lib/supabase'
import React, { useState, useCallback, useEffect, useRef } from "react"
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import colours from "../assets/colours/colours";
import { StyleSheet, StatusBar, Image, Text, View, TouchableOpacity, Button, ScrollView } from "react-native"
import TopBar from './TopBar';
import MarkedList from '@jsamr/react-native-li';
import Style from './Style';
import Card from './Card';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

let customFonts = {
    'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
    'RobotoRegular': require("../assets/fonts/Roboto-Regular.ttf"),
    'MontserratBold': require("../assets/fonts/Montserrat-Bold.ttf"),
};

const arr = [1,2,3,4,5]



export default function Homepage({ navigation }) {
    const user = supabase.auth.user();
    const [appIsReady, setAppIsReady] = useState(false);
    const mounted = useRef(false);
    const [loading, setLoading] = useState(false);  
    const [counter, setCounter] = useState(0);
    const [data, setData] = useState();
    
    
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

        async function getData() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");
                
                const { data, error } = await supabase
                .from('ActivityLoggerExercise')
                .select('*')
                .eq("id", user.id)
                
                return data;
           
            }
    
     
            catch (error) {
                console.log('error')
            }
            
            finally {
                setLoading(false)
            }
           
    
    
        }
        
        async function getListValue() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");
                

                const { data, error, count } = await supabase
                .from('ActivityLoggerExercise')
                .select('*', {count: 'exact' })
                .eq("id", user.id)
                setCounter(count)

            }

     
            catch (error) {
                console.log('error')
            }

           

            finally {
                setLoading(false)
            }

        }


        
        prepare();
        getData().then(data=> {
            if (mounted.current) setData(data)
        })
        getListValue();



        return () => { mounted.current = false; };
    }, [user]);

    // Display splash screen while 
    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

   

    return (
        <View style={[Style.profileContainer,{alignItems:'center'}]} onLayout={onLayoutRootView}>
            <StatusBar />
            <TopBar navigation={navigation} />
            <ScrollView style={Style.homepageScrollview}>
                <Text style={styles.header}>
                    Exercises
                </Text>
                <View>
                    {arr.map(a=>{
                        return <Card style={{marginTop:15, height:86 }} key={a}>
                            {/* <Text style={[Style.cardDescriptionBold,{position:'absolute'}]} >{(data[1]['date'])}{`\t\t\t`}{(data[1]['startTime'].slice(0,5))} - {(data[1]['endTime'].slice(0,5))}</Text> */}
                            {/* <Text style={[Style.cardDescriptionBold,{position:'absolute', marginTop:25}]}>{(data[1]['exerciseType'])} - {(data[1]['caloriesAmount'])} cal</Text> */}
                            <Text style={[Style.cardDescriptionBold,{position:'absolute', marginTop:25}]} onPress={()=> console.log(data)}>{data[0]['exerciseType']}</Text>

                            
                        </Card>
                    })}
                    
                </View>

            </ScrollView>

        </View>
    )

    

}

const styles = StyleSheet.create({

    header: {
        color: colours.text,
        fontFamily: "MontserratBold",
        fontSize: 24,
        marginTop: 19,
        

    },
})