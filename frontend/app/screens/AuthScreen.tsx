import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Phone, Lock, User, UserPlus } from 'lucide-react-native';
import { InputField } from '../components/ui/InputField';
import { GradientButton } from '../components/ui/GradientButton';
import { useAppStore } from '../store/useAppStore';
import Toast from 'react-native-toast-message';

export const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('7702858070');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const loginAction = useAppStore((state) => state.login);
  const registerAction = useAppStore((state) => state.register);
  const isLoading = useAppStore((state) => state.isLoading);
  const errorMsg = useAppStore((state) => state.error);

  const handleSubmit = async () => {
    if (!phone || !password) {
      Toast.show({ type: 'error', text1: 'Fields Required', text2: 'Please fill all mandatory fields.' });
      return;
    }

    if (isLogin) {
      const success = await loginAction(phone, password);
      if (success) {
        Toast.show({ type: 'success', text1: 'Welcome Back!', text2: 'Successfully signed in.' });
      } else {
        Toast.show({ type: 'error', text1: 'Login Failed', text2: errorMsg || 'Check your credentials.' });
      }
    } else {
      if (!fullName) {
        Toast.show({ type: 'error', text1: 'Name Required', text2: 'Please enter your full name.' });
        return;
      }
      if (password !== confirmPassword) {
        Toast.show({ type: 'error', text1: 'Mismatch', text2: 'Passwords do not match.' });
        return;
      }
      if (!agreeTerms) {
        Toast.show({ type: 'error', text1: 'Terms Required', text2: 'You must agree to the Terms.' });
        return;
      }
      const success = await registerAction(fullName, phone, password, referralCode);
      if (success) {
        Toast.show({ type: 'success', text1: 'Account Created', text2: 'Registration complete.' });
      } else {
        Toast.show({ type: 'error', text1: 'Registration Failed', text2: errorMsg || 'Something went wrong.' });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Background Decorative SVG feel */}
        <View style={styles.leafDecor1} />
        <View style={styles.leafDecor2} />

        {/* Logo Card */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>OF</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Sign in to access your green portfolio reserves' : 'Register to start clean energy investments'}
          </Text>

          {!isLogin && (
            <InputField
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              icon={<User size={20} color="#4A7C6F" />}
            />
          )}

          <View style={styles.phoneInputContainer}>
            <View style={styles.flagContainer}>
              <Text style={styles.flagText}>🇮🇳 +91</Text>
            </View>
            <View style={{ flex: 1 }}>
              <InputField
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                icon={<Phone size={20} color="#4A7C6F" />}
              />
            </View>
          </View>

          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Lock size={20} color="#4A7C6F" />}
          />

          {!isLogin && (
            <>
              <InputField
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                icon={<Lock size={20} color="#4A7C6F" />}
              />
              <InputField
                placeholder="Referral Code (Optional)"
                value={referralCode}
                onChangeText={setReferralCode}
                icon={<UserPlus size={20} color="#4A7C6F" />}
              />
              <Pressable 
                onPress={() => setAgreeTerms(!agreeTerms)} 
                style={styles.checkboxRow}
              >
                <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                  {agreeTerms && <View style={styles.checkboxCheck} />}
                </View>
                <Text style={styles.checkboxLabel}>I agree to the Terms & Conditions</Text>
              </Pressable>
            </>
          )}

          {isLogin && (
            <Pressable style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>
          )}

          <GradientButton
            title={isLoading ? 'Loading...' : isLogin ? 'Login' : 'Create Account'}
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </View>

        <Pressable 
          onPress={() => setIsLogin(!isLogin)} 
          style={styles.switchButton}
        >
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FBF7',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
  },
  leafDecor1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 200, 150, 0.1)',
  },
  leafDecor2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0, 122, 94, 0.05)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#00C896',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#4A7C6F',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagContainer: {
    height: 52,
    backgroundColor: '#E6FFF7',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginBottom: 16,
  },
  flagText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9ABFB5',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    borderColor: '#00C896',
    backgroundColor: '#00C896',
  },
  checkboxCheck: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#4A7C6F',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 14,
    color: '#00C896',
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 10,
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 15,
    color: '#007A5E',
    fontWeight: 'bold',
  },
});

export default AuthScreen;
