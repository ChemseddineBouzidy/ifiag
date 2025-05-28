import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import GridList from '../../src/components/GridList';
import Header from '../../src/components/Header';

const { width } = Dimensions.get('window');

const ListStudents = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [grid, setGrid] = useState<any>(true);
  const [students, setStudents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errors, setErrors] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [sortDirection, setSortDirection] = useState('asc');

  const list = async (isRefresh = false) => {
    if (loading || (!hasMore && !isRefresh)) return;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        setErrors('Token d\'authentification manquant');
        setLoading(false);
        return;
      }

      const currentPage = isRefresh ? 1 : page;
      const response = await fetch(`${BASE_URL}/api/students?page=${currentPage}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrors('Session expirée. Veuillez vous reconnecter');
          setLoading(false);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newStudents = data.data.data;
      
      if (isRefresh) {
        setStudents(newStudents);
        setPage(2);
        setHasMore(!!data.data.next_page_url);
      } else {
        setStudents((prev) => [...prev, ...newStudents]);
        setPage((prev) => prev + 1);
        
        if (!data.data.next_page_url) {
          setHasMore(false);
        }
      }
      
      setErrors(null);
    } catch (error) {
      console.error('Error fetching students:', error);
      setErrors('Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    list(true);
  };

  useEffect(() => {
    list();
  }, []);
 
  useEffect(() => {
    const timeout = setTimeout(() => setSearch(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);
  
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredStudents(students); 
      return;
    }
  
    const filtered = students.filter((student) =>
      `${student.user.first_name} ${student.user.last_name}`.toLowerCase().includes(search.toLowerCase())
    );
  
    setFilteredStudents(filtered);
  }, [search, students]);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ['#2563eb', '#7c3aed', '#dc2626', '#059669', '#ea580c', '#0891b2'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const renderListItem = ({ item, index }) => {
    const fullName = `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim();
    const initials = getInitials(item.user.first_name, item.user.last_name);
    const avatarColor = getAvatarColor(fullName);

    return (
      <TouchableOpacity style={styles.studentCard} activeOpacity={0.7}>
        <View style={styles.cardContent}>
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.statusDot} />
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.studentName}>{fullName}</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badge}>Étudiant</Text>
            </View>
            <Text style={styles.studentEmail}>{item.user.email}</Text>
          </View>
          
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Voir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>📚</Text>
      </View>
      <Text style={styles.emptyTitle}>Aucun étudiant trouvé</Text>
      <Text style={styles.emptySubtitle}>
        {search ? 'Modifiez vos critères de recherche' : 'Les étudiants apparaîtront ici une fois ajoutés'}
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <Header 
        grid={grid} 
        setGrid={setGrid} 
        value={query}  
        onChangeText={setQuery}
        data={filteredStudents}
        setData={setFilteredStudents}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />

      {errors && (
        <View style={styles.errorContainer}>
          <View style={styles.errorBanner}>
            <Ionicons name="alert" size={24} color="#ef4444" />
            <Text style={styles.errorText}>{errors}</Text>
          </View>
        </View>
      )}

      <FlatList
        key={grid ? 'grid' : 'list'}
        data={filteredStudents}
        renderItem={grid ? ({ item }) => <GridList student={item} /> : renderListItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={grid ? 2 : 1}
        contentContainerStyle={[
          styles.listContainer,
          filteredStudents.length === 0 && styles.emptyContainer
        ]}
        showsVerticalScrollIndicator={false}
        onEndReached={() => list()}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
            tintColor="#2563eb"
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={() =>
          loading && filteredStudents.length > 0 ? (
            <View style={styles.loadingFooter}>
              <View style={styles.loadingIndicator}>
                <Text style={styles.loadingText}>Chargement...</Text>
              </View>
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default ListStudents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  studentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarSection: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  infoSection: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badge: {
    fontSize: 12,
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontWeight: '500',
    overflow: 'hidden',
  },
  studentEmail: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
  },
  actionSection: {
    marginLeft: 8,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    height: 8,
  },
  errorContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadingIndicator: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 28,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});