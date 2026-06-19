import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { Bell, ArrowLeft, CheckCircle2, MessageSquare } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';

export const NotificationScreen = ({ navigation }: any) => {
  const notifications = useAppStore((state) => state.notifications);
  const fetchNotifications = useAppStore((state) => state.fetchNotifications);
  const markNotificationRead = useAppStore((state) => state.markNotificationRead);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    await fetchNotifications();
    setLoading(false);
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
  };

  const renderItem = ({ item }: any) => (
    <Pressable 
      onPress={() => !item.is_read && handleMarkRead(item.id)}
      style={[styles.notiCard, item.is_read ? null : styles.unreadCard]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBox, { backgroundColor: item.is_read ? '#E6FFF7' : '#00C896' }]}>
            <Bell size={18} color={item.is_read ? '#00C896' : '#FFFFFF'} />
          </View>
          <Text style={[styles.notiTitle, item.is_read ? null : styles.unreadTitle]}>{item.title}</Text>
        </View>
        {!item.is_read && (
          <Pressable onPress={() => handleMarkRead(item.id)} style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>New</Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.notiBody}>{item.message}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.notiTime}>
          {new Date(item.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        {!item.is_read && (
          <View style={styles.markReadRow}>
            <CheckCircle2 size={12} color="#00C896" />
            <Text style={styles.markReadText}>Mark read</Text>
          </View>
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00C896" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Bell size={48} color="#9ABFB5" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>No notifications found.</Text>
            </View>
          }
        />
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
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  notiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E6FFF7',
  },
  unreadCard: {
    borderColor: '#00C896',
    backgroundColor: '#FAFDFD',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  notiTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D1F1A',
    flex: 1,
  },
  unreadTitle: {
    color: '#007A5E',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notiBody: {
    fontSize: 13,
    color: '#4A7C6F',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0FBF7',
    paddingTop: 8,
  },
  notiTime: {
    fontSize: 11,
    color: '#9ABFB5',
  },
  markReadRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markReadText: {
    fontSize: 11,
    color: '#00C896',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    color: '#4A7C6F',
    fontSize: 14,
  },
});

export default NotificationScreen;
