import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../fireconfig';
import { collection, query, getFirestore, doc, getDocs, where } from 'firebase/firestore';

const db = getFirestore();

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');

  const handleReset = async () => {
      if (!email|| !email.includes('@')) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
  
      try {
        await sendPasswordResetEmail(auth, email);
        Alert.alert('Check your inbox', 'A password reset email has been sent.');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
      />
      <Button title="Reset Password" onPress={handleReset} />
      <Button title="Back to Sign In" onPress={() => navigation.navigate('SignIn')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  input: {
    height: 40,
    borderColor: '#aaa',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
});
