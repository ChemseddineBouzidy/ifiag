import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { z } from 'zod';







const step1Schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional().or(z.literal("")),
});

const step2Schema = z.object({
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  gender: z.enum(["Male", "Female"], { required_error: "Please select a gender" }),
  birth_place: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

const step3Schema = z.object({
  class: z.string().min(1, "Class is required"),
  field: z.string().min(1, "Field is required"),
  enrollment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  description: z.string().optional().or(z.literal("")),
});

const StudentSignUpFlow = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [image, setImage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState({ birth: false, enrollment: false });
  const [formData, setFormData] = useState<any>({
    
    
    first_name: 'test',
    last_name: 'test',
    email: 'test@test.com',
    password: 'testtest',
    phone: '',
    photo: null,

   
    birth_date: '2003-01-01',
    gender: 'Male',
    birth_place: 'casa',
    address: 'casa',

  
    class: 'casa',
    field: 'compture',
    enrollment_date: new Date().toISOString().split('T')[0],
    description: 'testtesttesttest'
  });

  const [errors, setErrors] = useState<any>({});

  const validateStep = (step: any) => {
    try {
      let schema;
      let dataToValidate;

      switch (step) {
        case 1:
          schema = step1Schema;
          dataToValidate = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone
          };
          break;
        case 2:
          schema = step2Schema;
          dataToValidate = {
            birth_date: formData.birth_date,
            gender: formData.gender,
            birth_place: formData.birth_place,
            address: formData.address
          };
          break;
        case 3:
          schema = step3Schema;
          dataToValidate = {
            class: formData.class,
            field: formData.field,
            enrollment_date: formData.enrollment_date,
            description: formData.description
          };
          break;
        default:
          return false;
      }

      schema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {} as any;
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };


  const handleSubmit = async () => {
    if (validateStep(3)) {
      console.log(formData)
      try {
        const form = new FormData();
  
        for (const key in formData) {
          if (key !== 'photo') {
            form.append(key, formData[key]);
          }
        }
  
        if (formData.photo) {
          form.append('photo', {
            uri: formData.photo,
            name: 'photo.jpg',
            type: 'image/jpeg',
          } as any);
        }
  
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: form,
        });
  
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Failed to create student account: ${errText}`);
        }
  
        const data = await response.json();
  
        if (data.success) {
          await AsyncStorage.setItem('token', data.data.access_token);
  
          Alert.alert(
            'Success!',
            data.message || 'Student account created successfully!',
            [
              {
                text: 'OK',
                onPress: () => {
                  setCurrentStep(1);
                  setFormData({
                    first_name: '', last_name: '', email: '', password: '', phone: '', photo: '',
                    birth_date: '', gender: '', birth_place: '', address: '',
                    class: '', field: '', enrollment_date: '', description: ''
                  });
                  setErrors({});
                }
              }
            ]
          );
  
          console.log('User:', data.data.user);
          console.log('Student:', data.data.student);
        } else {
          throw new Error(data.message || 'Unknown error');
        }
      } catch (error: any) {
        console.error('Error creating student account:', error);
        Alert.alert(
          'Error',
          error.message || 'Failed to create student account. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  };
  
  
  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const pickImage = async () => {
     // Demander la permission d'accès aux photos
     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
     if (status !== 'granted') {
       Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès aux photos pour choisir une image.');
       return;
     }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const picked = result.assets[0];
      setFormData(prev => ({
        ...prev,
        // photo: {
        //   uri: picked.uri,
        //   type: picked.type || 'image/jpeg',
        //   name: picked.fileName || 'photo.jpg',
        // },
          photo:picked.uri || 'photo.jpg',
      }));
    }
  };

  const handleDateChange = (event, selectedDate, type) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(prev => ({ ...prev, [type]: false }));
    }

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const field = type === 'birth' ? 'birth_date' : 'enrollment_date';
      updateFormData(field, formattedDate);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3].map((step, index) => (
        <View key={step} style={styles.progressStep}>
          <View style={[
            styles.progressCircle,
            currentStep >= step ? styles.progressActive : styles.progressInactive
          ]}>
            <Text style={[
              styles.progressText,
              currentStep >= step ? styles.progressTextActive : styles.progressTextInactive
            ]}>
              {step}
            </Text>
          </View>
          {index < 2 && (
            <View style={[
              styles.progressLine,
              currentStep > step ? styles.progressActive : styles.progressInactive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepSubtitle}>Enter your basic details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={[styles.input, errors.first_name && styles.inputError]}
          value={formData.first_name}
          onChangeText={(text) => updateFormData('first_name', text)}
          placeholder="John"
          placeholderTextColor="#9CA3AF"
        />
        {errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={[styles.input, errors.last_name && styles.inputError]}
          value={formData.last_name}
          onChangeText={(text) => updateFormData('last_name', text)}
          placeholder="Doe"
          placeholderTextColor="#9CA3AF"
        />
        {errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={formData.email}
          onChangeText={(text) => updateFormData('email', text)}
          placeholder="john.doe@ifiag.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>
    
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          value={formData.password}
          onChangeText={(text) => updateFormData('password', text)}
          placeholder="password123"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone (Optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => updateFormData('phone', text)}
          placeholder="+212 6 98 76 54 32"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Profile Photo (Optional)</Text>
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          {formData.photo ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: formData.photo }} style={styles.photoPreview} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => updateFormData('photo', '')}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>+</Text>
              <Text style={styles.photoText}>Add Photo</Text>
              <Text style={styles.photoSubtext}>JPG or PNG</Text>
            </View>
          )}
        </TouchableOpacity>
        {errors.photo && <Text style={styles.errorText}>{errors.photo}</Text>}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Details</Text>
      <Text style={styles.stepSubtitle}>Additional personal information</Text>

      <View style={styles.inputGroup}>
        
        <Text style={styles.label}>Birth Date *</Text>
        <TouchableOpacity
          style={[styles.input, styles.dateInput, errors.birth_date && styles.inputError]}
          onPress={() => setShowDatePicker(prev => ({ ...prev, birth: true }))}
        >
          <Text style={[styles.dateText, !formData.birth_date && styles.placeholderText]}>
            {formData.birth_date || 'Select birth date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker.birth && (
          <DateTimePicker
            value={formData.birth_date ? new Date(formData.birth_date) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'birth')}
            maximumDate={new Date()}
          />
        )}
        {errors.birth_date && <Text style={styles.errorText}>{errors.birth_date}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender *</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => updateFormData('gender', 'Male')}
          >
            <View style={[styles.radioCircle, formData.gender === 'Male' && styles.radioSelected]}>
              {formData.gender === 'Male' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => updateFormData('gender', 'Female')}
          >
            <View style={[styles.radioCircle, formData.gender === 'Female' && styles.radioSelected]}>
              {formData.gender === 'Female' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>Female</Text>
          </TouchableOpacity>
        </View>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Birth Place (Optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.birth_place}
          onChangeText={(text) => updateFormData('birth_place', text)}
          placeholder="Casablanca"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.address}
          onChangeText={(text) => updateFormData('address', text)}
          placeholder="123 Street, Casablanca"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  const renderStep3 = () => {
    const fieldOptions = [
      'Computer Science',
      'Information Technology',
      'Software Engineering',
      'Data Science',
      'Cybersecurity',
      'Network Administration',
      'Web Development',
      'Mobile Development'
    ];

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Academic Information</Text>
        <Text style={styles.stepSubtitle}>Your academic details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Class *</Text>
          <TextInput
            style={[styles.input, errors.class && styles.inputError]}
            value={formData.class}
            onChangeText={(text) => updateFormData('class', text)}
            placeholder="1st Year Computer Science"
            placeholderTextColor="#9CA3AF"
          />
          {errors.class && <Text style={styles.errorText}>{errors.class}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Field *</Text>
          <View style={styles.fieldContainer}>
            {fieldOptions.map(field => (
              <TouchableOpacity
                key={field}
                style={[
                  styles.fieldChip,
                  formData.field === field && styles.fieldChipSelected
                ]}
                onPress={() => updateFormData('field', field)}
              >
                <Text style={[
                  styles.fieldText,
                  formData.field === field && styles.fieldTextSelected
                ]}>
                  {field}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.field && <Text style={styles.errorText}>{errors.field}</Text>}
        </View>

        {/* <View style={styles.inputGroup}>
          <Text style={styles.label}>Enrollment Date *</Text>
          <TouchableOpacity
            style={[styles.input, styles.dateInput, errors.enrollment_date && styles.inputError]}
            onPress={() => {
              const today = new Date();
              const formattedDate = today.toISOString().split('T')[0];
              updateFormData('enrollment_date', formattedDate);
            }}
          >
            <Text style={[styles.dateText, !formData.enrollment_date && styles.placeholderText]}>
              {formData.enrollment_date || 'Select enrollment date'}
            </Text>
          </TouchableOpacity>
          {errors.enrollment_date && <Text style={styles.errorText}>{errors.enrollment_date}</Text>}
        </View> */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => updateFormData('description', text)}
            placeholder="New student"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>
    );
  };

  return (
   <ImageBackground
source={require('../../assets/images/login.png')} // Replace with your image path
style={styles.backgroundImage}
resizeMode="cover"
>
<ScrollView >
{/* <View style={styles.header}>
<Text style={styles.title}>Student Registration</Text>
<Text style={styles.subtitle}>Create your student account</Text>

</View> */}
<View style={styles.stepsContainer}>
<View style={styles.stepContent}>
{renderProgressBar()}
{currentStep === 1 && renderStep1()}
{currentStep === 2 && renderStep2()}
{currentStep === 3 && renderStep3()}
</View>
</View>
{/* {renderProgressBar()} */}
<View style={styles.buttonContainer}>
{currentStep > 1 && (
<TouchableOpacity style={styles.backButton} onPress={handleBack}>
<Text style={styles.backButtonText}>Back</Text>
</TouchableOpacity>
)}

{currentStep < 3 ? (
<TouchableOpacity
style={[styles.nextButton, currentStep === 1 && styles.fullWidthButton]}
onPress={handleNext}
>
<Text style={styles.nextButtonText}>Next</Text>
</TouchableOpacity>
) : (
<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
<Text style={styles.submitButtonText}>Create Account</Text>
</TouchableOpacity>
)}
</View>
</ScrollView>
</ImageBackground>
  );
};

const styles = StyleSheet.create({
backgroundImage: {
width: '100%',
height: '100%',
},
image: {
  width: 100,
  height: 100,
  resizeMode: 'cover',
  borderRadius: 50,
  marginVertical: 10,
},
container: {
flex: 1,
marginTop: 14,

backgroundColor: '#FFFFFF',
},
header: {
backgroundColor: '#FA6407',
paddingTop: 60,
paddingHorizontal: 20,
paddingBottom: 20,
},
title: {
fontSize: 24,
fontWeight: 'bold',
color: '#FFFFFF',
textAlign: 'center',
},
subtitle: {
fontSize: 14,
color: '#DBEAFE',
textAlign: 'center',
marginBottom: 20,
},
progressContainer: {
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
marginTop: 20,
},
progressStep: {
flexDirection: 'row',
color:"#00112B",
alignItems: 'center',
},
progressCircle: {
width: 40,
height: 40,
borderRadius: 20,
justifyContent: 'center',
alignItems: 'center',
borderWidth: 2,
},
progressActive: {
backgroundColor: '#FA6407',
borderColor: '#fff',
},
progressInactive: {
backgroundColor: 'transparent',
borderColor: '#FA6407',
},
progressText: {
fontSize: 16,
fontWeight: 'bold',
},
progressTextActive: {
color: '#fff',
},
progressTextInactive: {
color: '#FA6407',
},
progressLine: {
width: 30,
height: 2,
marginHorizontal: 5,
},
stepContainer: {
padding: 20,
},
stepTitle: {
fontSize: 22,
fontWeight: 'bold',
color: '#1F2937',
marginBottom: 8,
textAlign: 'center',
},
stepSubtitle: {
fontSize: 14,
color: '#6B7280',
marginBottom: 30,
textAlign: 'center',
},
inputGroup: {
marginBottom: 20,
},
label: {
fontSize: 14,
fontWeight: '600',
color: '#FA6407',
marginBottom: 8,
},
input: {
backgroundColor: '#FFFFFF',
borderWidth: 1,
borderColor: '#FA6407',
borderRadius: 8,
paddingHorizontal: 16,
paddingVertical: 12,
fontSize: 16,
color: '#1F2937',
},
inputError: {
borderColor: '#EF4444',
},
textArea: {
height: 80,
textAlignVertical: 'top',
},
errorText: {
color: '#EF4444',
fontSize: 12,
marginTop: 4,
},
dateInput: {
justifyContent: 'center',
},
dateText: {
fontSize: 16,
color: '#1F2937',
},
placeholderText: {
color: '#9CA3AF',
},
radioGroup: {
flexDirection: 'row',
gap: 20,
},
radioButton: {
flexDirection: 'row',
alignItems: 'center',

},
radioCircle: {
width: 20,
height: 20,
borderRadius: 10,
borderWidth: 2,
borderColor: '#D1D5DB',
marginRight: 8,
justifyContent: 'center',
alignItems: 'center',
},
radioSelected: {
borderColor: '#FA6407',
},
radioDot: {
width: 10,
height: 10,
borderRadius: 5,
backgroundColor: '#FA6407',
},
radioLabel: {
fontSize: 16,
color: '#1F2937',
},
photoButton: {
backgroundColor: '#FFFFFF',
borderWidth: 2,
borderColor: '#FA6407',
borderStyle: 'dashed',
borderRadius: 8,
padding: 20,
alignItems: 'center',
},
// photoPreview: {
// alignItems: 'center',
// },
photoImage: {
width: 80,
height: 80,
borderRadius: 40,
marginBottom: 8,
},
photoPlaceholder: {
alignItems: 'center',
},
photoPlaceholderText: {
fontSize: 32,
marginBottom: 8,
},
photoText: {
fontSize: 14,
color: '#FA6407',
fontWeight: '500',
},
photoSubtext: {
fontSize: 12,
color: '#FA6407',
marginTop: 4,
},
fieldContainer: {
flexDirection: 'row',
flexWrap: 'wrap',
gap: 8,
},
fieldChip: {
backgroundColor: '#FFFFFF',
borderWidth: 1,
borderColor: '#D1D5DB',
borderRadius: 20,
paddingHorizontal: 12,
paddingVertical: 8,
},
fieldChipSelected: {
backgroundColor: '#FA6407',
borderColor: '#FA6407',
},
fieldText: {
color: '#6B7280',
fontSize: 12,
},
fieldTextSelected: {
color: '#FFFFFF',
},
buttonContainer: {
flexDirection: 'row',
paddingHorizontal: 20,
paddingBottom: 40,
gap: 12,
},
backButton: {
flex: 1,
backgroundColor: '#6B7280',
paddingVertical: 15,
borderRadius: 8,
alignItems: 'center',
},
backButtonText: {
color: '#FFFFFF',
fontSize: 16,
fontWeight: '600',
},
nextButton: {
flex: 1,
backgroundColor: '#00112B',
paddingVertical: 15,
borderRadius: 8,
alignItems: 'center',
},
nextButtonText: {
color: '#FFFFFF',
fontSize: 16,
fontWeight: '600',
},
submitButton: {
flex: 1,
backgroundColor: '#00112B',
paddingVertical: 15,
borderRadius: 8,
alignItems: 'center',
},
submitButtonText: {
color: '#FFFFFF',
fontSize: 16,
fontWeight: '600',
},
fullWidthButton: {
flex: 1,
},
stepContent: {
flex: 1,
paddingHorizontal: 20,
paddingTop: 20,
},
stepsContainer: {
flex: 1,
paddingTop: 60,
},
photoButtonText: {
color: '#3B82F6',
fontSize: 14,
fontWeight: '500',
width: '100%'
},
photoContainer: {
flexDirection: 'row',
alignItems: 'center',
gap: 12,
},
previewContainer: {
flexDirection: 'row',
alignItems: 'center',
gap: 8,
},
photoPreview: {
width: 60,
height: 60,
borderRadius: 30,
},
removeButton: {
padding: 8,
},
removeButtonText: {
color: '#EF4444',
fontSize: 14,
fontWeight: '500',
},
});

export default StudentSignUpFlow;