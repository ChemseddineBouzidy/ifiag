// import { BASE_URL } from '@env';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React, { useEffect, useState } from 'react';
// import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// const ListStudents = () => {
//   const [grid, setGrid] = useState(false);
//   const [errors, setErrors] = useState<any>({});
//   const [Students, setStudents] = useState<any>({});

  
//   const list = async () => {
//     try {
//       const token = await AsyncStorage.getItem('access_token');
//       if (!token) {
//         setErrors('No authentication token found');
//         return;
//       }

//       const response = await fetch(`${BASE_URL}/api/students`, {
//         method: 'GET', 
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           setErrors('Session expired. Please login again');
//           return;
//         }
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('Students data:', data);
//       setStudents(data.data.data); 
//     } catch (error) {
//       console.error('Error fetching students:', error);
//       setErrors('Failed to fetch students data');
//     }
//   }
//   useEffect(() => {
//     list()
//     console.log(list())
//   }, [])
  
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>List Students</Text>
//         <TouchableOpacity
//           style={styles.gridToggle}
//           onPress={() => setGrid(!grid)}
//         >
//           <Text style={styles.gridToggleText}>
//             {grid ? 'List View' : 'Grid View'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//       <FlatList
//         key={grid ? 'grid' : 'list'} 
//         data={Students}
//         renderItem={({ item }) => (
//           <View style={[styles.itemContainer, { width: grid ? '48%' : '100%' }]}>
//             <Text style={styles.text}>{item.id} {item.last_name}</Text>
//           </View>
//         )}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={grid ? 2 : 1}
//         contentContainerStyle={styles.listContainer}
//         initialNumToRender={5}
//         maxToRenderPerBatch={5}
//         windowSize={5}
//         onEndReached={list}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={() => (
//           <View style={styles.loadingContainer}>
//             <Text style={styles.loadingText}>Loading more...</Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   )
// }

// export default ListStudents

// const styles = StyleSheet.create({
//   text: {
//     fontSize: 16,
//     padding: 15,
//     margin: 15,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   listContainer: {
//     padding: 10,
//   },
//   itemContainer: {
//     flex: 1,
//     margin: 5,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   loadingContainer: {
//     padding: 10,
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 14,
//     color: '#666',
//   },
// })
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ListStudents = () => {
  const [grid, setGrid] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>(null);

  const list = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        setErrors('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/students?page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrors('Session expired. Please login again');
          setLoading(false);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Students data:', data);

      const newStudents = data.data.data;
      setStudents((prev) => [...prev, ...newStudents]);
      setPage((prev) => prev + 1);

      if (!data.data.next_page_url) {
        setHasMore(false);
      }

    } catch (error) {
      console.error('Error fetching students:', error);
      setErrors('Failed to fetch students data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    list();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>List Students</Text>
        <TouchableOpacity
          style={styles.gridToggle}
          onPress={() => setGrid(!grid)}
        >
          <Text style={styles.gridToggleText}>
            {grid ? 'List View' : 'Grid View'}
          </Text>
        </TouchableOpacity>
      </View>

      {errors && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errors}</Text>
        </View>
      )}

      <FlatList
        key={grid ? 'grid' : 'list'}
        data={students}
        renderItem={({ item }) => (
          <View style={[styles.itemContainer, { width: grid ? '48%' : '100%' }]}>
            <Text style={styles.text}>{item.id} {item.last_name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={grid ? 2 : 1}
        contentContainerStyle={styles.listContainer}
        onEndReached={list}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading more...</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default ListStudents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  gridToggle: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  gridToggleText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    padding: 15,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
  },
});
