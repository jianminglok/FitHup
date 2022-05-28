import React from "react"
import colours from "../assets/colours/colours";
import { StyleSheet, StatusBar, Image, Text, View, TouchableOpacity, Button, ScrollView } from "react-native"
import { Dimensions } from "react-native";
import Style from './Style';

var fullWidth = Dimensions.get('window').width; //full width

export default function Card({ style, children, cardTitle }) {
    return (
        <View style={[Style.card, style]}>
            <View style={Style.cardBody}>
                <Text style={Style.cardTitle}>{cardTitle}</Text>
                {children}
            </View>
        </View>
    )
}