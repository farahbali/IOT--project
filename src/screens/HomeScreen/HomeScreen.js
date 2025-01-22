import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NotificationProvider } from '@/context/NotificationContext'; 

export default function HomeScreen() {
    return (
        <NotificationProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: { backgroundColor: '#f8f8f8' },
                    tabBarActiveTintColor: '#007AFF',
                    tabBarInactiveTintColor: '#8e8e93',
                }}
            >
                {/* Measurements Tab */}
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Mesures',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="thermometer" size={size} color={color} />
                        ),
                    }}
                />

                {/* Configuration Tab */}
                <Tabs.Screen
                    name="configuration"
                    options={{
                        title: 'Configuration',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="cog" size={size} color={color} />
                        ),
                    }}
                />

                {/* Notifications Tab */}
                <Tabs.Screen
                    name="notifications"
                    options={{
                        title: 'Notifications',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="bell" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </NotificationProvider>
    );
}
