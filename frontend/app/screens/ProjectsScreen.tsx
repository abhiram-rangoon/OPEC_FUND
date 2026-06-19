import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, ActivityIndicator, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { Clock, Users, TrendingUp, Wallet, CheckCircle, X } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { GradientButton } from '../components/ui/GradientButton';
import { useFocusEffect } from '@react-navigation/native';
import { InputField } from '../components/ui/InputField';
import Toast from 'react-native-toast-message';

export const ProjectsScreen = () => {
  const products = useAppStore((state) => state.products);
  const fetchProducts = useAppStore((state) => state.fetchProducts);
  const investAction = useAppStore((state) => state.invest);
  const user = useAppStore((state) => state.user);
  const fetchProfile = useAppStore((state) => state.fetchProfile);
  
  const [filterTab, setFilterTab] = useState<'on_sale' | 'sold_out'>('on_sale');
  const [loading, setLoading] = useState(false);
  
  // Invest Modal State
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [investing, setInvesting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
      fetchProfile();
    }, [])
  );

  const loadProducts = async () => {
    setLoading(true);
    await fetchProducts();
    setLoading(false);
  };

  const handleOpenInvest = (product: any) => {
    setSelectedProduct(product);
    setInvestAmount(product.investment_amount.toString());
  };

  const handleConfirmInvest = async () => {
    if (!selectedProduct) return;
    const amount = Number(investAmount);
    if (!amount || amount <= 0) {
      Toast.show({ type: 'error', text1: 'Invalid Amount', text2: 'Please enter a valid amount to invest.' });
      return;
    }

    setInvesting(true);
    const success = await investAction(selectedProduct.id, amount);
    setInvesting(false);
    
    if (success) {
      Toast.show({ type: 'success', text1: 'Investment Completed!', text2: `You successfully invested ₹${amount} in ${selectedProduct.name}.` });
      setSelectedProduct(null);
    } else {
      const errorMsg = useAppStore.getState().error;
      Toast.show({ type: 'error', text1: 'Investment Failed', text2: errorMsg || 'Transaction declined.' });
    }
  };

  // Filter products based on active status/stock
  const filteredProducts = products.filter(p => {
    if (filterTab === 'on_sale') {
      return p.stock_percentage > 0;
    } else {
      return p.stock_percentage <= 0;
    }
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Investment Projects</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Pressable 
          onPress={() => setFilterTab('on_sale')} 
          style={[styles.tab, filterTab === 'on_sale' ? styles.tabActive : null]}
        >
          <Text style={[styles.tabText, filterTab === 'on_sale' ? styles.tabTextActive : null]}>On Sale</Text>
        </Pressable>
        <Pressable 
          onPress={() => setFilterTab('sold_out')} 
          style={[styles.tab, filterTab === 'sold_out' ? styles.tabActive : null]}
        >
          <Text style={[styles.tabText, filterTab === 'sold_out' ? styles.tabTextActive : null]}>Sold Out</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00C896" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isLive = item.stock_percentage > 0;
            return (
              <View style={styles.productCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: item.image_url }} style={styles.projectImage} />
                  </View>
                  <View style={styles.headerRight}>
                    <View style={styles.titleRow}>
                      <Text style={styles.projectName} numberOfLines={1}>{item.name}</Text>
                      <View style={[styles.badge, isLive ? styles.badgeLive : styles.badgeSold]}>
                        <View style={[styles.pulseDot, isLive ? styles.dotGreen : styles.dotGrey]} />
                        <Text style={[styles.badgeText, isLive ? styles.textGreen : styles.textGrey]}>
                          {isLive ? 'LIVE' : 'SOLD OUT'}
                        </Text>
                      </View>
                    </View>

                    {/* Inside Stats grid */}
                    <View style={styles.statsGrid}>
                      <View style={styles.statItem}>
                        <Clock size={14} color="#4A7C6F" />
                        <Text style={styles.statText}>{item.term_days} Days</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Users size={14} color="#4A7C6F" />
                        <Text style={styles.statText}>Limit: {item.quantity_limit}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <TrendingUp size={14} color="#00C896" />
                        <Text style={[styles.statText, { color: '#00C896', fontWeight: 'bold' }]}>
                          ₹{((item.investment_amount * item.daily_income_rate) / 100).toFixed(0)} ({item.daily_income_rate}%)
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Wallet size={14} color="#4A7C6F" />
                        <Text style={styles.statText}>Total: ₹{item.total_income}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Bottom Row */}
                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValue}>₹{Number(item.investment_amount).toLocaleString()}</Text>
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${item.stock_percentage}%` }]} />
                    </View>
                    <Text style={styles.progressLabel}>Stock {item.stock_percentage}%</Text>
                  </View>

                  <GradientButton
                    title={isLive ? 'Invest' : 'Sold Out'}
                    onPress={() => isLive && handleOpenInvest(item)}
                    variant={isLive ? 'primary' : 'gold'}
                    style={styles.investBtn}
                    textStyle={styles.investBtnText}
                  />
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Buy Modal Sheet */}
      {selectedProduct && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedProduct(null)}
        >
          <TouchableWithoutFeedback onPress={() => setSelectedProduct(null)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <KeyboardAvoidingView 
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={styles.modalContent}
                >
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Confirm Investment</Text>
                    <Pressable onPress={() => setSelectedProduct(null)}>
                      <X size={24} color="#0D1F1A" />
                    </Pressable>
                  </View>

                  <Text style={styles.modalProdName}>{selectedProduct.name}</Text>
                  
                  <View style={styles.calcGrid}>
                    <View style={styles.calcBox}>
                      <Text style={styles.calcLabel}>Term</Text>
                      <Text style={styles.calcVal}>{selectedProduct.term_days} Days</Text>
                    </View>
                    <View style={styles.calcBox}>
                      <Text style={styles.calcLabel}>Daily Yield</Text>
                      <Text style={styles.calcVal}>{selectedProduct.daily_income_rate}%</Text>
                    </View>
                    <View style={styles.calcBox}>
                      <Text style={styles.calcLabel}>Wallet Balance</Text>
                      <Text style={[styles.calcVal, { color: '#00C896' }]}>₹{Number(user?.balance || 0).toFixed(2)}</Text>
                    </View>
                  </View>

                  <InputField
                    label="Enter Investment Amount"
                    placeholder="₹ Amount"
                    value={investAmount}
                    onChangeText={setInvestAmount}
                    keyboardType="numeric"
                  />

                  <GradientButton
                    title={investing ? 'Processing...' : 'Confirm & Invest Now'}
                    onPress={handleConfirmInvest}
                    style={styles.modalBtn}
                  />
                </KeyboardAvoidingView>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
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
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 200, 150, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 50,
  },
  tabActive: {
    backgroundColor: '#E6FFF7',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A7C6F',
  },
  tabTextActive: {
    color: '#00C896',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00C896',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  imageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#00C896',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectImage: {
    width: '100%',
    height: '100%',
  },
  headerRight: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D1F1A',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeLive: {
    backgroundColor: '#E6FFF7',
  },
  badgeSold: {
    backgroundColor: '#F3F4F6',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  dotGreen: {
    backgroundColor: '#22C55E',
  },
  dotGrey: {
    backgroundColor: '#9CA3AF',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  textGreen: {
    color: '#22C55E',
  },
  textGrey: {
    color: '#9CA3AF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 6,
  },
  statText: {
    fontSize: 12,
    color: '#4A7C6F',
    marginLeft: 4,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0FBF7',
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 10,
    color: '#9ABFB5',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00C896',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0FBF7',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00C896',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 10,
    color: '#4A7C6F',
    textAlign: 'center',
  },
  investBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 38,
  },
  investBtnText: {
    fontSize: 13,
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
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  modalProdName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007A5E',
    marginBottom: 20,
  },
  calcGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calcBox: {
    flex: 1,
    backgroundColor: '#E6FFF7',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  calcLabel: {
    fontSize: 11,
    color: '#4A7C6F',
    marginBottom: 4,
  },
  calcVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  modalBtn: {
    marginTop: 16,
  },
});

export default ProjectsScreen;
