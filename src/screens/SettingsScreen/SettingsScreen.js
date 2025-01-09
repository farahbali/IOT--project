import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity } from 'react-native';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './styles';

export default function SettingsScreen({ route, navigation }) {
    const { user } = route.params;
    const [maxTemperature, setMaxTemperature] = useState('30');
    const [minTemperature, setMinTemperature] = useState('23');
    const [motionEnabled, setMotionEnabled] = useState(false);
    const [notifEnabled, setNotifEnabled] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const settingsRef = doc(db, 'settings', user.id);
            const settingsDoc = await getDoc(settingsRef);
            if (settingsDoc.exists()) {
                const settingsData = settingsDoc.data();
                setMaxTemperature(settingsData.maxTemperature.toString());
                setMinTemperature(settingsData.minTemperature.toString());
                setMotionEnabled(settingsData.motion_enabled);
                setNotifEnabled(settingsData.notif_enabled);
            }
        };

        fetchSettings();
    }, [user.id]);

    const saveSettings = async () => {
        const settingsRef = doc(db, 'settings', user.id);
        const settingsData = {
            maxTemperature: parseFloat(maxTemperature),
            minTemperature: parseFloat(minTemperature),
            motion_enabled: motionEnabled,
            notif_enabled: notifEnabled,
            user_id: user.id,
            settings_id: Math.floor(Math.random() * 1000000), // Generate a random ID
            updated_at: serverTimestamp(), // Use Firebase server timestamp
        };

        try {
            await setDoc(settingsRef, settingsData);
            alert('Settings saved successfully!');
            navigation.navigate('Home', { user });
        } catch (error) {
            alert('Failed to save settings: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configure Baby Bed Settings</Text>

            <Text style={styles.label}>Max Temperature (°C):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={maxTemperature}
                onChangeText={setMaxTemperature}
            />

            <Text style={styles.label}>Min Temperature (°C):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={minTemperature}
                onChangeText={setMinTemperature}
            />

            <View style={styles.switchRow}>
                <Text style={styles.label}>Motion Detection Enabled:</Text>
                <Switch
                    value={motionEnabled}
                    onValueChange={setMotionEnabled}
                />
            </View>

            <View style={styles.switchRow}>
                <Text style={styles.label}>Notifications Enabled:</Text>
                <Switch
                    value={notifEnabled}
                    onValueChange={setNotifEnabled}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={saveSettings}>
                <Text style={styles.buttonText}>Save Settings</Text>
            </TouchableOpacity>
        </View>
    );
}
