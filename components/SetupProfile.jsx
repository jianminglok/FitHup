import { supabase } from '../lib/supabase'
import React, { useState, useCallback, useEffect, useRef } from "react"
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import colours from "../assets/colours/colours";
import { Alert, StyleSheet, StatusBar, Image, Text, View, TouchableOpacity, ScrollView, TextInput, Touchable } from "react-native"
import TopBar from './TopBar';
import { Dimensions } from "react-native";
import Style from './Style';
import Card from './Card';
import Button from "./Button";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { ApiError, Session } from "@supabase/supabase-js";
import { Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

var fullWidth = Dimensions.get('window').width; //full width

let customFonts = {
    'RobotoMedium': require("../assets/fonts/Roboto-Medium.ttf"),
    'RobotoRegular': require("../assets/fonts/Roboto-Regular.ttf"),
    'MontserratBold': require("../assets/fonts/Montserrat-Bold.ttf"),
};

export default function SetupProfile({ navigation, url, size }) {
    const [appIsReady, setAppIsReady] = useState(false);

    const [avatarUrl, setAvatarUrl] = useState(null)
    const [uploading, setUploading] = useState(false)

    const [loading, setLoading] = useState(false);
    const mounted = useRef(false);

    const [name, setName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(new Date());

    const [dateOpen, setDateOpen] = useState(false);

    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");

    const [genderOpen, setGenderOpen] = useState(false);
    const [gender, setGender] = useState(null);
    const [genderItems, setGenderItems] = useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
    ]);

    const [lifestyleOpen, setLifestyleOpen] = useState(false);
    const [lifestyleType, setLifestyleType] = useState(null);
    const [lifestyleItems, setLifestyleItems] = useState([
        { label: 'Sedentary', value: 'sedentary' },
        { label: 'Moderately Active', value: 'moderatelyActive' },
        { label: 'Active', value: 'active' },
        { label: 'Very Active', value: 'veryActive' }
    ]);

    const [image, setImage] = useState(null);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDateOpen(false);
        setDateOfBirth(currentDate);
    };

    const profileWeightInput = useRef();

    const myTheme = require("./my-theme.jsx");

    DropDownPicker.addTheme("MyThemeName", myTheme);
    DropDownPicker.setTheme("MyThemeName");

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
                const user = supabase.auth.user();
                if (!user) throw new Error("No user on the session!");

                let { data, error, status } = await supabase
                    .from("profiles")
                    .select(`name, dateOfBirth, gender, height, weight, lifestyleType, profilePic`)
                    .eq("id", user.id)
                    .single();
                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    if (data.name) setName(data.name);
                    if (data.dateOfBirth) setDateOfBirth(new Date(data.dateOfBirth));
                    if (data.gender) setGender(data.gender);
                    if (data.height) setHeight(data.height.toString());
                    if (data.weight) setWeight(data.weight.toString());
                    if (data.lifestyleType) setLifestyleType(data.lifestyleType);
                    console.log(data.profilePic)
                    if (data.profilePic) downloadImage(data.profilePic);
                }
            } catch (error) {
                Alert.alert((error).message);
            } finally {
                setLoading(false);
            }
        }

        prepare();
        getProfile();

        return () => { mounted.current = false; };
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

    async function downloadImage(path) {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path)
            if (error) {
                throw error
            }

            const fileReaderInstance = new FileReader();
            fileReaderInstance.readAsDataURL(data);
            fileReaderInstance.onload = () => {
                let base64data = fileReaderInstance.result;
                setImage(base64data)
            }

        } catch (error) {
            console.log('Error downloading image: ', error.message)
        }
    }


    async function updateProfile() {
        try {
            setLoading(true);
            const user = supabase.auth.user();
            if (!user) throw new Error("No user on the session!");

            const updates = {
                id: user.id,
                name,
                dateOfBirth: dateOfBirth.toISOString(),
                gender,
                height: parseFloat(height),
                weight: parseFloat(weight),
                lifestyleType,
            };

            const { data, error } = await supabase
                .from('profiles')
                .upsert(updates, { onConflict: 'id' })

            if (data) {
                Alert.alert('Profile successfully updated')
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
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);

            try {
                setUploading(true)

                const user = supabase.auth.user();
                if (!user) throw new Error("No user on the session!");

                const file = result.uri;
                const fileExt = file.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${fileName}`

                var formData = new FormData();
                formData.append("files", {
                    uri: result.uri,
                    name: fileName,
                    type: `image/${fileExt}`
                })

                let { data, error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, formData);

                if (data) {

                    const updates = {
                        id: user.id,
                        profilePic: filePath
                    };

                    const { data, error } = await supabase
                        .from('profiles')
                        .upsert(updates, { onConflict: 'id' })

                    if (data) {
                        Alert.alert('Profile picture successfully updated')
                    }

                    if (error) {
                        throw error;
                    }
                }

                if (uploadError) {
                    throw uploadError
                }
            } catch (error) {
                alert(error.message)
            } finally {
                setUploading(false)
            }
        }

    };

    return (
        <View style={Style.profileContainer} onLayout={onLayoutRootView}>
            <StatusBar />
            <TopBar />

            <View>
                {image ? (
                    <Image source={{ uri: image }} alt="Avatar" className="avatar image" style={{ width: 200, height: 200 }} />
                ) : (
                    <View className="avatar no-image" />
                )}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={[Style.loginOrSignUpButton]}><Button title="Pick an image from camera roll" onPress={pickImage} /></View>

                </View>

            </View>

            <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={true}
                contentContainerStyle={{ flexGrow: 1 }} >

                <SafeAreaView>
                    <Text style={Style.email}>Name</Text>
                    <View style={Style.rect}>
                        <MailIcon />
                        <TextInput
                            style={Style.sampleEmail}
                            placeholder="Enter your name"
                            placeholderTextColor={colours.text}
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="none"
                            returnKeyType="next"
                        />
                    </View>
                </SafeAreaView>

                <SafeAreaView>
                    <Text style={Style.password}>Date of Birth</Text>
                    <TouchableOpacity activeOpacity={1} style={Style.rect} onPress={() => setDateOpen(true)} >
                        <MailIcon />
                        <TextInput
                            style={Style.sampleEmail}
                            placeholder="Enter your date of birth"
                            placeholderTextColor={colours.text}
                            value={dateOfBirth.toLocaleDateString()}
                            editable={false}
                        />
                        {dateOpen && <DateTimePicker
                            value={dateOfBirth}
                            mode={'date'}
                            onChange={onDateChange}
                        />}

                    </TouchableOpacity>
                </SafeAreaView>

                <SafeAreaView style={{ zIndex: 1 }}>
                    <Text style={Style.password}>Gender</Text>
                    <View style={Style.rect}>
                        <MailIcon />
                        <DropDownPicker
                            open={genderOpen}
                            value={gender}
                            items={genderItems}
                            setOpen={setGenderOpen}
                            setValue={setGender}
                            setItems={setGenderItems}
                        />
                    </View>
                </SafeAreaView>

                <View style={{ flexDirection: 'row' }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <Text style={Style.password}>Height</Text>
                        <View style={Style.profileHeight}>
                            <MailIcon />
                            <TextInput
                                style={Style.sampleEmail}
                                keyboardType='number-pad'
                                placeholder="Height"
                                placeholderTextColor={colours.text}
                                value={height}
                                onChangeText={(height) => setHeight(height.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''))}
                                autoCapitalize="none"
                                onSubmitEditing={() => { profileWeightInput.current.focus() }}
                                returnKeyType="next"
                            />
                        </View>
                    </SafeAreaView>
                    <SafeAreaView style={{ flex: 1 }}>
                        <Text style={Style.profileWeightLabel}>Weight</Text>
                        <View style={Style.profileWeight}>
                            <MailIcon />
                            <TextInput
                                style={Style.sampleEmail}
                                keyboardType='number-pad'
                                placeholder="Weight"
                                value={weight}
                                placeholderTextColor={colours.text}
                                onChangeText={(weight) => setWeight(weight.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''))}
                                autoCapitalize="none"
                                returnKeyType="next"
                                ref={profileWeightInput}
                            />
                        </View>
                    </SafeAreaView>
                </View>

                <SafeAreaView style={{ zIndex: 1 }}>
                    <Text style={Style.password}>Type of Lifestyle</Text>
                    <View style={Style.rect}>
                        <MailIcon />
                        <DropDownPicker
                            open={lifestyleOpen}
                            value={lifestyleType}
                            items={lifestyleItems}
                            setOpen={setLifestyleOpen}
                            setValue={setLifestyleType}
                            setItems={setLifestyleItems}
                        />
                    </View>
                </SafeAreaView>

                <View style={[Style.loginOrSignUpButtonContainer]}>
                    <View style={[Style.loginOrSignUpButton]}>
                        <Button
                            title={"Save Profile"}
                            onPress={() => updateProfile()}
                        />
                    </View>
                </View>

            </KeyboardAwareScrollView>

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