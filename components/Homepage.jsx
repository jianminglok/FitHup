import { supabase } from '../lib/supabase'
import React, { useState, useCallback, useEffect } from "react"
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

export default function Homepage() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        // Prepare to load custom fonts
        async function prepare() {
            try {
                await SplashScreen.preventAutoHideAsync();
                await Font.loadAsync(customFonts);
            } catch (error) {
                console.warn(error);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

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
        <View style={Style.homepageContainer} onLayout={onLayoutRootView}>
            <StatusBar />
            <TopBar />

            <ScrollView style={Style.homepageScrollview}>
                <Card cardTitle="Exercises">
                    <View style={Style.cardDescriptionContainer}>
                        <Text style={[Style.cardDescriptionBold]}>4000 calories</Text>
                        <Text style={[Style.cardDescription]}>to target</Text>
                    </View>
                    <View style={{ flexDirection: 'column', marginBottom: 15 }}>
                        <Progress.Bar progress={0.75} height={10} borderWidth={0} borderRadius={5} width={fullWidth - 76} unfilledColor="#ffffff" color="linear-gradient(180deg, rgba(255,77,125,1) 0%, rgba(243,10,73,0) 100%)" />
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

                <Card cardTitle="Calories" style={{ marginVertical: 19 }}>
                    <View style={Style.cardDescriptionContainer}>
                        <Text style={[Style.cardDescriptionBold]}>1000 calories</Text>
                        <Text style={[Style.cardDescription]}>to target</Text>
                    </View>
                    <View style={{ flexDirection: 'column', marginBottom: 15 }}>
                        <Progress.Bar progress={0.75} height={10} borderWidth={0} borderRadius={5} width={fullWidth - 76} unfilledColor="#ffffff" color="linear-gradient(180deg, rgba(255,77,125,1) 0%, rgba(243,10,73,0) 100%, )" />
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

                <Card cardTitle="Recommendations" style={{ marginBottom: 19 }}>
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
        color: '#FB9825',
    },

    exerciseCalText: {
        fontSize: 22,
        fontFamily: "MontserratBold",
        fontWeight: "700",
        color: '#FB9825',
    },

    dietCalCount: {
        fontSize: 45,
        fontFamily: "MontserratBold",
        fontWeight: "700",
        color: '#FB4A54',
    },

    dietCalText: {
        fontSize: 22,
        fontFamily: "MontserratBold",
        fontWeight: "700",
        color: '#FB4A54',
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