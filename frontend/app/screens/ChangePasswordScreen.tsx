import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { ArrowLeft, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react-native';
import { GradientButton } from '../components/ui/GradientButton';
import api from '../services/api';
import Toast from 'react-native-toast-message';

export const ChangePasswordScreen = ({ navigation }: any) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Eye Toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  // Strength Check
  const getStrengthLevel = () => {
    if (!newPassword) return null;
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (score <= 1) return 'weak';
    if (score === 2) return 'medium';
    return 'strong';
  };

  const strength = getStrengthLevel();

  const handleUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Required Fields', text2: 'Please fill all password fields.' });
      return;
    }
    if (newPassword.length < 6) {
      Toast.show({ type: 'error', text1: 'Invalid Length', text2: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Mismatch', text2: 'Confirm password does not match.' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/profile/change-password', { password: newPassword });
      if (response.data?.message) {
        Toast.show({ type: 'success', text1: 'Password Updated', text2: 'Credentials updated successfully!' });
        navigation.goBack();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Change Failed',
        text2: error.response?.data?.error || 'Could not change password.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Update Password Card */}
        <View style={styles.card}>
          <View style={styles.subHeaderRow}>
            <View style={styles.iconCircle}>
              <Lock size={20} color="#00C896" />
            </View>
            <Text style={styles.subheading}>Update Your Password</Text>
          </View>

          {/* Current Password */}
          <Text style={styles.fieldLabel}>Current Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              secureTextEntry={!showCurrent}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholderTextColor="#9ABFB5"
            />
            <Pressable onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeBtn}>
              {showCurrent ? <EyeOff size={18} color="#00C896" /> : <Eye size={18} color="#00C896" />}
            </Pressable>
          </View>

          {/* New Password */}
          <Text style={styles.fieldLabel}>New Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#9ABFB5"
            />
            <Pressable onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
              {showNew ? <EyeOff size={18} color="#00C896" /> : <Eye size={18} color="#00C896" />}
            </Pressable>
          </View>

          {/* Strength Bar */}
          {strength && (
            <View style={styles.strengthRow}>
              <View style={[styles.strengthBar, strength === 'weak' ? styles.weakBar : strength === 'medium' ? styles.mediumBar : styles.strongBar]} />
              <Text style={[styles.strengthText, strength === 'weak' ? styles.weakText : strength === 'medium' ? styles.mediumText : styles.strongText]}>
                {strength.toUpperCase()}
              </Text>
            </View>
          )}

          {/* Confirm Password */}
          <Text style={styles.fieldLabel}>Confirm New Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Repeat new password"
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#9ABFB5"
            />
            <Pressable onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
              {showConfirm ? <EyeOff size={18} color="#00C896" /> : <Eye size={18} color="#00C896" />}
            </Pressable>
          </View>

          <GradientButton
            title={loading ? 'Updating...' : 'Update Password'}
            onPress={handleUpdate}
            style={styles.updateBtn}
          />
        </View>

        {/* Security Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <ShieldAlert size={18} color="#007A5E" style={{ marginRight: 6 }} />
            <Text style={styles.tipsTitle}>Security Tips</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Use 8 or more characters in length.</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Mix uppercase letters, lowercase letters, numbers, and symbols.</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Do not reuse passwords from other financial applications.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FBF7',
  },
  header: {
    backgroundColor: '#007A5E',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6FFF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  subheading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007A5E',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A7C6F',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#E6FFF7',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#C6F6E5',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0D1F1A',
  },
  eyeBtn: {
    paddingLeft: 10,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: -8,
  },
  strengthBar: {
    height: 6,
    width: 60,
    borderRadius: 3,
    marginRight: 10,
  },
  weakBar: {
    backgroundColor: '#EF4444',
  },
  mediumBar: {
    backgroundColor: '#F59E0B',
  },
  strongBar: {
    backgroundColor: '#00C896',
  },
  strengthText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  weakText: {
    color: '#EF4444',
  },
  mediumText: {
    color: '#F59E0B',
  },
  strongText: {
    color: '#00C896',
  },
  updateBtn: {
    marginTop: 10,
  },
  tipsCard: {
    backgroundColor: '#E6FFF7',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#C6F6E5',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007A5E',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#00C896',
    marginRight: 8,
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    color: '#4A7C6F',
    lineHeight: 18,
  },
});

export default ChangePasswordScreen;
