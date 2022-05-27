import React from 'react';
import Feather from "react-native-vector-icons/Feather";
import colours from "../assets/colours/colours";
import Style from "./Style";

export default MailIcon = () => {
    return(      
        <Feather
                name="mail"
                size={25}
                color={colours.text}
                style={Style.icon}
        />
    );
};