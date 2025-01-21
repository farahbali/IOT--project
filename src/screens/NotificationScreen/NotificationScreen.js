import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity } from 'react-native';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './styles';

export default function NotficationScreen({ route, navigation }) {
    const { user } = route.params;
    const [temperatureMax, setTemperatureMax] = useState('34');
    const [temperatureMin, setTemperatureMin] = useState('30');
    const [enableSensors, setEnableSensors] = useState(false);
    const [allowNotifications, setAllowNotifications] = useState(false);

    useEffect(() => {
        const fetchConfiguration = async () => {
            const configRef = doc(db, 'configuration', user.id);
            const configDoc = await getDoc(configRef);
            if (configDoc.exists()) {
                const configData = configDoc.data();
                setTemperatureMax(configData.temperatureMax.toString());
                setTemperatureMin(configData.temperatureMin.toString());
                setEnableSensors(configData.enableSensors);
                setAllowNotifications(configData.allowNotifications);
            }
        };

        fetchConfiguration();
    }, [user.id]);

    const saveConfiguration = async () => {
        const configRef = doc(db, 'configuration', user.id);
        const configData = {
            temperatureMax: parseFloat(temperatureMax),
            temperatureMin: parseFloat(temperatureMin),
            enableSensors,
            allowNotifications,
        };

        try {
            await setDoc(configRef, configData);
            alert('Configuration saved successfully!');
            navigation.navigate('Home', { user });
        } catch (error) {
            alert('Failed to save configuration: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configure Baby Bed Settings</Text>

            <Text style={styles.label}>Max Temperature (°C):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={temperatureMax}
                onChangeText={setTemperatureMax}
            />

            <Text style={styles.label}>Min Temperature (°C):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={temperatureMin}
                onChangeText={setTemperatureMin}
            />

            <View style={styles.switchRow}>
                <Text style={styles.label}>Enable Sensors:</Text>
                <Switch
                    value={enableSensors}
                    onValueChange={setEnableSensors}
                />
            </View>

            <View style={styles.switchRow}>
                <Text style={styles.label}>Allow Notifications:</Text>
                <Switch
                    value={allowNotifications}
                    onValueChange={setAllowNotifications}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={saveConfiguration}>
                <Text style={styles.buttonText}>Save Configuration</Text>
            </TouchableOpacity>
        </View>
    );
}