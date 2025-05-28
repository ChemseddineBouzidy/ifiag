import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



const GridList = ({ student }: any) => {

  const generateColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const r = (hash & 0xFF0000) >> 16;
    const g = (hash & 0x00FF00) >> 8;
    const b = hash & 0x0000FF;
    return `rgb(${r}, ${g}, ${b})`;
  };
const getAvatar = () =>{
  return <Text style={styles.avatarText}>{student.user.first_name.charAt(0, 3).toUpperCase()} {student.user.last_name.charAt(0, 3).toUpperCase()}</Text>
         
}
  const onCall = () => {
    if (student.phone) {
      Linking.openURL(`tel:${student.phone}`);
    } else {
      Alert.alert('No Phone Number', 'This student does not have a phone number registered.');
    }
  };
  const onEmail = () => {
    if (student.user.email) {
      Linking.openURL(`mailto:${student.user.email}`);
    } else {
      Alert.alert('No Email', 'This student does not have an email address registered.');
    }
  };

  return (
    <View style={styles.card}>
      <View
        style={[styles.avatar, { backgroundColor: generateColor(student.user.first_name) }]}
      >
          {
    student.user.photo
      ? getAvatar()
      : <Image source={require('../../assets/images/default-avatar.png')} style={styles.avatarImage} />
  }
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{student.field}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onCall}
          activeOpacity={0.7}
        >
          <Ionicons name="call" size={18} color="#6366f1" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onEmail}
          activeOpacity={0.7}
        >
          <Ionicons name="mail" size={18} color="#6366f1" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton} 
          // onPress={onView}
          activeOpacity={0.7}
        >
          <Ionicons name="eye" size={18} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {student.user.first_name} {student.user.last_name}
      </Text>

      <View style={styles.dateContainer}>
        <Ionicons name="calendar" size={14} color="#6b7280" />
        <Text style={styles.date}>{student.birth_date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180,
    padding: 20,
    margin: 8,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom:4
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  badgeText: {
    fontSize: 11,
    color: '#0369a1',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 16,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    fontSize: 18,
  },
 

  calendarIcon: {
    marginRight: 4,
    fontSize: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },

  name: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  
  date: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default GridList;