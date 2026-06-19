import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { ArrowLeft, Check, Lightbulb } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';
import Toast from 'react-native-toast-message';

const QUICK_AMOUNTS = [1400, 2000, 5000, 20000, 50000];
const CHANNELS = [
  { id: 'BANK1', label: 'BANK1 ₹200–₹15,000' },
  { id: 'BANK2', label: 'BANK2 ₹1,000–₹10,000' },
  { id: 'BANK3', label: 'BANK3 ₹5,000–₹97,000' },
  { id: 'SPA1', label: 'SPA1 ₹10,000–₹1,00,000' },
  { id: 'USDT', label: 'USDT (TRC20)' }
];

export const RechargeScreen = ({ navigation }: any) => {
  const user = useAppStore((state) => state.user);
  const recharge = useAppStore((state) => state.recharge);

  const [amount, setAmount] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('BANK1');
  const [loading, setLoading] = useState(false);

  const handleRecharge = async () => {
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      Toast.show({ type: 'error', text1: 'Invalid Amount', text2: 'Please enter a valid deposit amount.' });
      return;
    }
    if (numAmt < 200) {
      Toast.show({ type: 'error', text1: 'Minimum Limit', text2: 'Minimum recharge amount is ₹200.00' });
      return;
    }

    setLoading(true);
    const success = await recharge(numAmt, selectedChannel);
    setLoading(false);

    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Recharge Success',
        text2: `Simulated deposit of ₹${numAmt.toLocaleString()} via ${selectedChannel} complete!`
      });
      navigation.goBack();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Recharge Failed',
        text2: 'Could not process payment.'
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header bar with Green Gradient styling */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Recharge</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Amount Card */}
        <View style={styles.amountCard}>
          <Text style={styles.cardLabel}>Enter Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={(txt) => setAmount(txt.replace(/[^0-9]/g, ''))}
              placeholderTextColor="#9ABFB5"
            />
          </View>

          {/* Quick amount wrap grid */}
          <View style={styles.quickGrid}>
            {QUICK_AMOUNTS.map((amt) => (
              <Pressable
                key={amt}
                onPress={() => setAmount(amt.toString())}
                style={[
                  styles.quickBtn,
                  amount === amt.toString() ? styles.quickBtnSelected : null
                ]}
              >
                <Text style={[
                  styles.quickText,
                  amount === amt.toString() ? styles.quickTextSelected : null
                ]}>₹{amt.toLocaleString()}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Payment Channels */}
        <View style={styles.channelCard}>
          <Text style={styles.channelHeader}>Select Payment Channel</Text>
          <View style={styles.channelGrid}>
            {CHANNELS.map((ch) => {
              const isSelected = selectedChannel === ch.id;
              return (
                <Pressable
                  key={ch.id}
                  onPress={() => setSelectedChannel(ch.id)}
                  style={[
                    styles.channelBtn,
                    isSelected ? styles.channelBtnSelected : null
                  ]}
                >
                  {isSelected && <Check size={14} color="#FFFFFF" style={{ marginRight: 6 }} />}
                  <Text style={[
                    styles.channelText,
                    isSelected ? styles.channelTextSelected : null
                  ]}>{ch.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.minInfoRow}>
            <View style={styles.greenDot} />
            <Text style={styles.minInfoText}>Minimum recharge amount is ₹200</Text>
          </View>
        </View>

        {/* Confirm Button */}
        <Pressable onPress={handleRecharge} disabled={loading} style={styles.confirmBtn}>
          <Text style={styles.confirmBtnText}>{loading ? 'Processing...' : 'Confirm'}</Text>
        </Pressable>

        {/* Kind Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Lightbulb size={18} color="#007A5E" style={{ marginRight: 6 }} />
            <Text style={styles.tipsTitle}>Important Tips</Text>
          </View>
          <Text style={styles.tipsBody}>
            The large number of daily deposit users may cause temporary congestion in the bank's system. If a deposit fails, you can try to re-initiate the deposit operation. If you still cannot succeed after multiple attempts, we suggest you check your account status or contact customer service for assistance.
          </Text>

          <View style={styles.reminderHeader}>
            <Text style={styles.reminderTitle}>Friendly Reminder</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>All OPEC Fund users must not save the recipient's UPI account information for duplicate payments when making deposits.</Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Each time you deposit, you must first log in to the official OPEC Fund application and use the real-time account information displayed on the OPEC Fund app for each payment transaction. Do not save the recipient's bank account information.</Text>
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
  amountCard: {
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
  cardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6FFF7',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#C6F6E5',
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007A5E',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickBtn: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00C896',
  },
  quickBtnSelected: {
    backgroundColor: '#00C896',
    borderColor: '#00C896',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  quickText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#00C896',
  },
  quickTextSelected: {
    color: '#FFFFFF',
  },
  channelCard: {
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
  channelHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginBottom: 12,
  },
  channelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  channelBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00C896',
  },
  channelBtnSelected: {
    backgroundColor: '#00C896',
    borderColor: '#00C896',
  },
  channelText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#00C896',
  },
  channelTextSelected: {
    color: '#FFFFFF',
  },
  minInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C896',
    marginRight: 8,
  },
  minInfoText: {
    fontSize: 12,
    color: '#4A7C6F',
  },
  confirmBtn: {
    backgroundColor: '#00C896',
    borderRadius: 50,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007A5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007A5E',
  },
  tipsBody: {
    fontSize: 12,
    color: '#4A7C6F',
    lineHeight: 18,
    marginBottom: 16,
  },
  reminderHeader: {
    borderLeftWidth: 3,
    borderLeftColor: '#00C896',
    paddingLeft: 8,
    marginBottom: 10,
  },
  reminderTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0D1F1A',
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

export default RechargeScreen;
