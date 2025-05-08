import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    setDoc,
    updateDoc
  } from 'firebase/firestore';
  import { auth } from '../fireconfig';

// Define transaction type
type Transaction = {
    amount: number;
    description: string;
    date: Date;
};

// Web-friendly alert function
const showAlert = (title: string, message: string, onPress?: () => void) => {
    if (Platform.OS === 'web') {
        // Use browser's alert for web
        window.alert(`${title}: ${message}`);
        if (onPress) onPress();
    } else {
        // Use React Native's Alert for mobile
        Alert.alert(title, message, [{ text: 'OK', onPress }]);
    }
};

export default function AddTransactionScreen() {
    // Create a mock navigation object
    const navigation = {
        goBack: () => console.log('Simulating navigation back')
    };

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState(''); // For displaying messages on web

    // Handle transaction submission
    const handleAddTransaction = async() => {
        console.log('Add Transaction button clicked'); // Debug log

        // Validate inputs
        if (!amount || isNaN(Number(amount))) {
            showAlert('Error', 'Please enter a valid amount', undefined);
            setMessage('Error: Please enter a valid amount');
            return;
        }

        if (!description.trim()) {
            showAlert('Error', 'Please enter a transaction description', undefined);
            setMessage('Error: Please enter a transaction description');
            return;
        }

        // Create transaction object
        const transaction: Transaction = {
            amount: Number(amount),
            description: description.trim(),
            date: new Date()
        };

        // Simulate adding transaction
        const success = await addTransaction(transaction);

        if (success) {
            // Show success message
            showAlert('Success', 'Transaction added', () => {
                // Clear input fields
                setAmount('');
                setDescription('');
                setMessage('Transaction added successfully!');
                // Comment out actual navigation
                // navigation.goBack();
                console.log('Transaction added, form reset');
            });
        }
    };

    const addTransaction = async (transaction: Transaction) => {
        const user = auth.currentUser;
      
        if (!user) {
          showAlert('Error', 'User not authenticated');
          setMessage('Error: User not authenticated');
          return false;
        }
      
        try {
          const db = getFirestore();
          const transactionsRef = collection(db, 'usernames', user.uid, 'transactions');
          await addDoc(transactionsRef, {
            ...transaction,
            date: transaction.date.toISOString(), // Store as ISO string
          });
      
          console.log('Transaction successfully added to Firestore');
          return true;
        } catch (error) {
          console.error('Error adding transaction to Firestore:', error);
          showAlert('Error', 'Failed to add transaction');
          setMessage('Error: Failed to add transaction');
          return false;
        }
    };
    // Add transaction function with type
    /*const addTransaction = (transaction: Transaction) => {
        console.log('Adding transaction:', transaction);
        // Add code later to save transaction to Firebase

        // Simulate Firebase interaction
        console.log('Will connect to Firebase database in the future');
        console.log('Transaction data will be saved to user transaction records');
        console.log('Will also update user budget usage');

        // Always return success for now
        return true;
    };*/

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>Add New Transaction</Text>

                {/* Display message for web (error or success) */}
                {message ? (
                    <Text style={[
                        styles.message,
                        message.includes('Error') ? styles.errorMessage : styles.successMessage
                    ]}>
                        {message}
                    </Text>
                ) : null}

                {/* Amount input */}
                <Text style={styles.label}>Amount</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter amount"
                    placeholderTextColor="#777777"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                />

                {/* Description input */}
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter transaction description"
                    placeholderTextColor="#777777"
                    value={description}
                    onChangeText={setDescription}
                />

                {/* Add button */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddTransaction}
                    activeOpacity={0.7} // Make it more responsive visually
                >
                    <Text style={styles.buttonText}>Add Transaction</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#121212',
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        minHeight: 600,
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#1DB954', // Spotify green
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
        color: '#1DB954', // Green text
    },
    input: {
        borderWidth: 1,
        borderColor: '#333333',
        backgroundColor: '#333333',
        color: '#FFFFFF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#1DB954', // Green button
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#000000', // Black text on button
        fontWeight: 'bold',
        fontSize: 18,
    },
    message: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        textAlign: 'center',
    },
    errorMessage: {
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        color: '#ff6b6b',
    },
    successMessage: {
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        color: '#1DB954',
    },
});