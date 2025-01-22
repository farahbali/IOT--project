import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import { getNotifications } from "../services/firestoreService";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotificationsAsync";

interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    error: Error | null;
    allNotifications: any[];
    refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
                                                                              children,
                                                                          }) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] =
        useState<Notifications.Notification | null>(null);
    const [allNotifications, setAllNotifications] = useState<any[]>([]);
    const [error, setError] = useState<Error | null>(null);

    const notificationListener = useRef<Subscription>();
    const responseListener = useRef<Subscription>();

    const refreshNotifications = async () => {
        try {
            const notifications = await getNotifications();
            setAllNotifications(
                notifications
            );
        } catch (err) {
            setError(err);
        }
    };

    useEffect(() => {
        registerForPushNotificationsAsync().then(setExpoPushToken);

        refreshNotifications();

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
                Notifications.scheduleNotificationAsync({
                    content: {
                        title: notification.request.content.title || "Nouvelle notification",
                        body: notification.request.content.body || "",
                        data: notification.request.content.data || {},
                    },
                    trigger: null, 
                });
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log("Réponse à la notification :", response);
            });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(
                    notificationListener.current
                );
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    return (
        <NotificationContext.Provider
            value={{ expoPushToken, notification, error, allNotifications, refreshNotifications }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
