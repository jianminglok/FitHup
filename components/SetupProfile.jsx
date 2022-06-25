import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    Alert,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import colours from "../assets/colours/colours";
import { useFonts } from "expo-font";
import Style from "./Style";
import Button from "./Button";
import { supabase } from '../lib/supabase';
import UploadImage from "./UploadImage";
import SelectDropdown from "react-native-select-dropdown";
import Entypo from "react-native-vector-icons/Entypo";
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { useDispatch, useSelector } from 'react-redux';
import { setName } from "../slices/profileSlice";

let customFonts = {
    'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
    'RobotoRegular': require("../assets/fonts/Roboto-Regular.ttf"),
    'MontserratBold': require("../assets/fonts/Montserrat-Bold.ttf"),
};

export default SetupProfile = ({ navigation }) => {
    const [appIsReady, setAppIsReady] = useState(false);
    const mounted = useRef(false);

    const dispatch = useDispatch();
    const { name } = useSelector((state) => state.profile);

    state = {
        fontsLoaded: false
    }

    const genders = ['Male', 'Female', 'Prefer not to say']
    const lifestyles = ['Sedentary', 'Moderately Active', 'Active', 'Highly Active']

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false)

    const [date, setDate] = useState(new Date());

    const [dateShow, setDateShow] = useState(false);
    const [dateText, setDateText] = useState('DD/MM/YYYY');

    const onChange = (event, selectedDate) => {
        setDateShow(false);
        const currentDate = selectedDate || date;
        setDate(currentDate);
        let tempDate = new Date(currentDate);
        //Convert date to a readable format
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        setDateText(fDate);
    }

    const [gender, setGender] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [lifestyle, setLifestyle] = useState('');

    const profileWeightInput = useRef();

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
                    .select(`name, dateOfBirth, gender, height, weight, lifestyleType, profileSetup`)
                    .eq("id", user.id)
                    .single();
                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    if (!data.profileSetup) {
                        setEditing(true);
                    }
                    if (data.name) dispatch(setName(data.name));
                    if (data.dateOfBirth) {
                        setDate(new Date(data.dateOfBirth));
                        let tempDate = new Date(data.dateOfBirth);
                        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
                        setDateText(fDate);
                    }
                    if (data.gender) setGender(data.gender);
                    if (data.height) setHeight(data.height.toString());
                    if (data.weight) setWeight(data.weight.toString());
                    if (data.lifestyleType) setLifestyle(data.lifestyleType);
                }
            } catch (error) {
                Alert.alert((error).message);
            } finally {
                setLoading(false);
            }
        }

        prepare();
        //Get saved profile details
        if (mounted.current != false) {
            getProfile();
        }

        return () => { mounted.current = false; };
    }, []);

    //Setup or update profile details
    async function updateProfile() {
        let success = false;
        try {
            setLoading(true);
            const user = supabase.auth.user();
            if (!user) throw new Error("No user on the session!");

            if (!weight) {
                throw new Error('Weight is required!')
            }

            const updates = {
                id: user.id,
                name,
                dateOfBirth: date.toISOString(),
                gender,
                height: parseFloat(height),
                weight: parseFloat(weight),
                lifestyleType: lifestyle,
                profileSetup: true
            };

            const { data, error } = await supabase
                .from('profiles')
                .upsert(updates, { onConflict: 'id' })

            if (data) {
                Alert.alert('Profile successfully updated')
                success = true;
            }

            if (error) {
                throw error;
            }
        } catch (error) {
            if ((error).message.includes("username_length")) {
                Alert.alert('Name has to be at least 3 characters');
            } else {
                Alert.alert((error).message);
            }
        } finally {
            setLoading(false);
            if (success) {
                navigation.navigate("TabStack");
            }
        }
    }

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
            <Text style={styles.header}>
                {editing ? 'Setup Profile' : 'Profile'}
            </Text>

            <KeyboardAwareScrollView>
                <UploadImage />

                {/*Name Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 18 }]}>Name</Text>

                    {/* Name Rectangle */}
                    <View style={Style.rect}>
                        <TextInput
                            testId="nameField"
                            style={Style.sampleEmail}
                            placeholder="Enter your name"
                            placeholderTextColor={colours.text}
                            onChangeText={(text) => dispatch(setName(text))}
                            autoComplete="name"
                            editable={editing}
                            value={name}
                        />
                    </View>
                </View>

                {/*DOB Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 13 }]}>Date of Birth</Text>

                    {/* DOB Rectangle */}
                    <View style={Style.rect}>
                        <Text
                            onPress={() => setDateShow(true)}
                            style={Style.sampleEmail}>
                            {dateText}
                        </Text>
                    </View>

                    {dateShow && (
                        <DateTimePicker
                            testID="dateField"
                            value={date}
                            display='default'
                            onChange={onChange}
                            disabled={!editing}
                        />)}
                </View>

                {/*Gender Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 13 }]}>Gender</Text>

                    <View style={Style.profileDropdownContainer}>
                        <SelectDropdown
                            testID="genderField"
                            data={genders}
                            defaultButtonText={'Select gender'}
                            buttonStyle={styles.selection}
                            buttonTextStyle={Style.dropdownText}
                            renderDropdownIcon={() => <Entypo
                                name="chevron-small-down"
                                size={24}
                                color={colours.text}

                            />}
                            dropdownIconPosition="right"
                            onSelect={(selectedItem, index) => {
                                setGender(selectedItem)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                            rowTextForSelection={(item, index) => item}
                            rowStyle={{ backgroundColor: colours.background }}
                            rowTextStyle={Style.dropdownText}
                            disabled={!editing}
                            defaultValue={gender}
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    {/*Height Field */}
                    <View style={{ flex: 1 }}>
                        <Text style={[Style.email, { marginTop: 13 }]}>Height (cm)</Text>
                        {/* Height Rectangle */}
                        <View style={[Style.rect, { marginRight: 5 }]}>
                            <TextInput
                                testID="heightField"
                                style={[Style.sampleEmail]}
                                keyboardType='number-pad'
                                placeholder="Height"
                                placeholderTextColor={colours.text}
                                value={height}
                                onChangeText={(height) => setHeight(height.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''))}
                                autoCapitalize="none"
                                onSubmitEditing={() => { profileWeightInput.current.focus() }}
                                returnKeyType="next"
                                editable={editing}
                            />
                        </View>
                    </View>
                    {/*Weight Field */}
                    <View style={{ flex: 1 }}>
                        <Text style={[Style.email, { marginTop: 13, marginLeft: 5 }]}>Weight (kg)</Text>
                        {/* Weight Rectangle */}
                        <View style={[Style.rect, { marginLeft: 5 }]}>
                            <TextInput
                                testID="weightField"
                                style={Style.sampleEmail}
                                keyboardType='number-pad'
                                placeholder="Weight"
                                value={weight}
                                placeholderTextColor={colours.text}
                                onChangeText={(weight) => setWeight(weight.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''))}
                                autoCapitalize="none"
                                returnKeyType="next"
                                ref={profileWeightInput}
                                editable={editing}
                            />
                        </View>
                    </View>
                </View>

                {/*Lifestyle Field */}
                <View>
                    <Text style={[Style.email, { marginTop: 13 }]}>Type of Lifestyle</Text>

                    <View style={Style.profileDropdownContainer}>
                        <SelectDropdown
                            testId="lifestyleField"
                            data={lifestyles}
                            defaultButtonText={'Select type of lifestyle'}
                            buttonStyle={styles.selection}
                            buttonTextStyle={Style.dropdownText}
                            renderDropdownIcon={() => <Entypo
                                name="chevron-small-down"
                                size={24}
                                color={colours.text}
                            />}
                            dropdownIconPosition="right"
                            onSelect={(selectedItem, index) => {
                                setLifestyle(selectedItem)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                            rowTextForSelection={(item, index) => item}
                            rowStyle={{ backgroundColor: colours.background }}
                            rowTextStyle={Style.dropdownText}
                            disabled={!editing}
                            defaultValue={lifestyle}
                        />
                    </View>
                </View>

                {/* Save Profile button */}
                <View style={[Style.loginOrSignUpButton, { marginVertical: 20 }]}>
                    <Button
                        testID="saveProfileBtn"
                        title={editing ? "Save Profile" : 'Edit Profile'}
                        onPress={() => editing ? updateProfile() : setEditing(true)}
                    />
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({

    header: {
        color: colours.text,
        fontFamily: "MontserratBold",
        fontSize: 24,
        marginTop: 30,
        marginLeft: 27
    },

    selection: {
        backgroundColor: colours.tab,
        marginTop: 6,
        borderRadius: 14,
        height: 45,
        width: '100%'
    },

});
