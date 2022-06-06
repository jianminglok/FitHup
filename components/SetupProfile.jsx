import React, { useState, useRef } from "react";
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
import { supabase } from '../lib/supabase'
import UploadImage from "./UploadImage";
import BottomBar from "./BottomBar";
import SelectDropdown from "react-native-select-dropdown";
import Entypo from "react-native-vector-icons/Entypo";
import DateTimePicker from '@react-native-community/datetimepicker';


export default SetupProfile = ({ navigation }) => {

    const genders = ['Male', 'Female', 'Prefer not to say']
    const lifestyles = ['Sedentary', 'Moderately Active', 'Highly Active']

    const [loaded] = useFonts({
        RobotoMedium: require("../assets/fonts/Roboto-Medium.ttf"),
        RobotoRegular: require("../assets/fonts/Roboto-Regular.ttf"),
        MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
      });

      const [name, setName] = useState('');

      const [date, setDate] = useState(new Date());
      
      const [show, setShow] = useState(false);
      const [text, setText] = useState('DD/MM/YYYY');

      const onChange = (event, selectedDate) => {
          setShow(false);
          const currentDate = selectedDate || date;
          setDate(currentDate);
          let tempDate = new Date(currentDate);
          let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
          setText(fDate);
          

      }



      const [gender, setGender] = useState('');
      const [height, setHeight] = useState('');
      const [weight, setWeight] = useState('');
      const [lifestyle, setLifestyle] = useState('');

    return (
        <View style = {Style.profileContainer}>
            <StatusBar/>
            <Text style = {styles.header}>
                Setup Profile
            </Text>
            <UploadImage/>

            {/*Name Field */}
            <View>
                <Text style={[Style.email, {marginTop:18}]}>Name</Text>

                {/* Name Rectangle */}
                <View style={Style.rect}>
                    <TextInput
                        style={Style.sampleEmail}
                        placeholder="Enter your name"
                        placeholderTextColor={colours.text}
                        onChangeText={setName}
                        autoComplete= "name"
                    />
                </View>
            </View>

            {/*DOB Field */}
            <View>
                <Text style={[Style.email, {marginTop: 13}]}>Date of Birth</Text>

                {/* DOB Rectangle */}
                <View style={Style.rect}>
                    <Text
                        onPress= {() => setShow(true)}
                        style={Style.sampleEmail}
                    >{text}</Text>
                </View>

                {show &&(
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        display = 'default'
                        onChange={onChange}
                        
                />)}
            </View>

            {/*Gender Field */}
            <View>
                <Text style={[Style.email, {marginTop: 13}]}>Gender</Text>

                <SelectDropdown 
                    data = {genders}
                    buttonStyle = {styles.selection}
                    buttonTextStyle = {Style.sampleEmail}
                    renderDropdownIcon = {() => <Entypo 
                        name = "chevron-small-down"
                        size ={24}
                        color={colours.text}
                        
                        />}
                    dropdownIconPosition = "right"
                    onSelect={(selectedItem, index) => {
                        setGender(selectedItem)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                    
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        
                        return item
                    }}
                    rowStyle = {{backgroundColor:colours.background}}
                    rowTextStyle = {{color: colours.text}}

                />


            </View>

            <View>
                {/*Height Field */}
                <View >
                    <Text style={[Style.email, {marginTop: 13}]}>Height (cm)</Text>

                    {/* Height Rectangle */}
                    <View style={[Style.rect,{width:150}]}>
                        <TextInput
                            style={Style.sampleEmail}
                            placeholderTextColor={colours.text}
                            onChangeText={setHeight}
                        />
                    </View>
                </View>

                {/*Weight Field */}
                <View style = {{position : 'absolute',marginLeft: 178 }}>
                    <Text style={[Style.email, {marginTop: 13}]}>Weight (kg)</Text>

                    {/* Weight Rectangle */}
                    <View style={[Style.rect,{width:150}]}>
                        <TextInput
                            style={Style.sampleEmail}
                            placeholderTextColor={colours.text}
                            onChangeText={setWeight}
                        />
                    </View>
                </View>
            </View>

            {/*Lifestyle Field */}
            <View>
                <Text style={[Style.email, {marginTop: 13}]}>Type of Lifestyle</Text>

                <SelectDropdown 
                    data = {lifestyles}
                    buttonStyle = {styles.selection}
                    buttonTextStyle = {Style.sampleEmail}
                    renderDropdownIcon = {() => <Entypo 
                        name = "chevron-small-down"
                        size ={24}
                        color={colours.text}
                        
                        />}
                    dropdownIconPosition = "right"
                    onSelect={(selectedItem, index) => {
                        setLifestyle(selectedItem)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                    
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        
                        return item
                    }}
                    rowStyle = {{backgroundColor:colours.background}}
                    rowTextStyle = {{color: colours.text}}

                />
                
            </View>

            {/* Save Profile button */}
            <View style={[Style.loginOrSignUpButton, {marginTop: 20}]}>
                <Button 
                title={"Save Profile"} 
                onPress={() => navigation.navigate("TabStack")}
                />
            </View>



        </View>

    );
};    

const styles = StyleSheet.create({
    
    header : {
        color: colours.text,
        fontFamily: "MontserratBold",
        fontSize: 24,
        marginTop: 30,
        marginLeft : 27
        
        
    },

    selection: {
        backgroundColor: colours.tab,
        marginTop : 6,
        borderRadius: 14,
        marginHorizontal: 27,
        height : 45,


    }



});