import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width: screenWidth } = Dimensions.get('window');

const StudentProfile = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [studentData, setStudentData] = useState<any>(null);
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  
  const fetchStudentDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        router.replace('/auth/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/students/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log( data.data);

      if (data.success) {
        setStudentData(data.data);
      console.log('Student data:', studentData);


      } else {
        await AsyncStorage.removeItem("access_token");
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      await AsyncStorage.removeItem("access_token");
      router.replace('/auth/login');
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const InfoCard = ({ icon, title, value, subtitle }: {
    icon: string;
    title: string;
    value: string | number;
    subtitle?: string;
  }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoIconContainer}>
        <Icon name={icon} size={20} color="#4f46e5" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
        {subtitle && <Text style={styles.infoSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const DetailRow = ({ icon, label, value, color = "#374151" }: {
    icon: string;
    label: string;
    value: string | number;
    color?: string;
  }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Icon name={icon} size={18} color="#6b7280" />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, { color }]}>{value}</Text>
      </View>
    </View>
  );


  if (!studentData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading...</Text>
      </View>
    );
  }
const getAvatar = () =>{
  return <Text style={styles.avatarText}>{studentData.user.first_name.charAt(0, 3).toUpperCase()} {studentData.user.last_name.charAt(0, 3).toUpperCase()}</Text>
         
}
  const renderProfileTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#FA6407','#FA6407']}
        style={styles.profileHeader}
      >
        <View 
        style={[styles.profileImageContainer, { backgroundColor: 'white' }]}
        >
        {
    studentData?.user?.photo
      ? getAvatar()
      : <Image source={require('../../assets/images/default-avatar.png')} style={styles.profileImage} />
  }
        
        </View>
        <Text style={styles.profileName}> {studentData?.user?.full_name || 'N/A'}</Text>
        <Text style={styles.profileRole}>{studentData?.field || 'N/A'}</Text>
        <View style={styles.studentIdContainer}>
          <Icon name="credit-card" size={16} color="#ffffff" />
          <Text style={styles.studentId}>{studentData?.student_id || 'N/A'}</Text>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <InfoCard icon="award" title="GPA" value={studentData.student?.gpa || 'N/A'} subtitle="Current" />
        <InfoCard icon="calendar" title="Semester" value={studentData.student?.semester || 'N/A'} />
        <InfoCard icon="percent" title="Attendance" value={studentData.academic?.attendance || 'N/A'} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="user" size={20} color="#374151" />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>
        <View style={styles.sectionContent}>
          <DetailRow icon="mail" label="Email" value={studentData?.user?.email || 'N/A'} />
          <DetailRow icon="phone" label="Phone" value={studentData?.phone || 'N/A'} />
          <DetailRow icon="map-pin" label="Address" value={studentData?.address || 'N/A'} />
          <DetailRow 
            icon="calendar" 
            label="Birth Date" 
            value={studentData?.birth_date ? formatDate(studentData?.birth_date) : 'N/A'} 
          />
          <DetailRow icon="map" label="Birth Place" value={studentData?.birth_place || 'N/A'} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="book-open" size={20} color="#374151" />
          <Text style={styles.sectionTitle}>Academic Information</Text>
        </View>
        <View style={styles.sectionContent}>
          <DetailRow icon="book" label="Class" value={studentData?.class || 'N/A'} />
          <DetailRow icon="bookmark" label="Field of Study" value={studentData?.field || 'N/A'} />
          <DetailRow 
            icon="calendar" 
            label="Enrollment Date" 
            value={studentData?.enrollment_date ? formatDate(studentData?.enrollment_date) : 'N/A'} 
          />
      
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="file-text" size={20} color="#374151" />
          <Text style={styles.sectionTitle}>About</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{studentData?.description || 'No description available'}</Text>
        </View>
      </View>
    </ScrollView>
  );



  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Profile</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="more-vertical" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>


      {renderProfileTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FA6407',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FA6407',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#FA6407',
  },
  tabContent: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 6,
    width: 90,
    height: 90,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderWidth:2,
    borderColor:'#FA6407',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#FA6407',
    fontWeight: 'bold',
    fontSize: 25
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FA6407',
  },
  statusDot: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  studentIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  studentId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 6,
    fontFamily: 'monospace',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoContent: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  infoSubtitle: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 12,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailIcon: {
    width: 40,
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  descriptionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  academicOverview: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  coursesContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  courseCredits: {
    fontSize: 12,
    color: '#6b7280',
  },
  gradeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default StudentProfile;