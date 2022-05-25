import { Text, Button, View } from "react-native";
import { supabase } from '../lib/supabase'

export default function Homepage() {
    return (
        <View>
            <Text>Homepage</Text>
            <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
        </View>
    )
}