import React, { useState, useEffect, useRef } from "react"
import { supabase } from '../lib/supabase'
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import colours from "../assets/colours/colours";
import { FloatingAction } from "react-native-floating-action";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default AddActivityButton = ({ navigation }) => {
    const user = supabase.auth.user();
    const [appIsReady, setAppIsReady] = useState(false);
    const mounted = useRef(false);
    const [loading, setLoading] = useState(false);
    const [target, setTarget] = useState();

    const actions = [
      {
        text: "Exercise",
        icon: <FontAwesome5
          name="dumbbell"
          size={20}
          style={{ transform: [{ rotateZ: '-25deg' }], position: 'absolute', alignSelf: 'center' }}
          color={colours.button}
        />,
        name: "ActivityLoggerExercise",
        position: 1,
      },

      {
        text: "Dietary Intake",
        icon: require("../assets/images/Calorie_red.png"),
        name: "ActivityLoggerCalorie",
        position: 2
      },
    ];
  
    useEffect(() => {
      mounted.current = true;
      async function getTarget() {
        try {
            setLoading(true);
            if (!user) throw new Error("No user on the session!");

            const { data, error } = await supabase
                .from('target')
                .select('targetType')
                .eq('id', user.id)


            if (data) {
              
                if (data.length === 0) {
                    setTarget(false)

                }
                else {
                  setTarget(true)
                }
            } else if (error) {
                throw error;
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
      }
      if (mounted.current != false) {
        getTarget();
      }
      return () => {
        mounted.current = false;
      };
    }, [user]);
  
  return (
    <View>
      <FloatingAction
        actions={actions}
        onPressItem={(name) => {
          if (target) {
            navigation.push(name)
          }
          else {
            Alert.alert("Please set up your target before adding an activity")
            navigation.navigate('SetupTarget')
          }
        }}
        color={colours.button}
        tintColor={colours.button}
        distanceToEdge= {{vertical: 0, horizontal: -25}}
        buttonSize={60}
        iconHeight={25}
        iconWidth={25}

      >
      </FloatingAction>
    </View>
  );
}