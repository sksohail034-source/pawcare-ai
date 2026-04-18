import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { colors } from '../theme/colors';

const countryCodes = [
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
];

export default function LoginScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain uppercase';
    if (!/[0-9]/.test(pwd)) return 'Password must contain a number';
    return null;
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      await AsyncStorage.setItem('pawcare_plan', response.data.user?.subscription || 'free');
      
      // Fetch and save pets locally
      try {
        const petsResp = await api.get('/pets');
        await AsyncStorage.setItem('pawcare_pets', JSON.stringify(petsResp.data.pets || []));
      } catch (pErr) {
        console.log('Could not fetch pets', pErr);
      }
      
      navigation.replace('Dashboard');
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.error || 'Unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      Alert.alert('Error', pwdError);
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { 
        name, email, password, phone, countryCode 
      });
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      await AsyncStorage.setItem('pawcare_plan', 'free_trial');
      navigation.replace('Dashboard');
    } catch (err) {
      Alert.alert('Registration Failed', err.response?.data?.error || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      Alert.alert('Success', 'Password reset link sent to your email!');
      setShowForgot(false);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (showForgot) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, justifyContent: 'center' }}>
        <Text style={styles.title}>🔐 Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={[styles.input, { color: '#000000' }]} 
            placeholder="Email" 
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowForgot(false)}>
          <Text style={styles.switchText}>← Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, justifyContent: 'center' }}>
      <Text style={styles.title}>🐾 PawCare AI</Text>
      <Text style={styles.subtitle}>{isLogin ? 'Welcome back!' : 'Create your account'}</Text>
      
      {!isLogin && (
        <View style={styles.inputContainer}>
          <TextInput 
            style={[styles.input, { color: '#000000' }]} 
            placeholder="Full Name" 
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ width: 80 }}>
              <View style={[styles.input, styles.countryPicker, { justifyContent: 'center' }]}>
                <Text style={{ color: '#666' }}>{countryCodes.find(c => c.code === countryCode)?.flag} {countryCode}</Text>
              </View>
            </View>
            <TextInput 
              style={[styles.input, { color: '#000000', flex: 1 }]} 
              placeholder="Phone Number" 
              placeholderTextColor="#666"
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/\D/g, '').slice(0, 10))}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.input, { color: '#000000' }]} 
          placeholder="Email" 
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput 
          style={[styles.input, { color: '#000000' }]} 
          placeholder="Password" 
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {isLogin && (
        <TouchableOpacity onPress={() => setShowForgot(true)}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={isLogin ? handleLogin : handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Create Account')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countryPicker: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchText: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  forgotText: {
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 15,
    fontSize: 14,
  }
});
