import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { User, Landmark, Lock, FileText, Download, LogOut, ChevronRight, X, UserCircle, RefreshCcw } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { GradientButton } from '../components/ui/GradientButton';
import { InputField } from '../components/ui/InputField';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

export const ProfileScreen = ({ navigation }: any) => {
  const user = useAppStore((state) => state.user);
  const fetchProfile = useAppStore((state) => state.fetchProfile);
  const logout = useAppStore((state) => state.logout);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleLogout = () => {
    logout();
    Toast.show({ type: 'info', text1: 'Logged Out', text2: 'Session terminated.' });
  };

  const totalAssets = Number(user?.balance || 0) + Number(user?.commission || 0);

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <UserCircle size={20} color="#00C896" />, action: () => navigation.navigate('EditProfile') },
    { id: 'bank', label: 'Withdrawal Account', icon: <Landmark size={20} color="#FFD700" />, action: () => navigation.navigate('WithdrawalAccount') },
    { id: 'password', label: 'Password', icon: <Lock size={20} color="#00C896" />, action: () => navigation.navigate('ChangePassword') },
    { id: 'contract', label: 'Investment Contract', icon: <FileText size={20} color="#00C896" />, action: () => navigation.navigate('Contract') },
    { id: 'download', label: 'Download App', icon: <Download size={20} color="#3B82F6" />, action: () => {} },
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarBorder}>
            <View style={styles.svgAvatar}>
              <User size={44} color="#007A5E" strokeWidth={2} />
            </View>
          </View>
          <View style={styles.vipBadge}>
            <Text style={styles.vipBadgeText}>VIP {user?.vip_level || 0}</Text>
          </View>
        </View>

        <Text style={styles.name}>{user?.full_name || 'Member'}</Text>
        
        <View style={styles.rankBadge}>
          <Text style={styles.rankBadgeText}>{user?.rank || 'Rookie Captain'} 🏅</Text>
        </View>

        <Text style={styles.metaText}>
          ID: {user?.id.slice(0, 8).toUpperCase()}  |  Phone: +91 {user?.phone || '**********'}
        </Text>
      </View>

      {/* Assets Card */}
      <View style={styles.assetsCard}>
        <Text style={styles.assetsTitle}>Total Assets</Text>
        <Text style={styles.assetsVal}>₹{totalAssets.toFixed(2)}</Text>

        <View style={styles.assetsMetricsRow}>
          <View style={styles.metricCol}>
            <Text style={styles.metricLabel}>My Balance</Text>
            <Text style={styles.metricVal}>₹{Number(user?.balance || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.metricCol}>
            <Text style={styles.metricLabel}>Commission</Text>
            <Text style={styles.metricVal}>₹{Number(user?.commission || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.metricCol}>
            <Text style={styles.metricLabel}>Today's Income</Text>
            <Text style={[styles.metricVal, { color: '#3B82F6' }]}>₹0.00</Text>
          </View>
        </View>

        <View style={styles.ctaRow}>
          <GradientButton
            title="Recharge"
            onPress={() => navigation.navigate('Recharge')}
            style={styles.rechargeBtn}
          />
          <Pressable 
            onPress={() => navigation.navigate('Withdraw')} 
            style={styles.withdrawBtn}
          >
            <Text style={styles.withdrawBtnText}>Withdraw</Text>
          </Pressable>
        </View>
      </View>

      {/* Settings Menu List */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <Pressable 
            key={item.id} 
            onPress={item.action} 
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconContainer}>
                {item.icon}
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <ChevronRight size={18} color="#9ABFB5" />
          </Pressable>
        ))}

        <Pressable 
          onPress={handleLogout} 
          style={[styles.menuItem, { marginTop: 12 }]}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#FEE2E2' }]}>
              <LogOut size={20} color="#EF4444" />
            </View>
            <Text style={[styles.menuLabel, { color: '#EF4444' }]}>Logout</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FBF7',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#007A5E',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarBorder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#00C896',
    padding: 2,
    backgroundColor: '#FFFFFF',
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
  vipBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#0D2018',
  },
  vipBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0D2018',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  rankBadge: {
    backgroundColor: '#E6FFF7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  rankBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007A5E',
  },
  metaText: {
    fontSize: 12,
    color: '#E6FFF7',
    opacity: 0.8,
  },
  assetsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: -24,
    padding: 20,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderTopWidth: 4,
    borderTopColor: '#00C896',
  },
  assetsTitle: {
    fontSize: 12,
    color: '#9ABFB5',
    marginBottom: 4,
  },
  assetsVal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00C896',
    marginBottom: 16,
  },
  assetsMetricsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0FBF7',
    paddingVertical: 12,
    marginBottom: 16,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#4A7C6F',
    marginBottom: 4,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  ctaRow: {
    flexDirection: 'row',
  },
  rechargeBtn: {
    flex: 1,
    marginRight: 8,
  },
  withdrawBtn: {
    flex: 1,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#00C896',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    marginLeft: 8,
  },
  withdrawBtnText: {
    color: '#00C896',
    fontWeight: 'bold',
    fontSize: 15,
  },
  menuContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E6FFF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 31, 26, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  modalBtn: {
    marginTop: 16,
  },
});

export default ProfileScreen;
