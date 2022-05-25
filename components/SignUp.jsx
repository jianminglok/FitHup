import React, { useState } from 'react'
import { Alert, StyleSheet, View, TouchableOpacity, Text, SafeAreaView, TextInput } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from "@rneui/themed";

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signUpWithEmail() {
    try {
      setLoading(true);

      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        throw error
      } else if (user) {
        Alert.alert("Successfully signed up. Please activate your account from your email.")
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, { marginLeft: 12, marginRight: 12 }]}>
        <Button
          onPress={() => signUpWithEmail()}
          style={[styles.verticallySpaced]}
          title="Sign Up"
        >
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})