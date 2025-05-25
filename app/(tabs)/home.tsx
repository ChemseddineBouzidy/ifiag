import { useUserStore } from '@/store/userStore';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { LOGIN_ROUTE } from '../constants/routes';

const home = () => {
  const user = useUserStore(state => state.user);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    if (!user) {
      router.replace(LOGIN_ROUTE);
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
      <Text>home {user.first_name}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
    </SafeAreaView>
  )
}

export default home

const styles = StyleSheet.create({})