import { supabase } from '../lib/supabase'
import React, { useState, useEffect, useRef, useCallback } from "react"
import * as SplashScreen from 'expo-splash-screen';
import colours from "../assets/colours/colours";
import {
    Alert,
    Image,
    ScrollView,
    Share,
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
import { TouchableOpacity } from 'react-native-gesture-handler';


let customFonts = {
    'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
    'RobotoRegular': require("../assets/fonts/Roboto-Regular.ttf"),
    'MontserratBold': require("../assets/fonts/Montserrat-Bold.ttf"),
};

export default function Leaderboard({ navigation }) {
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

        async function getProfile() {
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
                    if (data.length !== 0) {
                        setTarget(data[0]['targetType'])

                        if (data[0]['targetType'] === 'Maintain Weight') {
                            getExercise();

                        }
                        if (data[0]['targetType'] === 'Gain Weight' || data[0]['targetType'] === 'Lose Weight') {
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
                today.setTime(today.getTime() + 8 * 60 * 60 * 1000)
                today.setUTCHours(0, 0, 0, 0);
                let tmr = new Date();
                tmr.setTime(today.getTime());
                tmr.setDate(today.getDate() + 1);

                const { data, error } = await supabase
                    .from('ActivityLoggerExercise')
                    .select(`caloriesAmount, id(id, name, profilePic), userId(targetType)`)
                    .gte('date', today.toISOString())
                    .lt('date', tmr.toISOString())

                if (data) {

                    const dict = {}
                    for (let i = 0; i < data.length; i++) {
                        if (data[i]['userId']['targetType'] === 'Maintain Weight') {
                            let key = data[i]['id']['id']
                            let currName = data[i]['id']['name']
                            if (key in dict) {
                                dict[key][0] += parseFloat(data[i]['caloriesAmount'])
                            } else {
                                let arr = [];
                                arr[0] = parseFloat(data[i]['caloriesAmount'])
                                arr[1] = data[i]['id']['profilePic']
                                arr[2] = currName;
                                dict[key] = arr;
                            }
                        }
                    }

                    let results = await sortDict(dict, user.id);
                    if (results[0].length > 0 && results[1] != 0) {
                        setExerciseRanking(results[0]);
                        setUserRanking(results[1]);
                        setUserPoints(results[2]);
                    }
                    // setExerciseRanking(sortDict(dict, name)[0]);
                    // setUserRanking(sortDict(dict, name)[1]);
                    //console.log(sortDict(dict));
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
                    .select(`caloriesAmount, id(id, name, profilePic), userId(targetType,recommendedCaloriesIntakeAmount)`)
                    .gte('date', today.toISOString())
                    .lt('date', tmr.toISOString())

                if (data) {
                    let promise = new Promise(function (resolve, reject) {
                        resolve(data);
                    })

                    //dataM = promise.then(function(value){console.log(value)})

                    const dict = {}
                    for (let i = 0; i < data.length; i++) {

                        if (data[i]['userId']['targetType'] !== 'Maintain Weight') {
                            let key = data[i]['id']['id']
                            let currName = data[i]['id']['name']
                            if (key in dict) {
                                dict[key][0] += parseFloat(data[i]['caloriesAmount'])
                            } else {
                                let arr = [];
                                arr[0] = parseFloat(data[i]['caloriesAmount']);
                                arr[1] = data[i]['userId']['targetType'];
                                arr[2] = data[i]['userId']['recommendedCaloriesIntakeAmount'];
                                arr[3] = data[i]['id']['profilePic']
                                arr[4] = currName;
                                dict[key] = arr;
                            }
                        }
                    }

                    // console.log(dict)
                    await pointsForCalorieIntake(dict);

                    let results = await sortDict(dict, user.id);
                    if (results[0].length > 0 && results[1] != 0) {
                        setFoodRanking(results[0]);
                        setUserRanking(results[1]);
                        setUserPoints(results[2]);
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

    const shareRanking = async () => {
        try {
            var m = new Date();
            var dateString = m.getFullYear() + "/" + (m.getMonth() + 1) + "/" + m.getDate() + " " + m.getHours() + ":" + m.getMinutes() + ":" + m.getSeconds();

            const result = await Share.share({
                message: 'My current ranking on the FitHup leaderboard is ' + userRanking + ' and I currently have ' + userPoints + ' points as of ' + dateString + '! Join me on FitHup today! Download FitHup now at https://drive.google.com/file/d/1C3GvyR-E0zO2RuTqIGUYDVwIWclZjOr9/view?usp=sharing',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

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
            <TopBar testID="leaderboardTopbar" navigation={navigation} />
            <Text testID='title' style={[styles.header, { alignSelf: 'flex-start' }]}>
                Leaderboard
            </Text>
            {/*
            <View style={[styles.time, { zIndex: 2 }]}>
                <View style={[styles.timeBtnContainer, { paddingRight: 5 }]}>
                    <TouchableOpacity style={[styles.timeBtn, styles.timeBtnActive]}>
                        <Text style={styles.timeTxt}>Today</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.timeBtnContainer, { paddingLeft: 5 }]}>
                    <TouchableOpacity style={styles.timeBtn}>
                        <Text style={styles.timeTxt}>Week</Text>
                    </TouchableOpacity>
                </View>
            </View>
            */}

            {target !== undefined ?
                userRanking !== undefined ?

                    //show ranking
                    <View style={{
                        flexDirection: 'row',
                        margin: 19
                    }}>
                        <View style={[Style.card, { alignSelf: 'flex-start', marginRight: 19, flex: 6 }]}>
                            <View style={[Style.cardBody, styles.allRankContainer]}>
                                <View style={styles.rankPart3}>
                                    <Text style={[Style.cardTitle, styles.allRankTxt]}>Ranking: {userRanking}</Text>
                                </View>
                                <View style={styles.rankPart4}>
                                    <Text style={[Style.cardTitle, styles.allRankTxt, { textAlign: 'right' }]}>{userPoints} points</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={[styles.rankPart4, { display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }]}>
                                <TouchableOpacity onPress={shareRanking}>
                                    <Entypo
                                        name="share"
                                        size={24}
                                        color={colours.text}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    :

                    //if no ranking but got target
                    target === "Lose Weight" || target === "Gain Weight" ?
                        <Text style={[styles.unrankedInfo, { alignSelf: 'flex-start', marginTop: 13 }]}>
                            You are currently unranked. To be placed in the leaderboard, please add a Dietary Intake Activitiy.
                        </Text> :

                        //if no ranking but got target
                        <Text style={[styles.unrankedInfo, { alignSelf: 'flex-start', marginTop: 13 }]}>
                            You are currently unranked. To be placed in the leaderboard, please add an Exercise Activitiy.
                        </Text> :

                //if no target
                <Text style={[styles.unrankedInfo, { alignSelf: 'flex-start', marginTop: 13 }]}>
                    You are currently unranked. To be placed in the leaderboard, please set your target in the Target Page.
                </Text>
            }

            {(target === "Lose Weight" || target === "Gain Weight") && userRanking != undefined ?
                <ScrollView testID='leaderboardContainer'>
                    <View style={styles.top3Container}>
                        {foodRanking.length >= 2
                            ? <View style={{ marginRight: 20 }}>
                                <View style={styles.rankContainer}>
                                    <Image
                                        style={styles.top2PicContainer}
                                        source={{
                                            uri: foodRanking[1][2],
                                        }}
                                    />
                                    <View style={styles.rankCircle}>
                                        <Text style={styles.rankText}>2</Text>
                                    </View>
                                    <Text style={styles.usernameTxt}>{foodRanking[1][3]}</Text>
                                    <Text style={styles.userLvlTxt}>{foodRanking[1][1]} points</Text>
                                </View>
                            </View>
                            : <View></View>
                        }

                        {foodRanking.length >= 1
                            ? <View>
                                <View style={[styles.rankContainer, { marginBottom: 19 }]}>
                                    <Image
                                        style={[styles.crown, { marginBottom: -25, zIndex: 1 }]}
                                        source={{
                                            uri: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/nxyz3hdy7p-166%3A1373?alt=media&token=1ad04e8c-a691-4f77-bdb2-288b90c5e65f",
                                        }}
                                    />
                                    <Image
                                        style={[styles.top1Container]}
                                        source={{
                                            uri: foodRanking[0][2],
                                        }}
                                    />
                                    <View style={[styles.rankCircle, { backgroundColor: 'rgba(255,202,40,1)' }]}>
                                        <Text style={styles.rankText}>1</Text>
                                    </View>
                                    <Text style={styles.usernameTxt}>{foodRanking[0][3]}</Text>
                                    <Text style={styles.userLvlTxt}>{foodRanking[0][1]} points</Text>
                                </View>
                            </View>
                            : <View></View>
                        }


                        {foodRanking.length >= 3
                            ? <View style={{ marginLeft: 20 }}>
                                <View style={styles.rankContainer}>
                                    <Image
                                        style={styles.top3PicContainer}
                                        source={{
                                            uri: foodRanking[2][2],
                                        }}
                                    />
                                    <View style={[styles.rankCircle, { backgroundColor: 'rgba(255,130,40,1)' }]}>
                                        <Text style={styles.rankText}>3</Text>
                                    </View>
                                    <Text style={styles.usernameTxt}>{foodRanking[2][3]}</Text>
                                    <Text style={styles.userLvlTxt}>{foodRanking[2][1]} points</Text>
                                </View>
                            </View>
                            : <View></View>
                        }
                    </View>

                    {foodRanking.map((foodRanking, index) => {
                        return (
                            <View key={index} style={[Style.card, { marginBottom: 13 }]}>
                                <View style={[Style.cardBody, styles.allRankContainer]}>
                                    <View style={styles.rankPart1}>
                                        <Text style={[Style.cardTitle, styles.allRankTxt]}>{index + 1}</Text>
                                    </View>
                                    <View style={styles.rankPart2}>
                                        <Image
                                            style={styles.rankPic}
                                            source={{
                                                uri: foodRanking[2],
                                            }}
                                        />
                                    </View>
                                    <View style={styles.rankPart3}>
                                        <Text style={[Style.cardTitle, styles.allRankTxt]}>{foodRanking[3]}</Text>
                                    </View>
                                    <View style={styles.rankPart4}>
                                        <Text style={[Style.cardTitle, styles.allRankTxt, { textAlign: 'right' }]}>{foodRanking[1]} points</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView> :

                target === "Maintain Weight" && userRanking != undefined ?
                    <ScrollView testID='leaderboardContainer'>
                        <View style={styles.top3Container}>
                            {exerciseRanking.length >= 2
                                ? <View style={{ marginRight: 20 }}>
                                    <View style={styles.rankContainer}>
                                        <Image
                                            style={styles.top2PicContainer}
                                            source={{
                                                uri: exerciseRanking[1][2],
                                            }}
                                        />
                                        <View style={styles.rankCircle}>
                                            <Text style={styles.rankText}>2</Text>
                                        </View>
                                        <Text style={styles.usernameTxt}>{exerciseRanking[1][3]}</Text>
                                        <Text style={styles.userLvlTxt}>{exerciseRanking[1][1]} points</Text>
                                    </View>
                                </View>
                                : <View></View>
                            }

                            {exerciseRanking.length >= 1
                                ? <View>
                                    <View style={[styles.rankContainer, { marginBottom: 19 }]}>
                                        <Image
                                            style={[styles.crown, { marginBottom: -25, zIndex: 1 }]}
                                            source={{
                                                uri: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/nxyz3hdy7p-166%3A1373?alt=media&token=1ad04e8c-a691-4f77-bdb2-288b90c5e65f",
                                            }}
                                        />
                                        <Image
                                            style={[styles.top1Container]}
                                            source={{
                                                uri: exerciseRanking[0][2],
                                            }}
                                        />
                                        <View style={[styles.rankCircle, { backgroundColor: 'rgba(255,202,40,1)' }]}>
                                            <Text style={styles.rankText}>1</Text>
                                        </View>
                                        <Text style={styles.usernameTxt}>{exerciseRanking[0][3]}</Text>
                                        <Text style={styles.userLvlTxt}>{exerciseRanking[0][1]} points</Text>
                                    </View>
                                </View>
                                : <View></View>
                            }


                            {exerciseRanking.length >= 3
                                ? <View style={{ marginLeft: 20 }}>
                                    <View style={styles.rankContainer}>
                                        <Image
                                            style={styles.top3PicContainer}
                                            source={{
                                                uri: exerciseRanking[2][2],
                                            }}
                                        />
                                        <View style={[styles.rankCircle, { backgroundColor: 'rgba(255,130,40,1)' }]}>
                                            <Text style={styles.rankText}>3</Text>
                                        </View>
                                        <Text style={styles.usernameTxt}>{exerciseRanking[2][3]}</Text>
                                        <Text style={styles.userLvlTxt}>{exerciseRanking[2][1]} points</Text>
                                    </View>
                                </View>
                                : <View></View>
                            }
                        </View>

                        {exerciseRanking.map((exerciseRanking, index) => {
                            return (
                                <View key={index} style={[Style.card, { marginBottom: 13 }]}>
                                    <View style={[Style.cardBody, styles.allRankContainer]}>
                                        <View style={styles.rankPart1}>
                                            <Text style={[Style.cardTitle, styles.allRankTxt]}>{index + 1}</Text>
                                        </View>
                                        <View style={styles.rankPart2}>
                                            <Image
                                                style={styles.rankPic}
                                                source={{
                                                    uri: exerciseRanking[2],
                                                }}
                                            />
                                        </View>
                                        <View style={styles.rankPart3}>
                                            <Text style={[Style.cardTitle, styles.allRankTxt]}>{exerciseRanking[3]}</Text>
                                        </View>
                                        <View style={styles.rankPart4}>
                                            <Text style={[Style.cardTitle, styles.allRankTxt, { textAlign: 'right' }]}>{exerciseRanking[1]} points</Text>
                                        </View>
                                    </View>
                                </View>
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

    unrankedInfo: {
        color: colours.text,
        fontFamily: "MontserratBold",
        fontSize: 18,
        marginHorizontal: 27
    },

    recommendationTitle: {
        fontSize: 18,
        fontFamily: "MontserratBold",
        fontWeight: "700",
        color: colours.text,
        flexShrink: 1
    },

    time: {
        display: "flex",
        flexDirection: "row",
        flex: 1,
        marginTop: 13,
        marginBottom: 60
    },

    timeBtnContainer: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },

    timeBtn: {
        width: 80,
        paddingVertical: 10,
        borderRadius: 35,
    },

    timeBtnActive: {
        backgroundColor: "rgba(42,42,42,1)",
    },

    timeTxt: {
        fontSize: 13,
        fontFamily: "MontserratBold",
        fontWeight: "400",
        textAlign: "center",
        color: "rgba(255, 255, 255, 1)",
    },

    top3Container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    top2PicContainer: {
        borderRadius: 47.5,
        borderWidth: 3.7,
        borderColor: "#F4F4F4",
        width: 60,
        height: 60,
    },

    top3PicContainer: {
        borderRadius: 47.5,
        borderWidth: 3.7,
        borderColor: "#FF8228",
        width: 60,
        height: 60,
    },

    top1Container: {
        borderRadius: 47.5,
        borderWidth: 3.7,
        borderColor: "rgba(255,202,40,1)",
        width: 95,
        height: 95,
    },

    usernameTxt: {
        marginTop: 8,
        fontSize: 17,
        fontWeight: "400",
        color: "rgba(255, 255, 255, 1)",
        textAlign: 'center'
    },

    userLvlTxt: {
        marginTop: 3,
        fontSize: 17,
        fontWeight: "400",
        color: "rgba(255, 255, 255, 0.7)",
        textAlign: 'center'
    },

    rankContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    rankCircle: {
        marginTop: -15,
        borderRadius: 20,
        backgroundColor: "rgba(244,244,244,1)",
        borderWidth: 3.7,
        borderStyle: "solid",
        borderColor: "rgba(50,34,68,1)",
        width: 27.5,
        height: 27.5,
    },

    rankText: {
        fontSize: 14,
        fontWeight: "400",
        textAlign: "center",
    },

    crown: {
        width: 75,
        height: 75
    },

    allRankContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    rankPart1: {
        flexGrow: 1,
    },

    rankPart2: {
        flexGrow: 1,
    },

    rankPart3: {
        flexGrow: 4,
    },

    rankPart4: {
        flexGrow: 4
    },

    allRankTxt: {
        fontSize: 18,
    },

    rankPic: {
        width: 36,
        height: 36,
        borderRadius: 36,
    },
})