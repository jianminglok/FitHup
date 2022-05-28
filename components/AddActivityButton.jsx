import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Button, Text } from 'react-native-elements';
import Modal from 'react-native-modal';
import colours from "../assets/colours/colours";
import Feather from "react-native-vector-icons/Feather";

export default AddActivityButton = ({ children, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.buttonStyle}>
            <View
                style={{
                    width: 70,
                    height: 70,
                }}>
                {children}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        height: 60,
        width: 60,
        backgroundColor: colours.button,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 25,
        marginLeft: 20,
        marginRight: 20
    }
});