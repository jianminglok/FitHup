import React, { useState } from 'react'
import { Alert, StyleSheet, SafeAreaView, View, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from 'react-native-elements';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail({ navigate }) {
    try {
      setLoading(true);

      if (!email || !password) return

      const { user, error } = await supabase.auth.signIn({
        email: email,
        password: password,
      });

      if (error) {
        throw error
      } else if (user) {
        Alert.alert("Successfully logged in");
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
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20, { marginLeft: 12, marginRight: 12 }]}>
        <Button title="Login" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View style={[styles.verticallySpaced, { marginLeft: 12, marginRight: 12 }]}>
        <Button title="Sign Up" disabled={loading} onPress={() => navigation.navigate('Sign Up')} />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20, { marginLeft: 12, marginRight: 12 }]}>
        <Text onPress={() => navigation.navigate('Forgot Password')}>Forgot Password?</Text>
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