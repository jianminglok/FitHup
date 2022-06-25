import { supabase } from '../lib/supabase'
import React, { useState, useCallback, useEffect, useRef } from "react"
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import colours from "../assets/colours/colours";
import { StyleSheet, StatusBar, Text, View, TouchableOpacity, Button, ScrollView, ActivityIndicator } from "react-native"
import TopBar from './TopBar';
import Style from './Style';
import Card from './Card';

let customFonts = {
    'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
    'RobotoRegular': require("../assets/fonts/Roboto-Regular.ttf"),
    'MontserratBold': require("../assets/fonts/Montserrat-Bold.ttf"),
};

export default function Food({ navigation }) {
    const user = supabase.auth.user();
    const [appIsReady, setAppIsReady] = useState(false);
    const mounted = useRef(false);
    const [loading, setLoading] = useState(false);
    const [food, setFood] = useState([]);


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

        async function getUserDietaryIntake() {
            try {
                setLoading(true);
                if (!user) throw new Error("No user on the session!");

                const { data, error } = await supabase
                    .from('ActivityLoggerCalorie')
                    .select()
                    .eq("id", user.id)
                    .order('date', { ascending: false })
                    .order('time', { ascending: false })

                if (data) {
                    setFood(data)
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

        prepare();
        if (mounted.current != false) {
            getUserDietaryIntake();
        }

        //Subscribe to real time changes to list of food performed
        const foodSubscription = supabase
            .from('ActivityLoggerCalorie')
            .on('*', () => getUserDietaryIntake())
            .subscribe()

        return () => {
            mounted.current = false;
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
            <TopBar testID="logTopBar" navigation={navigation} />
            <Text testID='title' style={[styles.header, { alignSelf: 'flex-start' }]}>
                Dietary Intake
            </Text>

            <ScrollView testID='logContainer' style={[Style.homepageScrollview, { marginTop: 19 }]}>
                {food.map((food, index) => {
                    return (
                        <Card key={index} cardTitle={food.date + '\t\t' + food.time.slice(0,5)} titleSize={18} style={{ marginBottom: 19 }}>
                            <View style={{ marginTop: 15 }}>
                                <Text style={[styles.recommendationTitle]}>
                                    {food.foodType + ' (' + food.portionValue + ' ' + food.unit + ')' + ' - ' + food.caloriesAmount + ' cal'}
                                </Text>
                            </View>
                        </Card>
                    )
                })}
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
})