import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { z } from 'zod';

const { width } = Dimensions.get('window');

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  birth_date: z.string().optional().or(z.literal("")),
  birth_place: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

const UpdateProfileForm = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    birth_date: '',
    birth_place: '',
    address: '',
    description: '',
    photo: null,
    current_photo: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    verifyTokenAndLoadProfile();
  }, []);

  const verifyTokenAndLoadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        Alert.alert('Authentication Required', 'Please login to continue.', [
          { text: 'OK' }
        ]);
        return;
      }

      await loadProfileData();
    } catch (error) {
      console.error('Error in token verification:', error);
      Alert.alert('Error', 'Authentication error. Please login again.');
    }
  };

  const loadProfileData = async () => {
    try {
      setLoadingProfile(true);
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        Alert.alert('Error', 'No authentication token found. Please login again.');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          Alert.alert('Session Expired', 'Please login again.', [
            { text: 'OK', onPress: () => {
              AsyncStorage.removeItem('access_token');
            }}
          ]);
          return;
        }
        const errorText = await response.text();
        throw new Error(`Failed to load profile data: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      if (data.success || data.data) {
        const profile = data.data || data;
        setFormData({
          first_name: profile.user.first_name || '',
          last_name: profile.user.last_name || '',
          email: profile.user.email || '',
          password: '',
          phone: profile.student.phone || '',
          birth_date: profile.student.birth_date || '',
          birth_place: profile.student.birth_place || '',
          address: profile.student.address || '',
          description: profile.student.description || '',
          photo: null,
          current_photo: profile.user.photo || null,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to load profile data: ${error.message}`);
    } finally {
      setLoadingProfile(false);
    }
  };

  const validateForm = () => {
    try {
      const dataToValidate = {
        first_name: formData.first_name?.trim() || '',
        last_name: formData.last_name?.trim() || '',
        email: formData.email?.trim() || '',
        password: formData.password || '',
        phone: formData.phone || '',
        birth_date: formData.birth_date || '',
        birth_place: formData.birth_place || '',
        address: formData.address || '',
        description: formData.description || '',
      };

      profileSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        Alert.alert('Error', 'No authentication token found. Please login again.');
        return;
      }

      const form = new FormData();
      const fields = ['first_name', 'last_name', 'email', 'phone', 'birth_date', 'birth_place', 'address', 'description'];
      
      fields.forEach(field => {
        form.append(field, formData[field]?.trim() || '');
      });

      if (formData.password?.trim()) {
        form.append('password', formData.password);
      }

      if (formData.photo) {
        const photoUri = formData.photo;
        const filename = photoUri.split('/').pop();
        const type = /\.(\w+)$/.exec(filename)?.[1] || 'jpeg';
        
        form.append('photo', {
          uri: photoUri,
          name: filename || 'photo.jpg',
          type: `image/${type}`,
        } as any);
      }

      const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': formData.photo ? 'multipart/form-data' : 'application/json'
        },
        body: formData.photo ? form : JSON.stringify(Object.fromEntries(form))
      });

      if (!response.ok) {
        if (response.status === 401) {
          Alert.alert('Session Expired', 'Please login again.', [
            { text: 'OK', onPress: () => AsyncStorage.removeItem('access_token') }
          ]);
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success !== false) {
        Alert.alert('Success!', data.message || 'Profile updated successfully!', [
          { text: 'OK', onPress: loadProfileData }
        ]);
        setFormData(prev => ({ ...prev, password: '', photo: null }));
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Update Failed', error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'You need to grant photo access permission to choose an image.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const picked = result.assets[0];
        setFormData(prev => ({
          ...prev,
          photo: picked.uri,
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      updateFormData('birth_date', formattedDate);
    }
  };

  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Profile Settings</Text>
          <Text style={styles.subtitle}>Update your personal information</Text>
        </View>
        <View style={styles.headerDecoration} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formCard}>

          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>Profile Photo</Text>
            <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
              {formData.photo || formData.current_photo ? (
                <View style={styles.photoWrapper}>
                  <Image 
                    source={{ uri: formData.photo || formData.current_photo }} 
                    style={styles.profileImage} 
                  />
                  <View style={styles.photoOverlay}>
                    <Text style={styles.photoOverlayText}>Change</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <View style={styles.photoIcon}>
                    <Text style={styles.photoIconText}>📷</Text>
                  </View>
                  <Text style={styles.photoText}>Add Photo</Text>
                  <Text style={styles.photoSubtext}>JPG or PNG, max 5MB</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.row}>
              <View style={[styles.halfInput, { marginRight: 10 }]}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={[styles.input, errors.first_name && styles.inputError]}
                  value={formData.first_name}
                  onChangeText={(text) => updateFormData('first_name', text)}
                  placeholder="Enter first name"
                  placeholderTextColor="#A0AEC0"
                />
                {errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}
              </View>
              
              <View style={[styles.halfInput, { marginLeft: 10 }]}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={[styles.input, errors.last_name && styles.inputError]}
                  value={formData.last_name}
                  onChangeText={(text) => updateFormData('last_name', text)}
                  placeholder="Enter last name"
                  placeholderTextColor="#A0AEC0"
                />
                {errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}
              </View>
            </View>

            <View style={[styles.inputGroup, { marginTop: 16 }]}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                placeholder="your.email@example.com"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                placeholder="+212 6 98 76 54 32"
                placeholderTextColor="#A0AEC0"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.row}>
              {/* <View style={[styles.halfInput, { marginRight: 10 }]}>
                <Text style={styles.label}>Birth Date</Text>
                <TouchableOpacity
                  style={[styles.input, styles.dateInput]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={[styles.dateText, !formData.birth_date && styles.placeholderText]}>
                    {formData.birth_date || 'Select date'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={formData.birth_date ? new Date(formData.birth_date.split('T')[0]) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </View> */}

              <View style={[styles.halfInput, { marginLeft: 0 }]}>
                <Text style={styles.label}>Birth Place</Text>
                <TextInput
                  style={styles.input}
                  value={formData.birth_place}
                  onChangeText={(text) => updateFormData('birth_place', text)}
                  placeholder="City, Country"
                  placeholderTextColor="#A0AEC0"
                />
              </View>
            </View>
          </View>


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                placeholder="Leave empty to keep current password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>
          </View>


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.address}
                onChangeText={(text) => updateFormData('address', text)}
                placeholder="Your full address"
                placeholderTextColor="#A0AEC0"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>About You</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => updateFormData('description', text)}
                placeholder="Tell us a bit about yourself..."
                placeholderTextColor="#A0AEC0"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.updateButton, loading && styles.disabledButton]} 
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingButton}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.loadingButtonText}>Updating...</Text>
              </View>
            ) : (
              <Text style={styles.updateButtonText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F8FAFC',
    },
    loadingCard: {
      backgroundColor: '#FFFFFF',
      padding: 24,
      borderRadius: 16,
      elevation: 5,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: '#6B7280',
    },
    header: {
      backgroundColor: '#FF6B35',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
      paddingHorizontal: 24,
      paddingBottom: 32,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerContent: {
      marginBottom: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    subtitle: {
      fontSize: 16,
      color: '#FFEFE6',
      marginTop: 4,
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 100,
    },
    formCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 4,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: '#111827',
    },
    inputGroup: {
      marginBottom: 16,
 

    },
    input: {
      backgroundColor: '#F1F5F9',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      color: '#111827',
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    inputError: {
      borderColor: '#EF4444',
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: '#374151',
      marginBottom: 6,
    },
    errorText: {
      color: '#EF4444',
      fontSize: 12,
      marginTop: 4,
    },
    textArea: {
      minHeight: 80,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfInput: {
      flex: 1,
    },
    dateInput: {
      justifyContent: 'center',
    },
    dateText: {
      fontSize: 16,
      color: '#111827',
    },
    placeholderText: {
      color: '#9CA3AF',
    },
    photoSection: {
      marginBottom: 24,
    },
    photoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    photoWrapper: {
      width: 120,
      height: 120,
      borderRadius: 60,
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 3,
      borderColor: '#FF6B35',
    },
    profileImage: {
      width: '100%',
      height: '100%',
    },
    photoOverlay: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: 'rgba(0,0,0,0.4)',
      paddingVertical: 6,
      alignItems: 'center',
    },
    photoOverlayText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    photoPlaceholder: {
      alignItems: 'center',
      paddingVertical: 24,
      backgroundColor: '#E5E7EB',
      borderRadius: 16,
      width: '100%',
    },
    photoIcon: {
      backgroundColor: '#FF6B35',
      padding: 12,
      borderRadius: 50,
      marginBottom: 8,
    },
    photoIconText: {
      fontSize: 20,
      color: '#FFFFFF',
    },
    photoText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#374151',
    },
    photoSubtext: {
      fontSize: 12,
      color: '#6B7280',
    },
    buttonContainer: {
      marginTop: 30,
    },
    updateButton: {
      backgroundColor: '#FF6B35',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    disabledButton: {
      opacity: 0.6,
    },
    loadingButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    loadingButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      marginLeft: 10,
    },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  });
  

export default UpdateProfileForm;