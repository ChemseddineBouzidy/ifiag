import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
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

  const [showFilters, setShowFilters] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [availableFields, setAvailableFields] = useState<any[]>([]);
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<any[]>([]);

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
      
      let updatedStudents;
      if (isRefresh) {
        updatedStudents = newStudents;
        setStudents(newStudents);
        setPage(2);
        setHasMore(!!data.data.next_page_url);
      } else {
        updatedStudents = [...students, ...newStudents];
        setStudents(updatedStudents);
        setPage((prev) => prev + 1);
        
        if (!data.data.next_page_url) {
          setHasMore(false);
        }
      }
      
  
      extractFilterOptions(updatedStudents);
      
      setErrors(null);
    } catch (error) {
      console.error('Error fetching students:', error);
      setErrors('Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const extractFilterOptions = (studentsList ) => {
    const fields: string[] = [];
    const classes: string[] = [];
    const statuses: string[] = [];
  
    for (const student of studentsList) {
      const fieldValue = student.field;
      if (fieldValue && !fields.includes(fieldValue)) {
        fields.push(fieldValue);
      }
  
      const classValue =  student.class;
      if (classValue && !classes.includes(classValue)) {
        classes.push(classValue);
      }
  
      const statusValue = student.status;
      if (statusValue && !statuses.includes(statusValue)) {
        statuses.push(statusValue);
      }
    }
  
    console.log('Extracted Fields:', fields);
    console.log('Extracted Classes:', classes);
    console.log('Extracted Statuses:', statuses);
  
    setAvailableFields(fields);
    setAvailableClasses(classes);
    setAvailableStatuses(statuses);
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
    let filtered = [...students]; 

    console.log('=== FILTER DEBUG ===');
    console.log('Total students:', students.length);
    console.log('Search term:', search);
    console.log('Selected field:', selectedField);
    console.log('Selected class:', selectedClass);
    console.log('Selected status:', selectedStatus);


    if (search.trim() !== '') {
      filtered = filtered.filter((student) => {
        const fullName = `${student.user?.first_name || ''} ${student.user?.last_name || ''}`.toLowerCase();
        const email = (student.user?.email || '').toLowerCase();
        const searchTerm = search.toLowerCase();
        
        return fullName.includes(searchTerm) || email.includes(searchTerm);
      });
      console.log('After search filter:', filtered.length);
    }

    // Apply field filter - Fixed to handle both object and string formats
    if (selectedField) {
      filtered = filtered.filter((student) => {
        const studentField =  student.field;
        console.log(`Student field: "${studentField}" vs Selected: "${selectedField}"`);
        return studentField === selectedField;
      });
      console.log('After field filter:', filtered.length);
    }


    if (selectedClass) {
      filtered = filtered.filter((student) => {
        const studentClass =  student.class;
        console.log(`Student class: "${studentClass}" vs Selected: "${selectedClass}"`);
        return studentClass === selectedClass;
      });
      console.log('After class filter:', filtered.length);
    }

 
    if (selectedStatus) {
      filtered = filtered.filter((student) => {
        const statusValue = student.status?.name || student.status;
        console.log(`Student status: "${statusValue}" vs Selected: "${selectedStatus}"`);
        return statusValue === selectedStatus;
      });
      console.log('After status filter:', filtered.length);
    }

    console.log('Final filtered count:', filtered.length);
    console.log('===================');

    setFilteredStudents(filtered);
  }, [search, students, selectedField, selectedClass, selectedStatus]);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ['#2563eb', '#7c3aed', '#dc2626', '#059669', '#ea580c', '#0891b2'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const clearFilters = () => {
    setSelectedField('');
    setSelectedClass('');
    setSelectedStatus('');
    setShowFilters(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedField) count++;
    if (selectedClass) count++;
    if (selectedStatus) count++;
    return count;
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtres</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            {/* Field Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Domaine d'étude</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
                <TouchableOpacity
                  style={[styles.filterOption, !selectedField && styles.filterOptionActive]}
                  onPress={() => setSelectedField('')}
                >
                  <Text style={[styles.filterOptionText, !selectedField && styles.filterOptionTextActive]}>
                    Tous
                  </Text>
                </TouchableOpacity>
                {availableFields.map((field, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.filterOption, selectedField === field && styles.filterOptionActive]}
                    onPress={() => setSelectedField(field)}
                  >
                    <Text style={[styles.filterOptionText, selectedField === field && styles.filterOptionTextActive]}>
                      {field}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Class Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Classe</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
                <TouchableOpacity
                  style={[styles.filterOption, !selectedClass && styles.filterOptionActive]}
                  onPress={() => setSelectedClass('')}
                >
                  <Text style={[styles.filterOptionText, !selectedClass && styles.filterOptionTextActive]}>
                    Toutes
                  </Text>
                </TouchableOpacity>
                {availableClasses.map((className, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.filterOption, selectedClass === className && styles.filterOptionActive]}
                    onPress={() => setSelectedClass(className)}
                  >
                    <Text style={[styles.filterOptionText, selectedClass === className && styles.filterOptionTextActive]}>
                      {className}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Status Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Statut</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
                <TouchableOpacity
                  style={[styles.filterOption, !selectedStatus && styles.filterOptionActive]}
                  onPress={() => setSelectedStatus('')}
                >
                  <Text style={[styles.filterOptionText, !selectedStatus && styles.filterOptionTextActive]}>
                    Tous
                  </Text>
                </TouchableOpacity>
                {availableStatuses.map((status, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.filterOption, selectedStatus === status && styles.filterOptionActive]}
                    onPress={() => setSelectedStatus(status)}
                  >
                    <Text style={[styles.filterOptionText, selectedStatus === status && styles.filterOptionTextActive]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Effacer tout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilters(false)}>
              <Text style={styles.applyButtonText}>Appliquer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderListItem = ({ item, index }) => {
    const fullName = `${item.user?.first_name || ''} ${item.user?.last_name || ''}`.trim();
    const initials = getInitials(item.user?.first_name, item.user?.last_name);
    const avatarColor = getAvatarColor(fullName);

    // Fixed to handle both object and string formats for display
    const fieldName = item.field?.name || item.field;
    const className = item.class?.name || item.class;

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
              {fieldName && (
                <Text style={[styles.badge, styles.fieldBadge]}>{fieldName}</Text>
              )}
              {className && (
                <Text style={[styles.badge, styles.classBadge]}>{className}</Text>
              )}
            </View>
            <Text style={styles.studentEmail}>{item.user?.email}</Text>
          </View>
          
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/Student/${item.user?.id}`)}>
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
        {search || getActiveFiltersCount() > 0 
          ? 'Modifiez vos critères de recherche ou filtres' 
          : 'Les étudiants apparaîtront ici une fois ajoutés'}
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
        onFilterPress={() => setShowFilters(true)}
        activeFiltersCount={getActiveFiltersCount()}
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

      {renderFilterModal()}
    </SafeAreaView>
  );
};

export default ListStudents;

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', 
    marginTop:33
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSection: {
    marginRight: 16,
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  infoSection: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
    gap: 4,
  },
  badge: {
    fontSize: 12,
    color: '#0284c7',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: '500',
  },
  fieldBadge: {
    color: '#047857',
    backgroundColor: '#d1fae5',
  },
  classBadge: {
    color: '#6d28d9',
    backgroundColor: '#ede9fe',
  },
  studentEmail: {
    fontSize: 13,
    color: '#475569',
  },
  actionSection: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  separator: {
    height: 8,
  },
  errorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    flex: 1,
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  loadingFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadingIndicator: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  loadingText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 34,
    color: '#94a3b8',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    height: 600
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  filterContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterOption: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterOptionActive: {
    backgroundColor: '#4f46e5',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#ffffff',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});