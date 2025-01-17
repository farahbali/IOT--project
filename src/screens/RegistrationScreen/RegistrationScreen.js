import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles'; // Import the styles from styles.js
import { auth, db } from '../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingModal from '../../utils/LoadingModal';

export default function RegistrationScreen({ navigation }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onFooterLinkPress = () => {
        navigation.navigate('Login');
    };

    const onRegisterPress = async () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match.");
            return;
        }

        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Fetch ID token
            const idToken = await userCredential.user.getIdToken();

            // Prepare user data
            const data = {
                id: uid,
                email,
                fullName,
                token: idToken, // Include token in user data
            };

            // Store user data in Firestore
            await setDoc(doc(db, 'users', uid), data);

            // Save token and user data in AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(data));
            await AsyncStorage.setItem('idToken', idToken);

            // Optional: Save token in Firestore separately
            await updateDoc(doc(db, 'users', uid), { idToken });

            // Navigate to Settings screen
            navigation.navigate('Settings', { user: data });
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.image}
                    source={require('../../../assets/momBaby.png')}
                />
                <Text style={styles.welcomeText}>Create Your Account, Supermom!</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder="Password"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder="Confirm Password"
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={onRegisterPress}>
                    <Text style={styles.buttonTitle}>Create Account</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>
                        Already got an account?{' '}
                        <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                            Log in
                        </Text>
                    </Text>
                </View>
            </KeyboardAwareScrollView>
            <LoadingModal isVisible={isLoading} />
        </View>
    );
}
