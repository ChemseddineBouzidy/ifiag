import { useUserStore } from '@/store/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
const home = () => {
  const user = useUserStore(state => state.user);
  if (!user) {
    return <Text>Utilisateur non connecté</Text>;
  }
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');  
      useUserStore.getState().clearUserAndStudent();  
      router.replace('/auth/login');                   
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  return (
    <View>
      <Text>home {user.first_name}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  )
}

export default home

const styles = StyleSheet.create({})