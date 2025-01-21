import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './styles';

export default function NotificationScreen({ route, navigation }) {
  const { user } = route.params; // Correctly access user
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Set default loading to true

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationsRef = collection(db, 'notifications');
        const notificationsQuery = query(notificationsRef, orderBy('timestamp', 'desc'), limit(10));
        const querySnapshot = await getDocs(notificationsQuery);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const notificationDoc = doc(db, 'notifications', id);
      await updateDoc(notificationDoc, { read: true });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.read ? styles.readNotification : styles.unreadNotification,
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTimestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
      {!item.read && <Text style={styles.unreadLabel}>Unread</Text>}
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF7F50" style={{ marginVertical: 20 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ width: '100%' }}
        />
      )}
    </ScrollView>
  );
}
