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

export default function Recommendations({ navigation }) {
    const user = supabase.auth.user();
    const [appIsReady, setAppIsReady] = useState(false);
    const mounted = useRef(false);
    const [loading, setLoading] = useState(false);
    const arr = [1,2,3];


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
        if (mounted.current != false) {
            
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
        <View style={Style.homepageContainer} onLayout={onLayoutRootView}>
            <StatusBar />
            <TopBar testID="recommendationBar" navigation={navigation} />
            <Text testID='title' style={[styles.header, { alignSelf: 'flex-start' }]}>
                Recommendations
            </Text>

            <ScrollView testID='recommendationContainer' style={[Style.homepageScrollview, { marginTop: 19 }]}>
                {arr.map((index) => {
                    return (
                        <Card key={index} cardTitle={"Recommendation " + index} titleSize={20} style={{ marginBottom: 19}}>
                            <View style={{ marginTop: 15 }}>
                                <Text style={[styles.recommendationTitle, {marginBottom: 150}]}>
                                    {"Details of recommendations"} 
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