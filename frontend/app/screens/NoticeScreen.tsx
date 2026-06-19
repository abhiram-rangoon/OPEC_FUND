import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, FlatList } from 'react-native';
import { ArrowLeft, Filter, Globe } from 'lucide-react-native';

export const NOTICES_DATA = [
  {
    id: '1',
    category: 'Updates',
    title: 'OPEC Sovereign Oil Fund Rules v4.2',
    date: 'June 18, 2026',
    time: '16:07',
    preview: 'We have updated the daily interest distribution schedules. Reinvestment pools will now distribute returns at 00:00 UTC daily.',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80',
    content: 'We have updated the daily interest distribution schedules. Reinvestment pools will now distribute returns at 00:00 UTC daily. All sovereign products can be bought under the standard limits (Max 3 contracts per user). VIP members receive priority settlement access.'
  },
  {
    id: '2',
    category: 'Market',
    title: 'El Mero Wind Farm Phase 2 Completion',
    date: 'June 15, 2026',
    time: '23:44',
    preview: 'We are thrilled to announce El Mero offshore installations are 100% complete and connected to regional grids.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    content: 'We are thrilled to announce El Mero offshore installations are 100% complete and connected to the main regional power grids. Investors holding active El Mero contracts will receive an extra 2.5% dividend payout this weekend.'
  },
  {
    id: '3',
    category: 'Events',
    title: 'Anti-Fraud & AML Compliance Announcement',
    date: 'June 10, 2026',
    time: '00:00',
    preview: 'To secure user portfolios, each investor is strictly limited to one account and one bound bank card.',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
    content: 'To secure user portfolios, each investor is strictly limited to one account and one bound bank card. Anyone running multiple accounts or binding identical bank details to multiple IDs will have their balance frozen pending verification.'
  }
];

const CATEGORIES = ['All', 'Updates', 'Market', 'Events'];

export const NoticeScreen = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredNotices = NOTICES_DATA.filter(n => 
    activeCategory === 'All' ? true : n.category === activeCategory
  );

  return (
    <View style={styles.container}>
      {/* Header with filter icon */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Notices</Text>
        <Pressable style={styles.filterBtn}>
          <Filter color="#FFFFFF" size={22} />
        </Pressable>
      </View>

      {/* Categories Horizontal Scroll */}
      <View style={styles.catWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catContent}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[styles.catPill, isActive ? styles.catPillActive : null]}
              >
                <Text style={[styles.catText, isActive ? styles.catTextActive : null]}>{cat}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Notice List */}
      <FlatList
        data={filteredNotices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => navigation.navigate('NoticeDetail', { notice: item })}
            style={styles.noticeCard}
          >
            <View style={styles.imgContainer}>
              <Image source={{ uri: item.image }} style={styles.cardImg} />
              <View style={styles.overlay}>
                <Text style={styles.overlayTitle} numberOfLines={1}>{item.title}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.sourceRow}>
                <View style={styles.greenDot} />
                <Text style={styles.sourceLabel}>OilFund</Text>
              </View>
              <Text style={styles.cardDate}>{item.date} {item.time}</Text>
            </View>

            <View style={styles.previewBox}>
              <Text style={styles.previewText} numberOfLines={2}>{item.preview}</Text>
            </View>
          </Pressable>
        )}
      />
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
  filterBtn: {
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
  catWrapper: {
    height: 60,
    justifyContent: 'center',
  },
  catContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  catPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E6FFF7',
  },
  catPillActive: {
    backgroundColor: '#00C896',
    borderColor: '#00C896',
  },
  catText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4A7C6F',
  },
  catTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E6FFF7',
  },
  imgContainer: {
    height: 180,
    position: 'relative',
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 122, 94, 0.75)',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  overlayTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C896',
    marginRight: 6,
  },
  sourceLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007A5E',
  },
  cardDate: {
    fontSize: 11,
    color: '#9ABFB5',
  },
  previewBox: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 6,
  },
  previewText: {
    fontSize: 12,
    color: '#4A7C6F',
    lineHeight: 18,
  },
});

export default NoticeScreen;
