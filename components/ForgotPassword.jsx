import React, { useState } from 'react'
import { Alert, StyleSheet, SafeAreaView, View, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from 'react-native-elements'

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendResetEmail() {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.api
        .resetPasswordForEmail(email)

      if (error) {
        throw error
      } else if (data) {
          Alert.alert("Password reset email sent successfully");
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
      <View style={[styles.verticallySpaced, styles.mt20, { marginLeft: 12, marginRight: 12 }]}>
        <Button title="Continue" disabled={loading} onPress={() => sendResetEmail()} />
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