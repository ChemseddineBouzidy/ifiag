import { useUserStore } from '@/store/userStore';
import { BASE_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { z } from 'zod';
import { HOME_ROUTE } from '../constants/routes'; // adjust path as needed

interface LoginErrors {
    email?: string;
    password?: string;
}

export default function Login() {
    const [email, setEmail] = useState<string>('john.doe@ifiag.com');
    const [password, setPassword] = useState<string>('password123');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<LoginErrors>({});
    const [generalError, setGeneralError] = useState<string>('');
    const { setUserAndStudent } = useUserStore();

    const schema = z.object({
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });
    const url = new URL(
        "https://ifiag.pidefood.com/api/auth/login"
    );

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };




    const handleLogin = async () => {
        const result = schema.safeParse({ email, password });

        if (!result.success) {
            const formatted = result.error.format();
            setErrors({
                email: formatted.email?._errors[0],
                password: formatted.password?._errors[0],
            });
            return;
        }

        setErrors({});
        setGeneralError('');

        try {
            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setGeneralError('Invalid email or password');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Login successful:', data.data.access_token);
            await AsyncStorage.setItem('access_token', data.data.access_token);
            // router.replace('/home');
            const profileResponse = await fetch(`${BASE_URL}/api/auth/profile`, {
                headers: { Authorization: `Bearer ${data.data.access_token}` },
            });
            const profileData = await profileResponse.json();

            setUserAndStudent({
                user: profileData.data.user,
                student: profileData.data.student,
            });
            router.replace(HOME_ROUTE);

        } catch (error) {
            console.error('Login failed:', error);
            setGeneralError('An error occurred during login. Please try again.');
        }
    }

    const handleSignUp = () => {
        router.push("/auth/SignUp");
    };

    const handleForgotPassword = () => {
        router.replace("/auth/tets");
        console.log('Forgot password pressed');
    };

    return (
        <>
        {/* // <SafeAreaView style={styles.container}> */}
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            <ImageBackground
        source={require('../../assets/images/login.png')} // Replace with your image path
        style={styles.backgroundImage}
        resizeMode="cover"
      >
            <KeyboardAvoidingView
                style={styles.keyboardAvoid}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Bienvenue sur Ifiage</Text>
                        <Text style={styles.subtitle}>
                            Connecte-toi pour accéder à ton espace scolaire personnalisé.
                        </Text>
                    </View>
                    {generalError && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{generalError}</Text>
                        </View>
                    )}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor="#666"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="next"
                            />
                            {errors.email && <Text style={{ color: 'red', marginTop: 4 }}>{errors.email}</Text>}
                        </View>


                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                value={password}
                                placeholderTextColor="#666"
                                onChangeText={setPassword}
                                placeholder="Mot de passe"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                            />
                            {errors.password && (
                                <Text style={styles.errorText}>{errors.password}</Text>
                            )}

                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={24}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.forgotContainer}
                            onPress={handleForgotPassword}
                        >
                            <Text style={styles.forgotText}>Forget Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.loginButtonText}>Log In</Text>
                        </TouchableOpacity>

                        <View style={styles.signUpContainer}>
                            <Text style={styles.signUpText}>Don't have account? </Text>
                            <TouchableOpacity onPress={handleSignUp}>
                                <Text style={styles.signUpLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
             
            </KeyboardAvoidingView>
        </ImageBackground>

        {/* // </SafeAreaView> */}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardAvoid: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 100,
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
        color: '#ff6b35',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
        position: 'relative',
    },
    input: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#ff6b35',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 18,
        fontSize: 16,
        color: '#333',
    },
    passwordInput: {
        paddingRight: 60,
    },
    eyeIcon: {
        position: 'absolute',
        right: 20,
        top: 18,
        padding: 4,
    },
    forgotContainer: {
        alignItems: 'flex-end',
        marginBottom: 32,
    },
    forgotText: {
        color: '#6c757d',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#ff6b35',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#ff6b35',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        color: '#6c757d',
        fontSize: 16,
    },
    signUpLink: {
        color: '#ff6b35',
        fontSize: 16,
        fontWeight: '600',
    },
    errorContainer: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        color: '#721c24',
        fontSize: 14,
        textAlign: 'center',
    },
    fieldError: {
        color: '#dc3545',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },

    backgroundImage: {
        width: '100%',
        height: '100%',
      },
});