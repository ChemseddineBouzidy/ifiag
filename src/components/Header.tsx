import { useUserStore } from '@/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface HeaderProps {
  grid: boolean;
  setGrid: (value: boolean) => void;
  value: string;
  onChangeText: (text: string) => void;
  data: any[];
  setData: (data: any[]) => void;
  sortDirection: 'asc' | 'desc' | null;
  setSortDirection: (direction: 'asc' | 'desc' | null) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  grid, 
  setGrid, 
  value, 
  onChangeText, 
  data, 
  setData, 
  sortDirection, 
  setSortDirection 
}) => {
  const user = useUserStore(state => state.user);

  const sortData = () => {
    const sortedData = [...data].sort((a, b) => {
      const nameA = `${a.user?.first_name} ${a.user?.last_name}`.toLowerCase();
      const nameB = `${b.user?.first_name} ${b.user?.last_name}`.toLowerCase();
      return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    setData(sortedData);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Génération d'une couleur consistante basée sur le nom
  const avatarColor = useMemo(() => {
    const colors = [
      '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E',
      '#0EA5E9', '#10B981', '#F59E0B', '#EF4444',
      '#06B6D4', '#84CC16', '#F97316', '#EAB308'
    ];
    
    const fullName = `${user?.first_name}${user?.last_name}`;
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }, [user.first_name, user.last_name]);

  const getInitials = () => {
    const firstInitial = user?.first_name?.charAt(0)?.toUpperCase() || '';
    const lastInitial = user?.last_name?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  const getSortIcon = () => {
    if (!sortDirection) return 'swap-vertical-outline';
    return sortDirection === 'asc' ? 'arrow-up' : 'arrow-down';
  };

  return (
    <View style={styles.container}>
      {/* Avatar amélioré */}
      <View style={[styles.avatarContainer, { backgroundColor: avatarColor }]}>
        {!user.photo ? (
          <Image 
            source={{ uri: user.photo }} 
            style={styles.avatarImage}
            defaultSource={require('../../assets/images/default-avatar.png')}
          />
        ) : (
          <Text style={styles.avatarText}>{getInitials()}</Text>
        )}
        <View style={styles.onlineDot} />
      </View>

      {/* Barre de recherche améliorée */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un étudiant..."
            placeholderTextColor="#94A3B8"
            value={value}
            onChangeText={onChangeText}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {value.length > 0 && (
            <TouchableOpacity 
              onPress={() => onChangeText('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

    
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, sortDirection && styles.activeActionButton]} 
          onPress={sortData}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={getSortIcon()} 
            size={18} 
            color={sortDirection ? "#6366F1" : "#64748B"} 
          />
        </TouchableOpacity>
        
        <View style={styles.separator} />
        
        <TouchableOpacity
          style={[styles.actionButton, grid && styles.activeActionButton]}
          onPress={() => setGrid(!grid)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={grid ? "list" : "grid"}
            size={18}
            color={grid ? "#6366F1" : "#64748B"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',

  },

  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
   
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  onlineDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },


  searchContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '400',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },

  actionsContainer: {
    flexDirection: 'row',
    // backgroundColor: '#F8FAFC',
    // borderRadius: 14,
    // padding: 4,
    // borderWidth: 1,
    // borderColor: '#E2E8F0',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeActionButton: {
    backgroundColor: 'transpatents',
    color:'gray'
   
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
    alignSelf: 'center',
  },
});

export default Header;