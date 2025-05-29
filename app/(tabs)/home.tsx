import NextSession from '@/src/components/NextSession';
import { Routes } from '@/src/constants/routes';
import { useUserStore } from '@/store/userStore';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Home = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const user = useUserStore(state => state.user);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace(Routes.LOGIN_ROUTE as any);
    }
    setChecking(false);
  }, [user]);

  if (!user) {
    return <Text>Utilisateur non connecté</Text>;
  }

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');  
      if(token){
        await fetch(`${BASE_URL}/api/auth/logout`,{
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      await AsyncStorage.removeItem('access_token');  
      useUserStore.getState().logout();  
      router.replace('/auth/login');                   
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getInitials = () => {
    const firstInitial = user?.first_name?.charAt(0)?.toUpperCase() || '';
    const lastInitial = user?.last_name?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            {user.photo ? (
              <View style={[styles.avatarFallback, { backgroundColor: '#3b82f6' }]}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
            ) : (
              <Image 
                source={{ uri: user.photo }} 
                style={styles.avatarImage}
                defaultSource={require('../../assets/images/default-avatar.png')}
              />
            )}
            <View style={styles.onlineDot} />
          </View>
    
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Bienvenue,</Text>
            <Text style={styles.userName}>{user?.first_name} {user?.last_name}</Text>
            <Text style={styles.userRole}>{user?.role}</Text>
          </View>
    
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="#059669" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>
    
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Tableau de bord</Text>
  
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="person" size={24} color="#059669" />
            <Text style={styles.infoTitle}>Informations personnelles</Text>
          </View>
          
          <View style={styles.infoContent}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <MaterialIcons name="badge" size={20} color="#059669" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Nom complet</Text>
                <Text style={styles.infoValue}>{user?.first_name} {user?.last_name}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <MaterialIcons name="email" size={20} color="#059669" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <MaterialIcons name="work" size={20} color="#059669" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Rôle</Text>
                <Text style={styles.infoValue}>{user?.role}</Text>
              </View>
            </View>
          </View>
        </View>
  
        <NextSession />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  onlineDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    paddingHorizontal: 20,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
  },
  infoContent: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  nextSessionCard: {
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});