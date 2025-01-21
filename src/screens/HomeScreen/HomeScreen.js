import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db,auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
const HomeScreen = ({ navigation }) => {
  const [temperatures, setTemperatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemperatures = async () => {
      try {
        const temperatureCollection = collection(db, 'temperature_readings');
        const querySnapshot = await getDocs(temperatureCollection);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id, 
          ...doc.data(), 
          timestamp: formatTimestamp(doc.data().timestamp),
        }));

        setTemperatures(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch temperature data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemperatures();
  }, []);

  const formatTimestamp = (timestamp) => {
    const milliseconds = timestamp * 1000; 
    const date = new Date(milliseconds);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleLogout =async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
  } catch (error) {
      alert(error.message);
  }
  }


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Temperature Readings</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : temperatures.length > 0 ? (
        <FlatList
          data={temperatures}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.temperature}>Temperature: {item.temperature}°C</Text>
              <Text style={styles.timestamp}>Date: {item.timestamp}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No temperature readings available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDF6F0',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF7F50',
  },
  loadingText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#555555',
    marginTop: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#cccccc',
    width: '100%',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF7F50',
  },
  timestamp: {
    fontSize: 14,
    color: '#2e2e2d',
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: '#FF7F50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginTop:20
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
