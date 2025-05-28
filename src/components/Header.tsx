import { useUserStore } from '@/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


const Header = ({ grid, setGrid, value, onChangeText, data, setData, sortDirection, setSortDirection }: any) => {
  const user = useUserStore(state => state.user);
  const trie = () => {

    const sortedData = [...data].sort((a, b) => {
      const nameA = `${a.user.first_name} ${a.user.last_name}`.toLowerCase();
      const nameB = `${b.user.first_name} ${b.user.last_name}`.toLowerCase();
      return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    setData(sortedData);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  }
  const getAvatar = () => {
    return <Text style={styles.avatarText}>{user.first_name.charAt(0, 3).toUpperCase()} {user.last_name.charAt(0, 3).toUpperCase()}</Text>

  }
  const generateColor = (name: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
      '#E67E22', '#2ECC71', '#F1C40F', '#1ABC9C'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  return (
    <View style={styles.container}>
      <View style={[styles.profilePic, { backgroundColor: generateColor(user.first_name) }]}>
        {user.photo ? (
          getAvatar()
        ) : (
          <Image 
            source={require('../../assets/images/default-avatar.png')} 
            style={styles.profilePic} 
          />
        )}
      </View>


      <View style={[styles.searchBar, { backgroundColor: 'white' }]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search un etudiant.."
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#F26407" />
        </TouchableOpacity>
      </View>

      <View style={styles.icons}>
        <TouchableOpacity style={styles.iconButton} onPress={trie}>
          <Ionicons name="swap-vertical" size={20} color="#F26407" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setGrid(!grid)}
        >
          <Ionicons
            name={!grid ? "grid" : "list"}
            size={20}
            color="#F26407"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,

  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#F26407',
    justifyContent: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 2,
    borderColor: '#F26407',
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 5,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 8,
  },
  icons: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  iconButton: {
    marginLeft: 10,
    padding: 5,
  },
});

export default Header;