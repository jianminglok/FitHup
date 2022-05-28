import React , { useState }from 'react';
import Feather from "react-native-vector-icons/Feather";
import colours from "../assets/colours/colours";
import Style from "./Style";

export default EyeIcon = () => {
    return(      
        <Feather
          name="menu"
          size={25}
          color={colours.text}
          style={Style.menu}
        />
    );
};