import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import GridList from '../components/GridList';
import Header from '../components/Header';
import StudentCardsList from './test';

const ListStudents = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [grid, setGrid] = useState<any>(false);
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
          Authorization: `Bearer ${token}`,
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
      <Header grid={grid} setGrid={setGrid} />
   

      {errors && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errors}</Text>
        </View>
      )}

      <FlatList
        key={grid ? 'grid' : 'list'}
        data={students}
        renderItem={({ item }) => (
          <>
            {!grid ? (
              <StudentCardsList />
            ) : (
              <GridList student={item} />
            )}
          </>
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
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#1a73e8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  listContainer: {
    padding: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  avatarWrapper: {
    marginRight: 16,
  },
  avatar: {
    backgroundColor: '#1a73e8',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1a73e8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  email: {
    fontSize: 13,
    color: '#80868b',
  },
  actionButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#1a73e8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#fce8e6',
    padding: 12,
    margin: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fad2cf',
  },
  errorText: {
    color: '#d93025',
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarPROFILE: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 8,
  },
});
