import { Routes } from '@/src/constants/routes';
import { useUserStore } from '@/store/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';

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
      const token =await AsyncStorage.getItem('access_token');  
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
  return (
    <SafeAreaView>
    <View>
      <Text>Home {user.first_name}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({})