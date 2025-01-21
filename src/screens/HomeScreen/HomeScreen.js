import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import 'firebase/firestore'; // For Firestore
import { db } from '../../firebase/config';


const HomeScreen = () => {
const [readings, setReadings] = useState([]);
useEffect(() => {
    const fetchReadings = async () => {
      console.log('Fetching readings...'); // Log when the fetch starts
  
      try {
        const readingsRef = collection(db, 'temperature_readings');
  
        const readingsQuery = query(readingsRef, orderBy('timestamp', 'desc'), limit(10));
  
        const querySnapshot = await getDocs(readingsQuery);
  
        console.log('Query Snapshot:', querySnapshot.docs);
  
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        console.log('Data fetched:', data); // Log the fetched data
        setReadings(data); // Assuming `setReadings` is defined
      } catch (error) {
        console.error('Error fetching readings:', error); // Log any errors
      }
    };
  
    fetchReadings();
  }, []);

  console.log('Readings state:', readings); // Log the current state

  return (
    <View>
      <Text>Temperature Readings</Text>
      <FlatList
        data={readings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>Temperature: {item.temperature}°C</Text>
            <Text>Timestamp: {item.timestamp}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;
