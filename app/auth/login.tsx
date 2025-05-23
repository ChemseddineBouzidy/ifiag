import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { z } from 'zod';

export default function Login() {
  const [email, setEmail] = useState<any>('chamseddine@gmail.com');
  const [password, setPassword] = useState<any>('chamseddine@gmail.com');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const handleLogin = async() => {
    const result = schema.safeParse({ email, password });
  
    if (!result.success) {
      const formatted = result.error.format();
      setErrors({
        email: formatted.email?._errors[0],
        password: formatted.password?._errors[0],
      });
    } else {
      setErrors({});
        try {
            const response  =  await fetch('api/auth/login',{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',     
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
              console.log('Login failed:', data);
              
              return;
            }
      
            console.log('Login success:', data);
           
          } catch (error) {
            console.error('Network error:', error);
          }
        }
      };
  

  const handleSignUp = () => {
   
    console.log('Sign up pressed');
  };

  const handleForgotPassword = () => {
   
    console.log('Forgot password pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
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
              />
              {errors.password && <Text style={{ color: 'red', marginTop: 4 }}>{errors.password}</Text>}

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
    </SafeAreaView>
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
});