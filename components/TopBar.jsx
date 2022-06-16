import { StyleSheet, StatusBar, Image, Text, View, TouchableOpacity, Button, ScrollView } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from "../lib/supabase";
import MenuIcon from "./MenuIcon";
import Style from './Style';

export default function TopBar({ navigation }) {

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        console.log(error);
        navigation.navigate('Launchpage');

    }
    return (

        <SafeAreaView style={Style.topBar}>
            <StatusBar/>
            <TouchableOpacity onPress={()=> signOut()}>
                <MenuIcon/>
            </TouchableOpacity>
            <Text style={Style.topBarUsernameText}>User Name</Text>
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