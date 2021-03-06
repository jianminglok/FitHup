import { createDrawerNavigator } from "@react-navigation/drawer";
import { useState, useEffect, useRef } from "react";
import { StyleSheet, StatusBar, Image, Text, View, TouchableOpacity, Button, Alert } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from "../lib/supabase";
import MenuIcon from "./MenuIcon";
import Style from './Style';
import { useDispatch, useSelector } from 'react-redux';
import { setName, setGender, setWeight, setHeight, setWeightTargets, setProfilePic, setLifestyleType, setDateOfBirth } from "../slices/profileSlice";
import { DrawerActions } from "@react-navigation/native";

export default function TopBar({ navigation }) {
    const mounted = useRef(false);

    const toggleDrawer = () => {
        navigation.dispatch(DrawerActions.toggleDrawer());
    }

    const dispatch = useDispatch();
    const { name, profilePic, BMI } = useSelector((state) => state.profile);

    const [loading, setLoading] = useState(false);

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

        const getProfile = async () => {
            try {
                setLoading(true);
                const user = supabase.auth.user();
                if (!user) throw new Error("No user on the session!");

                let { data, error, status } = await supabase
                    .from("profiles")
                    .select(`name, dateOfBirth, gender, weight, height, profilePic, lifestyleType`)
                    .eq("id", user.id)
                    .single();
                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    if (data.name) dispatch(setName(data.name));
                    if (data.dateOfBirth) dispatch(setDateOfBirth(data.dateOfBirth));
                    if (data.gender) dispatch(setGender(data.gender));
                    if (data.profilePic) downloadImage(data.profilePic);
                    if (data.weight) dispatch(setWeight(data.weight.toString()));
                    if (data.height) dispatch(setHeight(data.height.toString()));
                    if (data.weight && data.height) {
                        if (BMI < 18.5) {
                            dispatch(setWeightTargets(['Gain Weight']));
                        } else if (BMI > 24.9) {
                            dispatch(setWeightTargets(['Lose Weight']));
                        } else {
                            dispatch(setWeightTargets(['Maintain Weight', 'Lose Weight', 'Gain Weight']));
                        }
                    }
                    if (data.lifestyleType) dispatch(setLifestyleType(data.lifestyleType));
                }
            } catch (error) {
                console.log(error)
                Alert.alert((error).message);
            } finally {
                setLoading(false);
            }
        }

        //Get saved profile details
        if (mounted.current != false) {
            getProfile();
        }

        return () => { mounted.current = false; };
    }, []);

    return (
        <SafeAreaView style={Style.topBar}>
            <StatusBar />
            <TouchableOpacity onPress={() => toggleDrawer()}>
                <MenuIcon />
            </TouchableOpacity>
            <Text style={Style.topBarUsernameText}>{name}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SetupProfile")}>
                <Image
                    style={Style.topBarProfileIcon}
                    source={{
                        uri: profilePic,
                    }}
                />
            </TouchableOpacity>
        </SafeAreaView>
    );
}