import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Crown, Share2, Clipboard, ShieldCheck, Check, Users, Award } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import Toast from 'react-native-toast-message';

export const VIPScreen = () => {
  const user = useAppStore((state) => state.user);
  const fetchProfile = useAppStore((state) => state.fetchProfile);
  const [team, setTeam] = useState<any>({ levelA: [], levelB: [], levelC: [] });
  const [loading, setLoading] = useState(false);
  const [activeTeamTab, setActiveTeamTab] = useState<'A' | 'B' | 'C'>('A');

  useFocusEffect(
    useCallback(() => {
      loadTeamData();
      fetchProfile();
    }, [])
  );

  const loadTeamData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vip/my-team');
      setTeam(res.data.team);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCopyLink = () => {
    Toast.show({
      type: 'success',
      text1: 'Link Copied!',
      text2: 'Referral link successfully copied to clipboard.'
    });
  };

  const getTeamList = () => {
    if (activeTeamTab === 'A') return team.levelA;
    if (activeTeamTab === 'B') return team.levelB;
    return team.levelC;
  };

  const ranks = [
    { name: 'Rookie Captain', threshold: '₹0', commission: '0%' },
    { name: 'Bronze Captain', threshold: '₹50,000', commission: '5%' },
    { name: 'Silver Captain', threshold: '₹100,000', commission: '10%' },
    { name: 'Gold Captain', threshold: '₹150,000', commission: '15%' },
    { name: 'Platinum Partner', threshold: '₹200,000', commission: '20%' },
    { name: 'Diamond Partner', threshold: '₹250,000', commission: '25%' }
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VIP Club & Referrals</Text>
      </View>

      {/* VIP Status Card */}
      <View style={styles.vipCard}>
        <View style={styles.vipHeader}>
          <View style={styles.vipBadge}>
            <Crown size={22} color="#FFD700" />
            <Text style={styles.vipBadgeText}>VIP 10 STATUS</Text>
          </View>
          <View style={styles.statusChip}>
            <ShieldCheck size={14} color="#FFD700" />
            <Text style={styles.statusChipText}>Active Partner</Text>
          </View>
        </View>

        <Text style={styles.vipDesc}>Refer 40 more A-level investors to level up</Text>
        
        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressFill, { width: '45%' }]} />
        </View>
        <Text style={styles.progressText}>Current Progress: 18 / 40 Investors</Text>
      </View>

      {/* Refer Friends Section */}
      <View style={styles.card}>
        <View style={styles.cardHeaderStrip}>
          <Text style={styles.cardHeaderStripText}>Refer Friends & Earn Passive Rewards</Text>
        </View>

        <View style={styles.referContainer}>
          <View style={styles.qrMock}>
            <View style={styles.qrMockBorder}>
              <Text style={styles.qrMockText}>[ QR CODE ]</Text>
            </View>
          </View>

          <Text style={styles.referLabel}>Your Referral Code</Text>
          <Text style={styles.referCode}>{user?.referral_code || 'REF-CODE'}</Text>

          <View style={styles.linkRow}>
            <TextInput
              value={`https://oilfund.net/auth/reg?ref=${user?.referral_code || 'REF'}`}
              editable={false}
              style={styles.linkInput}
            />
            <Pressable onPress={handleCopyLink} style={styles.copyBtn}>
              <Clipboard size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          <Pressable onPress={handleCopyLink} style={styles.shareBtn}>
            <Share2 size={18} color="#0D1F1A" style={{ marginRight: 8 }} />
            <Text style={styles.shareBtnText}>Share via WhatsApp</Text>
          </Pressable>
        </View>
      </View>

      {/* VIP Commission Rules */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Commission Structure</Text>
      </View>

      <View style={styles.tiersContainer}>
        <View style={[styles.tierCard, { borderLeftColor: '#00C896' }]}>
          <View style={[styles.tierBadge, { backgroundColor: '#E6FFF7' }]}>
            <Text style={[styles.tierBadgeText, { color: '#00C896' }]}>Tier A</Text>
          </View>
          <Text style={styles.tierRate}>7% Commission</Text>
          <Text style={styles.tierDesc}>Earned from your direct first-level referrals.</Text>
        </View>

        <View style={[styles.tierCard, { borderLeftColor: '#007A5E' }]}>
          <View style={[styles.tierBadge, { backgroundColor: '#E6FFF7' }]}>
            <Text style={[styles.tierBadgeText, { color: '#007A5E' }]}>Tier B</Text>
          </View>
          <Text style={styles.tierRate}>5% Commission</Text>
          <Text style={styles.tierDesc}>Earned from second-level sub-referrals.</Text>
        </View>

        <View style={[styles.tierCard, { borderLeftColor: '#9ABFB5' }]}>
          <View style={[styles.tierBadge, { backgroundColor: '#F3F4F6' }]}>
            <Text style={[styles.tierBadgeText, { color: '#9ABFB5' }]}>Tier C</Text>
          </View>
          <Text style={styles.tierRate}>3% Commission</Text>
          <Text style={styles.tierDesc}>Earned from third-level sub-referrals.</Text>
        </View>
      </View>

      {/* Position Rank Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Position Ranks</Text>
      </View>

      <View style={styles.rankGrid}>
        {ranks.map((r, index) => {
          const isCurrent = user?.rank === r.name;
          return (
            <View 
              key={index} 
              style={[
                styles.rankCard, 
                isCurrent && styles.rankCardActive
              ]}
            >
              <Award size={20} color={isCurrent ? '#FFD700' : '#4A7C6F'} style={{ marginBottom: 8 }} />
              <Text style={[styles.rankName, isCurrent && { color: '#00C896' }]}>{r.name}</Text>
              <Text style={styles.rankThreshold}>Min Invest: {r.threshold}</Text>
              <Text style={styles.rankCommission}>Commission: {r.commission}</Text>
            </View>
          );
        })}
      </View>

      {/* My Team Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Team Analytics</Text>
      </View>

      <View style={styles.teamCard}>
        <View style={styles.teamHeaderRow}>
          <View>
            <Text style={styles.teamLabel}>Commissions Earned</Text>
            <Text style={styles.teamVal}>₹{Number(user?.commission || 0).toFixed(2)}</Text>
          </View>
          <Users size={32} color="#FFD700" />
        </View>

        <View style={styles.teamStatsRow}>
          <View style={styles.teamStatCol}>
            <Text style={styles.teamStatVal}>{team.levelA.length + team.levelB.length + team.levelC.length}</Text>
            <Text style={styles.teamStatLabel}>Registrants</Text>
          </View>
          <View style={styles.teamStatCol}>
            <Text style={styles.teamStatVal}>{team.levelA.length}</Text>
            <Text style={styles.teamStatLabel}>Investors</Text>
          </View>
          <View style={styles.teamStatCol}>
            <Text style={styles.teamStatVal}>{team.levelA.filter((t: any) => t.investment_earned > 0).length}</Text>
            <Text style={styles.teamStatLabel}>A-level</Text>
          </View>
        </View>

        {/* Tab switcher */}
        <View style={styles.teamTabs}>
          {(['A', 'B', 'C'] as const).map((tab) => (
            <Pressable 
              key={tab}
              onPress={() => setActiveTeamTab(tab)} 
              style={[styles.teamTab, activeTeamTab === tab ? styles.teamTabActive : null]}
            >
              <Text style={[styles.teamTabText, activeTeamTab === tab ? styles.teamTabTextActive : null]}>
                Level {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Team Table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCol, { flex: 1.5 }]}>Mobile Number</Text>
          <Text style={styles.tableCol}>Level</Text>
          <Text style={styles.tableCol}>Commission</Text>
        </View>

        {getTeamList().length === 0 ? (
          <View style={styles.emptyTable}>
            <Text style={styles.emptyTableText}>No members registered in Level {activeTeamTab} yet.</Text>
          </View>
        ) : (
          getTeamList().map((item: any) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableColValue, { flex: 1.5 }]}>{item.mobile || '77****1234'}</Text>
              <Text style={styles.tableColValue}>Lvl {item.level}</Text>
              <Text style={[styles.tableColValue, { color: '#00C896', fontWeight: 'bold' }]}>
                ₹{Number(item.commission_earned || 0).toFixed(2)}
              </Text>
            </View>
          ))
        )}
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
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  vipCard: {
    backgroundColor: '#0D2018',
    borderRadius: 24,
    margin: 20,
    padding: 24,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  vipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vipBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 8,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusChipText: {
    fontSize: 11,
    color: '#FFD700',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  vipDesc: {
    fontSize: 14,
    color: '#E6FFF7',
    marginBottom: 16,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    color: '#9ABFB5',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  cardHeaderStrip: {
    backgroundColor: '#007A5E',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cardHeaderStripText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  referContainer: {
    alignItems: 'center',
    padding: 20,
  },
  qrMock: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: '#9ABFB5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    padding: 6,
  },
  qrMockBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#F0FBF7',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#00C896',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrMockText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#007A5E',
  },
  referLabel: {
    fontSize: 12,
    color: '#4A7C6F',
    marginBottom: 4,
  },
  referCode: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00C896',
    marginBottom: 16,
  },
  linkRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
  },
  linkInput: {
    flex: 1,
    backgroundColor: '#F0FBF7',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#4A7C6F',
    height: 40,
    borderWidth: 1,
    borderColor: '#E6FFF7',
  },
  copyBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#00C896',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'center',
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  tiersContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    marginBottom: 12,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  tierBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  tierRate: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginBottom: 4,
  },
  tierDesc: {
    fontSize: 12,
    color: '#4A7C6F',
  },
  rankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  rankCard: {
    width: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: '2.5%',
    marginBottom: 12,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  rankCardActive: {
    borderColor: '#00C896',
    backgroundColor: '#F0FBF7',
  },
  rankName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginBottom: 6,
  },
  rankThreshold: {
    fontSize: 11,
    color: '#4A7C6F',
    marginBottom: 2,
  },
  rankCommission: {
    fontSize: 11,
    color: '#007A5E',
    fontWeight: 'bold',
  },
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 16,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  teamHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0FBF7',
    paddingBottom: 12,
  },
  teamLabel: {
    fontSize: 12,
    color: '#4A7C6F',
    marginBottom: 4,
  },
  teamVal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  teamStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FBF7',
  },
  teamStatCol: {
    alignItems: 'center',
    flex: 1,
  },
  teamStatVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginBottom: 4,
  },
  teamStatLabel: {
    fontSize: 11,
    color: '#4A7C6F',
  },
  teamTabs: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  teamTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  teamTabActive: {
    borderBottomColor: '#00C896',
  },
  teamTabText: {
    fontSize: 12,
    color: '#4A7C6F',
    fontWeight: 'bold',
  },
  teamTabTextActive: {
    color: '#00C896',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0FBF7',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tableCol: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4A7C6F',
    textAlign: 'center',
  },
  emptyTable: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyTableText: {
    fontSize: 12,
    color: '#9ABFB5',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FBF7',
  },
  tableColValue: {
    flex: 1,
    fontSize: 12,
    color: '#0D1F1A',
    textAlign: 'center',
  },
});

export default VIPScreen;
