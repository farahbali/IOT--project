import { collection, getDocs, query, orderBy, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/config";

const temperatureDocumentPath = "temperature_readings";
const configurationDocumentPath = "configuration/default";
const notificationsCollection = 'notifications';

export const getTemperatureReadings = async () => {
    try {
        const q = query(
            collection(firestore, temperatureDocumentPath),
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Erreur lors de la récupération des relevés :", error);
        return [];
    }
};
export const getConfiguration = async () => {
    try {
        const configDoc = doc(firestore, configurationDocumentPath);
        const docSnap = await getDoc(configDoc);

        if (docSnap.exists()) {
            return docSnap.data(); // Retourne les données de la configuration
        } else {
            console.log("Le document de configuration n'existe pas !");
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la configuration :", error);
        throw error;
    }
};

// Sauvegarder la configuration dans Firestore
export const saveConfiguration = async (config: {
    temperatureMin: number;
    temperatureMax: number;
    allowNotifications: boolean;
    enableSensors: boolean;
}) => {
    try {
        const configDoc = doc(firestore, configurationDocumentPath);
        await setDoc(configDoc, config, { merge: true }); // Fusionne avec les données existantes
        console.log("Configuration sauvegardée avec succès !");
    } catch (error) {
        console.error("Erreur lors de la sauvegarde de la configuration :", error);
        throw error;
    }
};

export const getNotifications = async () => {
    try {
        const q = query(
            collection(firestore, notificationsCollection),
            orderBy("timestamp", "desc")
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

export const markNotificationAsRead = async (id:string) => {
    try {
        const notificationDoc = doc(collection(firestore, notificationsCollection), id);
        await updateDoc(notificationDoc, { read: true });
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};