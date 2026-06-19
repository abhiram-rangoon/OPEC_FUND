import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Share } from 'react-native';
import { ArrowLeft, Share2 } from 'lucide-react-native';

export const NoticeDetailScreen = ({ route, navigation }: any) => {
  const { notice } = route.params;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${notice.title}\n\n${notice.content}\n\nRead more on OPEC OilFund!`,
      });
    } catch (error: any) {
      console.log('Error sharing notice:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Image (full width) */}
      <View style={styles.imgWrapper}>
        <Image source={{ uri: notice.image }} style={styles.headerImg} />
        
        {/* Floating Back and Share buttons */}
        <View style={styles.actionHeader}>
          <Pressable onPress={() => navigation.goBack()} style={styles.floatingBtn}>
            <ArrowLeft color="#FFFFFF" size={22} />
          </Pressable>
          <Pressable onPress={handleShare} style={styles.floatingBtn}>
            <Share2 color="#FFFFFF" size={22} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{notice.title}</Text>
        
        <View style={styles.metaRow}>
          <View style={styles.sourceBox}>
            <View style={styles.greenDot} />
            <Text style={styles.sourceLabel}>OilFund Official</Text>
          </View>
          <Text style={styles.dateText}>{notice.date} {notice.time}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.bodyContent}>{notice.content}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imgWrapper: {
    height: 240,
    width: '100%',
    position: 'relative',
  },
  headerImg: {
    width: '100%',
    height: '100%',
  },
  actionHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  floatingBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 77, 61, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D1F1A',
    lineHeight: 28,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sourceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFF7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C896',
    marginRight: 6,
  },
  sourceLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#007A5E',
  },
  dateText: {
    fontSize: 11,
    color: '#9ABFB5',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0FBF7',
    marginBottom: 16,
  },
  bodyContent: {
    fontSize: 14,
    color: '#4A7C6F',
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default NoticeDetailScreen;
