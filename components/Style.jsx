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
    marginVertical: StatusBar.currentHeight,
    justifyContent: 'center'
  },

  headerText: {
    color: colours.text,
    fontFamily: "MontserratBold",
    fontSize: 40,
    marginLeft: 27,
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
    marginLeft: 27,
    marginTop: 50,
  },

  rect: {
    backgroundColor: colours.tab,
    height: 45,
    borderRadius: 14,
    marginTop: 6,
    marginHorizontal: 27,
    justifyContent : 'center',
    alignItems: 'center',
    flexDirection: "row"
  },

  sampleEmail: {
    color: colours.text,
    fontFamily: "RobotoRegular",
    fontSize: 14,
    marginLeft: 19,
    flex: 1,
  },

  icon: {
    marginLeft: 19,
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
    marginLeft: 19,
    flex: 1
  },

  eye: {
    marginRight: 19
  },

  loginOrSignUpText: {
    color: colours.text,
    fontFamily: "RobotoMedium",
    fontSize: 16,
  },

  signUpOrLoginContainer: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  account: {
    color: colours.noAccount,
    fontFamily: "RobotoRegular",
    fontSize: 14,
  },

  signUpOrLogin: {
    color: colours.text,
    fontFamily: "RobotoRegular",
    fontSize: 14,
    marginLeft: 5
  },

  loginOrSignUpButtonContainer: {
    justifyContent: "flex-end",
    flex: 1,
    marginTop: 27,
    marginBottom: 50,
  },

  loginOrSignUpButton: {
    backgroundColor: colours.button,
    borderRadius: 14,
    height: 45,
    marginHorizontal: 27,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
