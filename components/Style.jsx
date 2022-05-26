
import {
  StatusBar,
  StyleSheet,
  
} from "react-native";
import colours from "../assets/colours/colours";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.tab,
  },

  header: {
    flex: 186 / 626,
    marginTop: StatusBar.currentHeight,
  },

  headerText: {
    color: colours.text,
    fontFamily: "MontserratBold",
    fontSize: 40,
    marginLeft: 27,
    marginBottom: 38,
  },

  body: {
    flex: 1,
    backgroundColor: colours.background,
    borderRadius: 20,
  },

  email: {
    color: colours.text,
    fontFamily: "RobotoRegular",
    fontSize: 12,
    marginTop: 86,
    marginLeft: 27,
  },

  rect: {
    backgroundColor: colours.tab,
    width: 321,
    height: 45,
    borderRadius: 14,
    marginTop: 6,
    marginLeft: 27,
  },

  sampleEmail: {
    color: colours.text,
    fontFamily: "RobotoRegular",
    fontSize: 14,
    marginLeft: 54,
    marginTop: 8,
  },

  icon: {
    marginLeft: 19,
    marginTop: 7,
    position: "absolute",
  },

  password: {
    color: colours.text,
    fontFamily: "RobotoRegular",
    fontSize: 12,
    marginTop: 12,
    marginLeft: 27,
  },

  samplePassword: {
    color: colours.text,
    fontFamily: "RobotoRegular",
    fontSize: 14,
    position: "absolute",
    marginLeft: 54,
    marginTop: 8,
  },

  eye: {
    marginTop: 9,
    marginLeft: 273,
  },

  loginOrSignUpText: {
    color: colours.text,
    fontFamily: "RobotoMedium",
    fontSize: 16,
    
  },

  account: {
    color: colours.noAccount,
    fontFamily: "RobotoRegular",
    fontSize: 14,
    marginLeft: 65,
    marginTop: 24,
    position: "absolute",
  },

  signUpOrLogin: {
    color: colours.text,
    fontFamily: "RobotoRegular",
    fontSize: 14,
    marginLeft: 215,
    marginTop: 24,
    position: "absolute",
  },

  loginOrSignUpButton: {
    backgroundColor: colours.button,
    marginLeft: 27,
    borderRadius: 14,
    width: 321,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
