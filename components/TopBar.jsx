import { createDrawerNavigator } from "@react-navigation/drawer";
import { useState, useEffect, useRef } from "react";
import { StyleSheet, StatusBar, Image, Text, View, TouchableOpacity, Button, Alert } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from "../lib/supabase";
import MenuIcon from "./MenuIcon";
import Style from './Style';
import { useDispatch, useSelector } from 'react-redux';
import { setName } from "../slices/nameSlice";

export default function TopBar({ navigation }) {
    const mounted = useRef(false);

    const toggleDrawer = () => {
        navigation.toggleDrawer();
    }

    const dispatch = useDispatch();
    const { name } = useSelector((state) => state.name);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        mounted.current = true;

        const getProfile = async () => {
            try {
                setLoading(true);
                const user = supabase.auth.user();
                if (!user) throw new Error("No user on the session!");

                let { data, error, status } = await supabase
                    .from("profiles")
                    .select(`name`)
                    .eq("id", user.id)
                    .single();
                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    if (data.name) dispatch(setName(data.name));
                }
            } catch (error) {
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
                        uri: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/e00gxd21wgj-10%3A212?alt=media&token=0b84b92e-ad6d-4f45-a1a5-2c519feb85fb",
                    }}
                />
            </TouchableOpacity>
        </SafeAreaView>
    );
}