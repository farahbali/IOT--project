import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import LoadingModal from '../../utils/LoadingModal';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onFooterLinkPress = () => {
        navigation.navigate('Registration');
    };

    const onLoginPress = async () => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Fetch the user document
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (!userDoc.exists()) {
                alert("User does not exist anymore.");
                return;
            }

            // Fetch ID token
            const idToken = await userCredential.user.getIdToken();

            // Store token and user data locally
            const userData = userDoc.data();
            userData.token = idToken; // Add token to userData for app-wide access if needed
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            await AsyncStorage.setItem('idToken', idToken); // Save token separately if preferred

            // Optional: Store token in Firebase
            await updateDoc(doc(db, 'users', uid), { idToken });

            // Navigate to Home
            navigation.navigate('Home', { user: userData });
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
                <Text style={styles.welcomeText}>Welcome Back, Supermom!</Text>
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
                <TouchableOpacity style={styles.button} onPress={onLoginPress}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>
                        Don't have an account?{' '}
                        <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                            Sign up
                        </Text>
                    </Text>
                </View>
            </KeyboardAwareScrollView>
            <LoadingModal isVisible={isLoading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FDF6F0',
    },
    image: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginVertical: 20,
    },
    welcomeText: {
        fontSize: 22,
        color: '#333333',
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: '600',
    },
    input: {
        height: 48,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 16,
        borderWidth: 1,
        borderColor: '#cccccc',
    },
    button: {
        backgroundColor: '#FF7F50',
        marginTop: 20,
        marginBottom: 20,
        height: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerView: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#2e2e2d',
    },
    footerLink: {
        color: '#FF7F50',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
