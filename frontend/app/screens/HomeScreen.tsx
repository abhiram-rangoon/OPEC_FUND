import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { Bell, MessageSquare, CreditCard, Landmark, Gift, Clipboard, ArrowRight, ChevronRight, HelpCircle } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import GlassCard from '../components/ui/GlassCard';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const BANNERS = [
  { id: '1', title: 'Offshore Wind Farm Grid', amount: '$45M', location: 'North Sea', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80' },
  { id: '2', title: 'Solar Reserve Phase IV', amount: '$28M', location: 'Rajasthan', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80' },
  { id: '3', title: 'Geothermal Thermal Basin', amount: '$12M', location: 'Iceland', image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80' }
];

export const HomeScreen = ({ navigation }) => {
  const user = useAppStore((state) => state.user);
  const investments = useAppStore((state) => state.investments);
  const fetchProfile = useAppStore((state) => state.fetchProfile);
  const fetchInvestments = useAppStore((state) => state.fetchInvestments);
  const recharge = useAppStore((state) => state.recharge);
  const withdraw = useAppStore((state) => state.withdraw);

  const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active');
  const [aboutOpen, setAboutOpen] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  const bannerRef = useRef<FlatList>(null);

  // Load dashboard data whenever screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Handle banner auto-scrolling
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentBannerIndex + 1) % BANNERS.length;
      setCurrentBannerIndex(nextIndex);
      bannerRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4000);
    return () => clearInterval(interval);
  }, [currentBannerIndex]);

  const loadData = async () => {
    setRefreshing(true);
    await Promise.all([fetchProfile(), fetchInvestments()]);
    setRefreshing(false);
  };

  const handleQuickAction = (type: string) => {
    if (type === 'recharge') {
      navigation.navigate('Recharge');
    } else if (type === 'withdraw') {
      navigation.navigate('Withdraw');
    } else if (type === 'bonus') {
      navigation.navigate('Bonus');
    } else {
      navigation.navigate('Notice');
    }
  };

  // Computations
  const totalAssets = Number(user?.balance || 0) + Number(user?.commission || 0);
  const investmentAmount = investments.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const earned = investments.reduce((acc, inv) => acc + Number(inv.total_income), 0);
  const dailyIncome = investments.reduce((acc, inv) => acc + Number(inv.daily_income), 0);
  const estimatedTotal = investmentAmount + earned;

  const filteredInvestments = investments.filter(inv => inv.status === activeTab);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header glass card */}
      <View style={styles.headerBackground}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={styles.greeting} numberOfLines={1} ellipsizeMode="tail">
              Good Morning, {user?.full_name || 'Member'} 👋
            </Text>
            <Text style={styles.subtext} numberOfLines={1} ellipsizeMode="tail">
              ID: {user?.id ? user.id.slice(0, 8).toUpperCase() : '******'} | +91 {user?.phone || '**********'}
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <Pressable onPress={() => navigation.navigate('Notifications')} style={styles.iconBtn}>
              <Bell color="#FFFFFF" size={22} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Chat')} style={styles.iconBtn}>
              <MessageSquare color="#FFFFFF" size={22} />
            </Pressable>
          </View>
        </View>

        <GlassCard style={styles.assetsCard}>
          {/* Decorative Sparkline path */}
          <View style={styles.sparklineBackground}>
            <Text style={{ opacity: 0.1, color: '#FFFFFF', fontSize: 80, fontWeight: 'bold', position: 'absolute', bottom: -20, right: 0 }}>📈</Text>
          </View>
          <Text style={styles.assetsLabel}>Total Assets</Text>
          <Text style={styles.assetsValue}>₹{totalAssets.toFixed(2)}</Text>
          <Text style={styles.balanceSub}>Wallet Balance: ₹{Number(user?.balance || 0).toFixed(2)}</Text>
        </GlassCard>
      </View>

      {/* Auto scrolling Banner */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={bannerRef}
          data={BANNERS}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentBannerIndex(index);
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bannerCard}>
              <Image source={{ uri: item.image }} style={styles.bannerImage} />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerTag}>LIVE INVESTMENT</Text>
                <Text style={styles.bannerTitle}>{item.title}</Text>
                <View style={styles.bannerMetaRow}>
                  <Text style={styles.bannerMetaText}>Target: {item.amount}</Text>
                  <Text style={styles.bannerMetaDivider}>•</Text>
                  <Text style={styles.bannerMetaText}>{item.location}</Text>
                </View>
              </View>
            </View>
          )}
        />
        <View style={styles.dotContainer}>
          {BANNERS.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                currentBannerIndex === index ? styles.dotActive : null
              ]} 
            />
          ))}
        </View>
      </View>

      {/* Quick actions grid */}
      <View style={styles.actionGrid}>
        <Pressable onPress={() => handleQuickAction('recharge')} style={[styles.actionCard, { backgroundColor: '#E6FFF7' }]}>
          <View style={[styles.actionIconContainer, { backgroundColor: '#00C896' }]}>
            <CreditCard color="#FFFFFF" size={24} />
          </View>
          <Text style={styles.actionLabel}>Recharge</Text>
        </Pressable>

        <Pressable onPress={() => handleQuickAction('withdraw')} style={[styles.actionCard, { backgroundColor: '#FFFDF0' }]}>
          <View style={[styles.actionIconContainer, { backgroundColor: '#FFD700' }]}>
            <Landmark color="#0D1F1A" size={24} />
          </View>
          <Text style={styles.actionLabel}>Withdraw</Text>
        </Pressable>

        <Pressable onPress={() => handleQuickAction('bonus')} style={[styles.actionCard, { backgroundColor: '#F0FFFA' }]}>
          <View style={[styles.actionIconContainer, { backgroundColor: '#00E5B0' }]}>
            <Gift color="#FFFFFF" size={24} />
          </View>
          <Text style={styles.actionLabel}>Cash Bonus</Text>
        </Pressable>

        <Pressable onPress={() => handleQuickAction('notice')} style={[styles.actionCard, { backgroundColor: '#F0F5FF' }]}>
          <View style={[styles.actionIconContainer, { backgroundColor: '#3B82F6' }]}>
            <Clipboard color="#FFFFFF" size={24} />
          </View>
          <Text style={styles.actionLabel}>Notice</Text>
        </Pressable>
      </View>

      {/* About Section */}
      <Pressable onPress={() => setAboutOpen(!aboutOpen)} style={styles.aboutCard}>
        <View style={styles.aboutHeader}>
          <View style={styles.aboutTitleRow}>
            <View style={styles.aboutGreenAccent} />
            <Text style={styles.aboutTitle}>About OPEC OilFund</Text>
          </View>
          <ChevronRight size={20} color="#4A7C6F" style={{ transform: [{ rotate: aboutOpen ? '90deg' : '0deg' }] }} />
        </View>
        {aboutOpen && (
          <View style={styles.aboutBody}>
            <Text style={styles.aboutText}>
              The OPEC Fund for International Development is a multilateral development finance institution established in 1976. Our clean energy and sovereign reserves investment pool offers high-yield assets to help build and finance sustainable development projects globally.
            </Text>
          </View>
        )}
      </Pressable>

      {/* My Investments Metrics */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Investments</Text>
        <Pressable style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View All</Text>
          <ArrowRight size={14} color="#00C896" />
        </Pressable>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>₹{investmentAmount.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Investment Amount</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: '#FFD700' }]}>₹{earned.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: '#3B82F6' }]}>₹{dailyIncome.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Daily Income</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: '#8B5CF6' }]}>₹{estimatedTotal.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Estimated Total</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Pressable 
          onPress={() => setActiveTab('active')} 
          style={[styles.tab, activeTab === 'active' ? styles.tabActive : null]}
        >
          <Text style={[styles.tabText, activeTab === 'active' ? styles.tabTextActive : null]}>Active</Text>
        </Pressable>
        <Pressable 
          onPress={() => setActiveTab('expired')} 
          style={[styles.tab, activeTab === 'expired' ? styles.tabActive : null]}
        >
          <Text style={[styles.tabText, activeTab === 'expired' ? styles.tabTextActive : null]}>Expired</Text>
        </Pressable>
      </View>

      {/* Investment List / Empty state */}
      {filteredInvestments.length === 0 ? (
        <View style={styles.emptyState}>
          <HelpCircle size={48} color="#9ABFB5" style={{ marginBottom: 12 }} />
          <Text style={styles.emptyText}>No investment records found in this category.</Text>
        </View>
      ) : (
        filteredInvestments.map((inv) => (
          <View key={inv.id} style={styles.invCard}>
            <View style={styles.invCardLeft}>
              <Text style={styles.invName}>{inv.product?.name || 'Investment Pool'}</Text>
              <Text style={styles.invTerm}>Term: {inv.product?.term_days || 7} Days</Text>
            </View>
            <View style={styles.invCardRight}>
              <Text style={styles.invVal}>₹{Number(inv.amount).toFixed(2)}</Text>
              <Text style={styles.invStatus}>{inv.status.toUpperCase()}</Text>
            </View>
          </View>
        ))
      )}
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
  headerBackground: {
    backgroundColor: '#007A5E',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtext: {
    fontSize: 12,
    color: '#E6FFF7',
    marginTop: 4,
    opacity: 0.8,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  assetsCard: {
    padding: 20,
  },
  sparklineBackground: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    left: 0,
    top: 0,
  },
  assetsLabel: {
    fontSize: 14,
    color: '#E6FFF7',
    opacity: 0.9,
  },
  assetsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 8,
  },
  balanceSub: {
    fontSize: 14,
    color: '#E6FFF7',
    opacity: 0.8,
  },
  carouselContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  bannerCard: {
    width: width - 40,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 77, 61, 0.55)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 6,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bannerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerMetaText: {
    fontSize: 12,
    color: '#E6FFF7',
  },
  bannerMetaDivider: {
    color: '#E6FFF7',
    marginHorizontal: 8,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9ABFB5',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 18,
    backgroundColor: '#00C896',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionCard: {
    width: (width - 60) / 2,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 16,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#00C896',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  aboutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutGreenAccent: {
    width: 0,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  aboutBody: {
    marginTop: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#4A7C6F',
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#00C896',
    fontWeight: 'bold',
    marginRight: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 10,
    marginBottom: 16,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00C896',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#4A7C6F',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6FFF7',
    borderRadius: 50,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 16,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A7C6F',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#4A7C6F',
    textAlign: 'center',
  },
  invCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#00c896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  invCardLeft: {
    flex: 1,
  },
  invName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginBottom: 4,
  },
  invTerm: {
    fontSize: 12,
    color: '#4A7C6F',
  },
  invCardRight: {
    alignItems: 'flex-end',
  },
  invVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00C896',
    marginBottom: 4,
  },
  invStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#22C55E',
    backgroundColor: '#E6FFF7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default HomeScreen;
