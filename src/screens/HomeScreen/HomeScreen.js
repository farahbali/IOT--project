import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const HomeScreen = () => {
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

  return (
    <View style={styles.container}>
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
              <Text style={styles.id}>Document ID: {item.id}</Text>
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
    backgroundColor: '#FDF6F0', // Soft feminine background color
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF7F50', // Coral color for a feminine, vibrant look
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
    color: '#FF7F50', // Matching the button color
  },
  id: {
    fontSize: 14,
    color: '#2e2e2d',
    marginTop: 5,
  },
});

export default HomeScreen;
