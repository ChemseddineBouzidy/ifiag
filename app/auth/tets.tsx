import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const tets = () => {
  const [formData, setFormData] = useState({
    photo: { uri: null, name: null, type: null }
  });
  const [errors, setErrors] = useState({});

  const pickImage = async () => {
    try {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "You need to grant camera roll permissions to use this feature.");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        setFormData(prev => ({
          ...prev,
          photo: {
            uri: selectedImage.uri,
            name: selectedImage.fileName || `image_${Date.now()}.jpg`,
            type: selectedImage.type || 'image/jpeg',
          }
        }));

        // Clear any existing errors
        setErrors(prev => ({ ...prev, photo: null }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      photo: { uri: null, name: null, type: null }
    }));
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Profile Photo (Optional)</Text>
      
      <View style={styles.photoContainer}>
        <TouchableOpacity
          style={styles.photoButton}
          onPress={pickImage}
        >
          <Text style={styles.photoButtonText}>
            {formData.photo?.uri ? 'Change Photo' : 'Pick an image from camera roll'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {formData.photo?.uri && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: formData.photo.uri }}
            style={styles.photoPreview}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={removeImage}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      {errors.photo && <Text style={styles.errorText}>{errors.photo}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  photoContainer: {
    marginBottom: 12,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  photoButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
});

export default tets;