import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const StudentFilters = () => {
  const [filters, setFilters] = useState({ fields: [] });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('fields'); // 'fields' or 'students'
  
  const fetchFields = async () => {
    
    setLoading(true);
    setError('');
    setStudents([]);

    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        setError('No access token found.');
        setLoading(false);
        return;
      }

      const response = await fetch(
        'https://ifiag.pidefood.com/api/students/filters/options',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setFilters({ fields: result.data.fields });
        setStep('fields');
      } else {
        setError('Failed to load filters.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsByField = async ({field}:any ) => {
    console.log('Selected field:', field); // 🐛 Debug line
  
    if (!field) {
      setError('Invalid field selected.');
      return;
    }
  
    setLoading(true);
    setError('');
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        setError('No access token found.');
        setLoading(false);
        return;
      }
  
      const url = `https://ifiag.pidefood.com/api/students?field=${encodeURIComponent(field)}`;
      console.log('Fetching from:', url); // 🐛 Debug line
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
      if (result.success) {
        setStudents(result.data);
        console.log(result.data); // 🐛 Debug line
        setStep('students');
      } else {
        setError('Failed to load students.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Button title="Load Fields" onPress={fetchFields} />

        {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}
        {error !== '' && <Text style={styles.error}>{error}</Text>}

        {step === 'fields' && filters.fields.length > 0 && (
          <>
            <Text style={styles.title}>Select a Field</Text>
            {filters.fields.map((field) => (
              <TouchableOpacity key={field} onPress={() => fetchStudentsByField(field)}>
                <Text style={styles.button}>{field}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {step === 'students' && (
          <>
            <Text style={styles.title}>Students</Text>
            {students.length === 0 ? (

              <Text>No students found.</Text>
            ) : (
              <FlatList
                data={students}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }: any) => (
                  <Text style={styles.item}>{item.user?.last_name || JSON.stringify(item)}</Text>
                )}
              />
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loading: {
    marginVertical: 20,
  },
  error: {
    color: 'red',
    marginVertical: 10,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    color: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    textAlign: 'center',
  },
  item: {
    paddingVertical: 5,
    fontSize: 14,
  },
});

export default StudentFilters;
