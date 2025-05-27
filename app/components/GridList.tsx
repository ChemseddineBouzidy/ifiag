import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



const GridList = ({student}:any) => {
  return (
    <View style={styles.card}>
      <View
        style={styles.avatar}
      >
        <Image 
          source={student.user.photo ? { uri: student.user.photo } : require('../../assets/images/default-avatar.png')}
          style={styles.avatarImage}
        />
      </View>
      
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{student.field}</Text>
      </View>
      
      <View style={styles.icons}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="call-outline" size={20} color="#6e00ff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="mail-outline" size={20} color="#6e00ff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="eye-outline" size={20} color="#6e00ff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{student.user.first_name}</Text>
      
      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={16} color="#6e00ff" />
        <Text style={styles.date}>{student.birth_date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'rgba(255, 169, 9, 0.3)',
    width: 180,
    padding: 30,
    margin: 7,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  badge: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  badgeText: {
    fontSize: 10,
    color: '#333',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  iconButton: {
    marginHorizontal: 8,
  },
  icon: {
    fontSize: 18,
  },
  name: {
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 16,
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:4,
    marginTop: 10,
  },
  calendarIcon: {
    marginRight: 4,
    fontSize: 12,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  avatarImage: {
    width: 80,
    backgroundColor: "rgba(220, 220, 220, 0.5)",
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
});

export default GridList;