import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { ArrowLeft, Phone, MessageSquare, Facebook, Send, Crown, User } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { GradientButton } from '../components/ui/GradientButton';
import api from '../services/api';
import Toast from 'react-native-toast-message';

export const EditProfileScreen = ({ navigation }: any) => {
  const user = useAppStore((state) => state.user);
  const fetchProfile = useAppStore((state) => state.fetchProfile);
  
  const [nickname, setNickname] = useState(user?.full_name || '');
  const [whatsapp, setWhatsapp] = useState('');
  const [facebook, setFacebook] = useState('');
  const [telegram, setTelegram] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nickname.trim()) {
      Toast.show({ type: 'error', text1: 'Name Required', text2: 'Please enter a valid nickname.' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/profile/update', { full_name: nickname });
      if (response.data?.profile) {
        await fetchProfile();
        Toast.show({ type: 'success', text1: 'Changes Saved', text2: 'Profile updated successfully!' });
        navigation.goBack();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Update Error',
        text2: error.response?.data?.error || 'Could not update profile.'
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
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.svgAvatar}>
              <User size={40} color="#007A5E" strokeWidth={2} />
            </View>
            {/* VIP Crown */}
            <View style={styles.crownBadge}>
              <Crown size={16} color="#FFD700" fill="#FFD700" />
            </View>
          </View>
          <Text style={styles.metaLabel}>ID: {user?.id.slice(0, 8).toUpperCase()}</Text>
          <Text style={styles.metaLabel}>Phone: +91 {user?.phone || '**********'}</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.fieldLabel}>Nick Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your nickname"
              value={nickname}
              onChangeText={setNickname}
              placeholderTextColor="#9ABFB5"
            />
          </View>

          {/* Contact info heading */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>

          {/* Whatsapp */}
          <View style={styles.iconFieldContainer}>
            <View style={styles.fieldIconLeft}>
              <MessageSquare size={20} color="#00C896" />
            </View>
            <TextInput
              style={styles.iconFieldInput}
              placeholder="WhatsApp Number"
              value={whatsapp}
              onChangeText={setWhatsapp}
              keyboardType="phone-pad"
              placeholderTextColor="#9ABFB5"
            />
          </View>

          {/* Facebook */}
          <View style={styles.iconFieldContainer}>
            <View style={styles.fieldIconLeft}>
              <Facebook size={20} color="#3B82F6" />
            </View>
            <TextInput
              style={styles.iconFieldInput}
              placeholder="Facebook Username"
              value={facebook}
              onChangeText={setFacebook}
              placeholderTextColor="#9ABFB5"
            />
          </View>

          {/* Telegram */}
          <View style={styles.iconFieldContainer}>
            <View style={styles.fieldIconLeft}>
              <Send size={20} color="#38BDF8" style={{ transform: [{ rotate: '-15deg' }] }} />
            </View>
            <TextInput
              style={styles.iconFieldInput}
              placeholder="Telegram Handle"
              value={telegram}
              onChangeText={setTelegram}
              placeholderTextColor="#9ABFB5"
            />
          </View>

          <GradientButton
            title={loading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            style={styles.saveBtn}
          />
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
  avatarSection: {
    alignItems: 'center',
    backgroundColor: '#007A5E',
    borderRadius: 24,
    paddingVertical: 24,
    marginBottom: 20,
    shadowColor: '#007A5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#00C896',
    position: 'relative',
    overflow: 'visible',
    marginBottom: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  svgAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#E6FFF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownBadge: {
    position: 'absolute',
    top: -14,
    left: 28,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editOverlay: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeLabel: {
    fontSize: 11,
    color: '#E6FFF7',
    opacity: 0.8,
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4A7C6F',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#E6FFF7',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#C6F6E5',
    marginBottom: 20,
  },
  input: {
    fontSize: 14,
    color: '#0D1F1A',
    fontWeight: 'bold',
  },
  sectionHeader: {
    borderLeftWidth: 3,
    borderLeftColor: '#00C896',
    paddingLeft: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  iconFieldContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6FFF7',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#C6F6E5',
    marginBottom: 12,
  },
  fieldIconLeft: {
    marginRight: 10,
  },
  iconFieldInput: {
    flex: 1,
    fontSize: 14,
    color: '#0D1F1A',
  },
  saveBtn: {
    marginTop: 16,
  },
});

export default EditProfileScreen;
