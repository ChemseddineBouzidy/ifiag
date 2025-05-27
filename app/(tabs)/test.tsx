import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

// Données d'exemple des étudiants
const studentsData = [
  {
    id: 1,
    name: "Marie Dubois",
    studentId: "STU-2024-001",
    major: "Informatique",
    year: "3ème année",
    gpa: 3.8,
    email: "marie.dubois@univ.fr",
    phone: "+33 6 12 34 56 78",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Jean Martin",
    studentId: "STU-2024-002",
    major: "Génie Civil",
    year: "2ème année",
    gpa: 3.6,
    email: "jean.martin@univ.fr",
    phone: "+33 6 98 76 54 32",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Sophie Bernard",
    studentId: "STU-2024-003",
    major: "Médecine",
    year: "4ème année",
    gpa: 3.9,
    email: "sophie.bernard@univ.fr",
    phone: "+33 6 11 22 33 44",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

const StudentCard = ({ student }) => {
  const getGradeColor = (gpa) => {
    if (gpa >= 3.7) return '#10B981'; // Vert
    if (gpa >= 3.0) return '#F59E0B'; // Orange
    return '#EF4444'; // Rouge
  };

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.headerContent}>
          <Image source={{ uri: student.avatar }} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentId}>{student.studentId}</Text>
          </View>
          <View style={[styles.gpaContainer, { backgroundColor: getGradeColor(student.gpa) }]}>
            <Text style={styles.gpaText}>{student.gpa}</Text>
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="school-outline" size={20} color="#667eea" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Filière</Text>
              <Text style={styles.infoValue}>{student.major}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color="#667eea" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Niveau</Text>
              <Text style={styles.infoValue}>{student.year}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={20} color="#667eea" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{student.email}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={20} color="#667eea" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Téléphone</Text>
              <Text style={styles.infoValue}>{student.phone}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>Université de France • Année 2024-2025</Text>
      </View>
    </View>
  );
};

const StudentCardsList = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Liste des Étudiants</Text>
        <Text style={styles.subtitle}>{studentsData.length} étudiants inscrits</Text>
      </View>
      
      {studentsData.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  gradientHeader: {
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  gpaContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },
  gpaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardBody: {
    padding: 20,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginTop: 2,
  },
  cardFooter: {
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default StudentCardsList;