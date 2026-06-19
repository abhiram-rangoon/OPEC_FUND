import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Clipboard, ActivityIndicator } from 'react-native';
import { ArrowLeft, Gift, Clock, AlertCircle } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import Toast from 'react-native-toast-message';
import api from '../services/api';

export const BonusScreen = ({ navigation }: any) => {
  const user = useAppStore((state) => state.user);
  const transactions = useAppStore((state) => state.transactions);
  const fetchTransactions = useAppStore((state) => state.fetchTransactions);
  const fetchProfile = useAppStore((state) => state.fetchProfile);

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const bonusHistory = transactions.filter((t) => t.type === 'bonus');
  const totalRedeemed = bonusHistory.reduce((acc, t) => acc + Number(t.amount), 0);

  const handlePaste = async () => {
    // Mock pasting or fetch clipboard
    try {
      setCode('OPEC-GREEN-2026');
      Toast.show({ type: 'info', text1: 'Pasted Code', text2: 'OPEC-GREEN-2026 pasted successfully.' });
    } catch (err) {
      console.log('Clipboard error', err);
    }
  };

  const handleRedeem = async () => {
    if (!code.trim()) {
      Toast.show({ type: 'error', text1: 'Code Required', text2: 'Please enter a bonus code.' });
      return;
    }

    setLoading(true);
    // Simulate API call to claim promo
    setTimeout(async () => {
      setLoading(false);
      if (code.toUpperCase().includes('OPEC')) {
        try {
          // Trigger a simulated transaction in the backend or local store
          await api.post('/transactions/recharge', { amount: 150, payment_method: 'PROMO_CODE' }); // gives wallet money
          await fetchProfile();
          await fetchTransactions();
          Toast.show({
            type: 'success',
            text1: 'Bonus Redeemed!',
            text2: '₹150.00 cash bonus has been credited to your wallet.'
          });
          setCode('');
        } catch (err) {
          Toast.show({ type: 'error', text1: 'Redemption Error', text2: 'Network error occurred.' });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid Code',
          text2: 'This bonus code has expired or is invalid.'
        });
      }
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Cash Bonus</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Redeemed Bonus Hero */}
        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroLabel}>Total Redeemed</Text>
            <Text style={styles.heroValue}>₹{totalRedeemed.toFixed(2)}</Text>
          </View>
          <View style={styles.giftIconContainer}>
            <Gift size={32} color="#FFFFFF" />
          </View>
        </View>

        {/* Redeem Form Card */}
        <View style={styles.redeemCard}>
          <Text style={styles.inputLabel}>Enter Bonus Code</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your cash bonus code"
              value={code}
              onChangeText={setCode}
              placeholderTextColor="#9ABFB5"
              autoCapitalize="characters"
            />
            <Pressable onPress={handlePaste} style={styles.pasteBtn}>
              <Text style={styles.pasteText}>Paste</Text>
            </Pressable>
          </View>

          <Pressable onPress={handleRedeem} disabled={loading} style={styles.redeemBtn}>
            <Text style={styles.redeemBtnText}>{loading ? 'Redeeming...' : 'Redeem Now'}</Text>
          </Pressable>
        </View>

        {/* Redemption History Card */}
        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Clock size={18} color="#007A5E" style={{ marginRight: 8 }} />
            <Text style={styles.historyTitle}>Redemption History</Text>
          </View>

          {bonusHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Gift size={40} color="#9ABFB5" style={{ marginBottom: 10 }} />
              <Text style={styles.emptyText}>No bonus codes redeemed yet</Text>
              <Text style={styles.emptySub}>Valid promotional codes will display here.</Text>
            </View>
          ) : (
            bonusHistory.map((item) => (
              <View key={item.id} style={styles.historyRow}>
                <View style={styles.rowLeft}>
                  <Text style={styles.rowCode}>{item.note || 'OPEC-PROMO'}</Text>
                  <Text style={styles.rowDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowAmount}>+₹{Number(item.amount).toFixed(2)}</Text>
                  <View style={[
                    styles.statusBadge,
                    item.status === 'approved' ? styles.statusSuccess : styles.statusPending
                  ]}>
                    <Text style={[
                      styles.statusText,
                      item.status === 'approved' ? styles.statusTextSuccess : styles.statusTextPending
                    ]}>
                      {item.status === 'approved' ? 'Success' : 'Pending'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
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
  heroCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00C896',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 3,
  },
  heroLabel: {
    fontSize: 12,
    color: '#E6FFF7',
    opacity: 0.9,
    marginBottom: 6,
  },
  heroValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  giftIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redeemCard: {
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
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#E6FFF7',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#C6F6E5',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  pasteBtn: {
    paddingLeft: 12,
  },
  pasteText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00C896',
  },
  redeemBtn: {
    backgroundColor: '#00C896',
    borderRadius: 50,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007A5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  redeemBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FBF7',
    paddingBottom: 12,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A7C6F',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: '#9ABFB5',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FBF7',
  },
  rowLeft: {
    flex: 1,
  },
  rowCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginBottom: 4,
  },
  rowDate: {
    fontSize: 11,
    color: '#9ABFB5',
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  rowAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00C896',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusSuccess: {
    backgroundColor: '#E6FFF7',
  },
  statusPending: {
    backgroundColor: '#FFFDF0',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTextSuccess: {
    color: '#00C896',
  },
  statusTextPending: {
    color: '#D97706',
  },
});

export default BonusScreen;
