import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, Landmark, CheckCircle, Trash2, X, Plus } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { GradientButton } from '../components/ui/GradientButton';
import Toast from 'react-native-toast-message';

export const WithdrawalAccountScreen = ({ navigation }: any) => {
  const user = useAppStore((state) => state.user);
  const updateWithdrawal = useAppStore((state) => state.updateWithdrawalAccount);

  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'Bank' | 'UPI'>('Bank');

  // Bank Form State
  const [bankName, setBankName] = useState(user?.withdrawal_bank || '');
  const [accNumber, setAccNumber] = useState(user?.withdrawal_account || '');
  const [confirmAcc, setConfirmAcc] = useState(user?.withdrawal_account || '');
  const [ifscCode, setIfscCode] = useState(user?.withdrawal_ifsc || '');
  const [holderName, setHolderName] = useState(user?.withdrawal_holder || '');

  // UPI Form State
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);

  const handleSaveBank = async () => {
    if (activeTab === 'Bank') {
      if (!bankName || !accNumber || !confirmAcc || !ifscCode || !holderName) {
        Toast.show({ type: 'error', text1: 'Fields Required', text2: 'Please fill all bank details.' });
        return;
      }
      if (accNumber !== confirmAcc) {
        Toast.show({ type: 'error', text1: 'Mismatch', text2: 'Account numbers do not match.' });
        return;
      }

      setModalVisible(false);
      const success = await updateWithdrawal(bankName, accNumber, ifscCode, holderName);
      if (success) {
        Toast.show({ type: 'success', text1: 'Bank Bound', text2: 'Bank account linked successfully!' });
      }
    } else {
      if (!upiId) {
        Toast.show({ type: 'error', text1: 'UPI ID Required', text2: 'Please enter a UPI handle.' });
        return;
      }
      // Simulate binding UPI ID as bank details
      setModalVisible(false);
      const success = await updateWithdrawal('UPI WALLET', upiId, 'UPI00000000', user?.full_name || 'Member');
      if (success) {
        Toast.show({ type: 'success', text1: 'UPI Bound', text2: 'UPI Address linked successfully!' });
      }
    }
  };

  const handleDelete = async () => {
    // Clear bank credentials in the database (simulate via API payload of empty strings)
    const success = await updateWithdrawal('', '', '', '');
    if (success) {
      setBankName('');
      setAccNumber('');
      setConfirmAcc('');
      setIfscCode('');
      setHolderName('');
      setUpiId('');
      Toast.show({ type: 'info', text1: 'Account Removed', text2: 'Withdrawal details cleared.' });
    }
  };

  const handleVerifyUpi = () => {
    if (!upiId.includes('@')) {
      Toast.show({ type: 'error', text1: 'Invalid Handle', text2: 'Please enter a valid UPI address.' });
      return;
    }
    setUpiVerified(true);
    Toast.show({ type: 'success', text1: 'Verified', text2: 'UPI address verified successfully.' });
  };

  const isBound = !!user?.withdrawal_account;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Withdrawal Account</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {!isBound ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <View style={styles.illustration}>
              <Landmark size={80} color="#00C896" />
            </View>
            <Text style={styles.emptyTitle}>No withdrawal account added</Text>
            <Text style={styles.emptySubtitle}>Add your bank account or UPI ID to withdraw your earnings</Text>
            <Pressable onPress={() => setModalVisible(true)} style={styles.addBtn}>
              <Plus size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.addBtnText}>Add Account</Text>
            </Pressable>
          </View>
        ) : (
          /* Card when Account exists */
          <View style={styles.accountCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <Landmark size={24} color="#00C896" />
                <Text style={styles.cardHeaderTitle}>{user?.withdrawal_bank || 'Bank Account'}</Text>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeText}>Active</Text>
              </View>
            </View>

            <Text style={styles.cardAccountNum}>
              {user?.withdrawal_account?.includes('@') 
                ? user?.withdrawal_account 
                : `Acc: *******${user?.withdrawal_account?.slice(-4)}`
              }
            </Text>
            <Text style={styles.cardHolder}>Holder: {user?.withdrawal_holder}</Text>
            {user?.withdrawal_ifsc !== 'UPI00000000' && (
              <Text style={styles.cardHolder}>IFSC: {user?.withdrawal_ifsc}</Text>
            )}

            <View style={styles.cardActionsRow}>
              <Pressable onPress={() => setModalVisible(true)} style={styles.outlinedActionBtn}>
                <Text style={styles.outlinedActionText}>Edit</Text>
              </Pressable>
              <Pressable onPress={handleDelete} style={styles.deleteBtn}>
                <Trash2 size={16} color="#EF4444" />
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add / Edit Account Bottom Sheet Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.modalContent}
              >
                {/* Drag Handle */}
                <View style={styles.dragHandle} />

                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeading}>Add Withdrawal Account</Text>
                  <Pressable onPress={() => setModalVisible(false)}>
                    <X size={20} color="#0D1F1A" />
                  </Pressable>
                </View>

                {/* Tabs */}
                <View style={styles.tabsRow}>
                  <Pressable 
                    onPress={() => setActiveTab('Bank')} 
                    style={[styles.tab, activeTab === 'Bank' ? styles.tabActive : null]}
                  >
                    <Text style={[styles.tabText, activeTab === 'Bank' ? styles.tabTextActive : null]}>Bank Account</Text>
                  </Pressable>
                  <Pressable 
                    onPress={() => setActiveTab('UPI')} 
                    style={[styles.tab, activeTab === 'UPI' ? styles.tabActive : null]}
                  >
                    <Text style={[styles.tabText, activeTab === 'UPI' ? styles.tabTextActive : null]}>UPI ID</Text>
                  </Pressable>
                </View>

                <ScrollView style={styles.modalFormScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  {activeTab === 'Bank' ? (
                    <View>
                      <Text style={styles.fieldLabel}>Account Holder Name</Text>
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.fieldInput} placeholder="Enter Full Name" value={holderName} onChangeText={setHolderName} placeholderTextColor="#9ABFB5" />
                      </View>

                      <Text style={styles.fieldLabel}>Account Number</Text>
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.fieldInput} placeholder="Enter Bank Account Number" keyboardType="numeric" value={accNumber} onChangeText={setAccNumber} placeholderTextColor="#9ABFB5" />
                      </View>

                      <Text style={styles.fieldLabel}>Re-enter Account Number</Text>
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.fieldInput} placeholder="Confirm Account Number" keyboardType="numeric" value={confirmAcc} onChangeText={setConfirmAcc} placeholderTextColor="#9ABFB5" />
                      </View>

                      <Text style={styles.fieldLabel}>IFSC Code</Text>
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.fieldInput} placeholder="e.g. SBIN0001234" value={ifscCode} onChangeText={setIfscCode} placeholderTextColor="#9ABFB5" />
                      </View>

                      <Text style={styles.fieldLabel}>Bank Name</Text>
                      <View style={styles.inputContainer}>
                        <TextInput style={styles.fieldInput} placeholder="e.g. State Bank of India" value={bankName} onChangeText={setBankName} placeholderTextColor="#9ABFB5" />
                      </View>
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.fieldLabel}>UPI ID</Text>
                      <View style={styles.upiInputRow}>
                        <View style={[styles.inputContainer, { flex: 1, marginBottom: 0 }]}>
                          <TextInput style={styles.fieldInput} placeholder="e.g. username@upi" value={upiId} onChangeText={(txt) => { setUpiId(txt); setUpiVerified(false); }} placeholderTextColor="#9ABFB5" autoCapitalize="none" />
                        </View>
                        <Pressable onPress={handleVerifyUpi} style={styles.verifyBtn}>
                          <Text style={styles.verifyBtnText}>{upiVerified ? 'Verified' : 'Verify'}</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}

                  <GradientButton
                    title="Save Account"
                    onPress={handleSaveBank}
                    style={styles.saveBtn}
                  />
                </ScrollView>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

// Help helper for nested click propagation blockers
const TouchableWithoutFeedback = ({ children, onPress }: any) => (
  <Pressable onPress={onPress}>{children}</Pressable>
);

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
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  illustration: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E6FFF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9ABFB5',
    textAlign: 'center',
    lineHeight: 18,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#00C896',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#007A5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E6FFF7',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginLeft: 12,
  },
  activeBadge: {
    backgroundColor: '#E6FFF7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#00C896',
  },
  cardAccountNum: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007A5E',
    marginBottom: 8,
  },
  cardHolder: {
    fontSize: 13,
    color: '#4A7C6F',
    marginTop: 4,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0FBF7',
    paddingTop: 16,
    marginTop: 16,
  },
  outlinedActionBtn: {
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#00C896',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  outlinedActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00C896',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 31, 26, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  dragHandle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F0FBF7',
    borderRadius: 50,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 50,
  },
  tabActive: {
    backgroundColor: '#00C896',
  },
  tabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4A7C6F',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  modalFormScroll: {
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  fieldLabel: {
    fontSize: 12,
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
    marginBottom: 16,
  },
  fieldInput: {
    fontSize: 14,
    color: '#0D1F1A',
  },
  upiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifyBtn: {
    backgroundColor: '#E6FFF7',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#00C896',
  },
  verifyBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#007A5E',
  },
  saveBtn: {
    marginTop: 10,
    marginBottom: 32,
  },
});

export default WithdrawalAccountScreen;
