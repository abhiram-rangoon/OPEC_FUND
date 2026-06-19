import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { ArrowLeft, Award, FileText, Download } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

const SECTIONS = [
  {
    id: 'I',
    title: 'PARTIES & DEFINITIONS',
    body: 'This Cooperation & Clean Energy Investment Agreement is entered between the registered account holder, hereinafter referred to as "the Investor," and the OPEC Sovereign Clean Energy Development Pool, hereinafter referred to as "the Fund."'
  },
  {
    id: 'II',
    title: 'CAPITAL DEPLOYMENT',
    body: 'The Investor pledges discretionary capital to finance sustainable infrastructural projects (e.g. offshore grid turbines, solar farms, and geothermal collectors) to earn daily interest yields under defined product schedules.'
  },
  {
    id: 'III',
    title: 'DISTRIBUTION & DIVIDENDS',
    body: 'Earnings will be distributed automatically at 00:00 UTC daily. Yield rates are governed by global grid outputs. The Fund provides 100% insurance guarantees on the initial deployed principal.'
  },
  {
    id: 'IV',
    title: 'COMPLIANCE & ANTI-MONEY LAUNDERING',
    body: 'To secure platform liquidity and conform to anti-fraud laws, the Investor shall link only one validated bank account or UPI ID. Any duplication of bank cards across accounts results in an immediate audit freeze.'
  },
  {
    id: 'V',
    title: 'TERM & LIQUIDATION',
    body: 'This agreement terminates automatically upon expiration of the product term. At expiration, the Fund returns the total principal to the withdrawable balance.'
  }
];

export const ContractScreen = ({ navigation }: any) => {

  const handleAgree = () => {
    Toast.show({ type: 'success', text1: 'Agreement Signed', text2: 'Digital contract signed successfully!' });
    navigation.goBack();
  };

  const handleDownload = () => {
    Toast.show({ type: 'info', text1: 'Downloading PDF', text2: 'Exporting digital copy to files...' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Investment Contract</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Seal section */}
        <View style={styles.sealContainer}>
          <View style={styles.sealCircle}>
            <Award size={48} color="#007A5E" />
          </View>
          <Text style={styles.sealTitle}>OPEC CLEAN ENERGY INITIATIVE</Text>
          <Text style={styles.sealSubtitle}>MUTUAL COOPERATION & INVESTMENT AGREEMENT</Text>
        </View>

        {/* Section Cards */}
        {SECTIONS.map((sec) => (
          <View key={sec.id} style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{sec.id}</Text>
              </View>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
            </View>
            <Text style={styles.sectionBody}>{sec.body}</Text>
          </View>
        ))}

        {/* Action Row */}
        <View style={styles.actionRow}>
          <Pressable onPress={handleAgree} style={styles.agreeBtn}>
            <Text style={styles.agreeBtnText}>I Agree</Text>
          </Pressable>
          <Pressable onPress={handleDownload} style={styles.downloadBtn}>
            <Download size={16} color="#00C896" style={{ marginRight: 6 }} />
            <Text style={styles.downloadBtnText}>Download PDF</Text>
          </Pressable>
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
  sealContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  sealCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6FFF7',
    borderWidth: 2.5,
    borderColor: '#00C896',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sealTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1F1A',
    letterSpacing: 1,
    textAlign: 'center',
  },
  sealSubtitle: {
    fontSize: 10,
    color: '#9ABFB5',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderTopWidth: 3,
    borderTopColor: '#00C896',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#00C896',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  sectionBody: {
    fontSize: 13,
    color: '#4A7C6F',
    lineHeight: 20,
    textAlign: 'justify',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  agreeBtn: {
    flex: 1.2,
    backgroundColor: '#00C896',
    height: 48,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#007A5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  agreeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  downloadBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00C896',
    height: 48,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadBtnText: {
    color: '#00C896',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ContractScreen;
