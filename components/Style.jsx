import {
  StatusBar,
  StyleSheet,

} from "react-native";
import colours from "../assets/colours/colours";
import { Dimensions } from "react-native";

var fullWidth = Dimensions.get('window').width; //full width

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
    justifyContent: 'center',
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

  topBar: {
    flexDirection: "row",
    marginVertical: StatusBar.currentHeight,
    marginHorizontal: 19,
    justifyContent: 'center',
    alignItems: 'center'
  },

  topBarProfileIcon: {
    height: 32,
    width: 32,
    justifyContent: "flex-end"
  },

  topBarUsernameText: {
    fontSize: 24,
    fontFamily: "RobotoMedium",
    fontWeight: "500",
    color: "rgba(255, 255, 255, 1)",
    textAlign: "center",
    justifyContent: "center",
    flex: 1
  },

  homepageContainer: {
    flex: 1,
    backgroundColor: colours.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "column",
  },

  homepageScrollview: {
    flex: 1,
    margin: 0
  },

  card: {
    borderRadius: 20,
    backgroundColor: "rgba(42,42,42,1)",
    shadowColor: "rgba(0,0,0,0.25)",
    elevation: 0,
    shadowOffset: { width: 0, height: 4 },
    width: fullWidth - 38,
    alignSelf: 'baseline',
    flexDirection: 'row'
  },

  cardBody: {
    margin: 19
  },

  cardTitle: {
    fontSize: 24,
    fontFamily: "MontserratBold",
    fontWeight: "700",
    color: colours.text,
  },

  cardDescription: {
    fontFamily: "RobotoRegular",
    fontSize: 16,
    color: colours.text,
    marginLeft: 5,
  },

  cardDescriptionBold: {
      fontFamily: "RobotoMedium",
      fontSize: 16,
      color: colours.text,
  },

  cardDescriptionContainer: {
      marginVertical: 15,
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1
  },

  profileContainer: {
    flex : 1,
    backgroundColor : colours.background,
  },

  profileDropdownContainer: {
    marginHorizontal: 27
  },

  dropdownText: {
    color: colours.text,
    fontFamily: "RobotoRegular",
    fontSize: 14,
    flex: 1,
    textAlign: 'left'
  },
});

export default styles;
