import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { ArrowLeft, Landmark, Plus, Edit3, Coins, Percent, AlertCircle, Clock } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import Toast from 'react-native-toast-message';

export const WithdrawScreen = ({ navigation }: any) => {
  const user = useAppStore((state) => state.user);
  const withdraw = useAppStore((state) => state.withdraw);
  const fetchProfile = useAppStore((state) => state.fetchProfile);

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const numAmount = parseFloat(amount) || 0;
  const fee = numAmount * 0.02;
  const receivedAmount = Math.max(0, numAmount - fee);

  const handleWithdraw = async () => {
    if (!user?.withdrawal_account) {
      Toast.show({
        type: 'error',
        text1: 'Add Account First',
        text2: 'Please link your bank or UPI details.'
      });
      navigation.navigate('WithdrawalAccount');
      return;
    }

    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      Toast.show({ type: 'error', text1: 'Invalid Amount', text2: 'Please enter a valid amount.' });
      return;
    }

    if (numAmt > Number(user?.balance || 0)) {
      Toast.show({ type: 'error', text1: 'Insufficient Balance', text2: 'Withdrawal exceeds wallet balance.' });
      return;
    }

    if (numAmt < 180) {
      Toast.show({ type: 'error', text1: 'Minimum Limit', text2: 'Minimum withdrawal is ₹180.00' });
      return;
    }

    setLoading(true);
    const success = await withdraw(numAmt);
    setLoading(false);

    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Withdrawal Submitted',
        text2: `₹${numAmt.toLocaleString()} queued successfully!`
      });
      navigation.goBack();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: 'Could not process request.'
      });
    }
  };

  const isBankBound = !!user?.withdrawal_account;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Withdraw</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Withdrawal Account Card */}
        {!isBankBound ? (
          <Pressable 
            onPress={() => navigation.navigate('WithdrawalAccount')}
            style={styles.emptyAccountCard}
          >
            <View style={styles.plusCircle}>
              <Plus size={24} color="#00C896" />
            </View>
            <Text style={styles.emptyAccountTitle}>Add Withdrawal Account</Text>
            <Text style={styles.emptyAccountSubtitle}>Add your bank/UPI to withdraw funds</Text>
          </Pressable>
        ) : (
          <View style={styles.accountCard}>
            <View style={styles.accountLeft}>
              <Landmark size={22} color="#00C896" />
              <View style={styles.accountTextContainer}>
                <Text style={styles.accountTitle}>{user?.withdrawal_bank || 'Bank Account'}</Text>
                <Text style={styles.accountSub}>Acc: *******{user?.withdrawal_account?.slice(-4)}</Text>
              </View>
            </View>
            <Pressable 
              onPress={() => navigation.navigate('WithdrawalAccount')}
              style={styles.editBtn}
            >
              <Edit3 size={18} color="#00C896" />
            </Pressable>
          </View>
        )}

        {/* Amount Input Card */}
        <View style={styles.amountCard}>
          <View style={styles.assetsRow}>
            <Text style={styles.assetsLabel}>Total Assets</Text>
            <Text style={styles.assetsVal}>₹{Number(user?.balance || 0).toFixed(2)}</Text>
          </View>

          <Text style={styles.inputLabel}>Withdrawal Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.input}
              placeholder="Please enter the withdrawal amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={(txt) => setAmount(txt.replace(/[^0-9.]/g, ''))}
              placeholderTextColor="#9ABFB5"
            />
          </View>
        </View>

        {/* Horizontal Scrollable Info Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.pillsScroll}
          contentContainerStyle={styles.pillsContent}
        >
          <View style={styles.pill}>
            <Coins size={14} color="#007A5E" style={{ marginRight: 6 }} />
            <Text style={styles.pillText}>Received: ₹{receivedAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.pill}>
            <Percent size={14} color="#007A5E" style={{ marginRight: 6 }} />
            <Text style={styles.pillText}>Fee: 2%</Text>
          </View>
          <View style={styles.pill}>
            <AlertCircle size={14} color="#007A5E" style={{ marginRight: 6 }} />
            <Text style={styles.pillText}>Min: ₹180</Text>
          </View>
          <View style={styles.pill}>
            <Clock size={14} color="#007A5E" style={{ marginRight: 6 }} />
            <Text style={styles.pillText}>Mon–Thu, 10 AM – 4 PM</Text>
          </View>
        </ScrollView>

        {/* Confirm Button */}
        <Pressable onPress={handleWithdraw} disabled={loading} style={styles.confirmBtn}>
          <Text style={styles.confirmBtnText}>{loading ? 'Processing...' : 'Confirm'}</Text>
        </Pressable>
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
  emptyAccountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00C896',
    borderStyle: 'dashed',
    marginBottom: 20,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  plusCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6FFF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emptyAccountTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#007A5E',
    marginBottom: 4,
  },
  emptyAccountSubtitle: {
    fontSize: 12,
    color: '#9ABFB5',
  },
  accountCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountTextContainer: {
    marginLeft: 12,
  },
  accountTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  accountSub: {
    fontSize: 12,
    color: '#9ABFB5',
    marginTop: 2,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6FFF7',
    justifyContent: 'center',
    alignItems: 'center',
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
  assetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0FBF7',
    paddingBottom: 12,
    marginBottom: 16,
  },
  assetsLabel: {
    fontSize: 13,
    color: '#9ABFB5',
  },
  assetsVal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00C896',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginBottom: 10,
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
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007A5E',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  pillsScroll: {
    marginBottom: 24,
  },
  pillsContent: {
    paddingRight: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFF7',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#C6F6E5',
  },
  pillText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007A5E',
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
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WithdrawScreen;
