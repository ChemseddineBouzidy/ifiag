import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';


const Header = ({ grid, setGrid }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.profilePic}>
        <Image
          source={{ uri: 'https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg' }}
          style={styles.profileImage}
        />
      </View>
      
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="JHON"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#FFA909" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.icons}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="swap-vertical" size={20} color="#FFA909" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => setGrid(!grid)}
        >
          <Ionicons 
            name={!grid ? "grid" : "list"} 
            size={20} 
            color="#FFA909" 
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
    padding: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#FFA909',
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
    borderColor: '#FFA909',    
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