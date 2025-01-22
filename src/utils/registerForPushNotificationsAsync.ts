import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
        alert('Les notifications push ne fonctionnent que sur un appareil physique.');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        alert('Échec de l’obtention des permissions pour les notifications.');
        return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);

    if (Device.osName === 'Android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}
