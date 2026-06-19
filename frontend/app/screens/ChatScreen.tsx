import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking, TextInput, KeyboardAvoidingView, Platform, Image, Modal } from 'react-native';
import { ArrowLeft, MessageSquare, Phone, Mail, ChevronDown, ChevronUp, Send, User, Check, Headphones } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

const FAQ_ITEMS = [
  {
    question: 'How long does a recharge take to credit?',
    answer: 'Recharge deposits typically take between 5 to 10 minutes to process. Please ensure you submit the correct 12-digit UTR/Reference ID from your payment receipt.'
  },
  {
    question: 'What are the withdrawal processing hours?',
    answer: 'Withdrawals are processed Monday through Thursday between 10:00 AM and 04:00 PM. Verification audits complete within 24 hours.'
  },
  {
    question: 'Can I link multiple bank cards?',
    answer: 'No. OPEC compliance enforces a strict single-user policy. You can bind only one bank card or UPI ID to prevent anti-money laundering actions.'
  }
];

export const ChatScreen = ({ navigation }: any) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [chatVisible, setChatVisible] = useState(false);
  
  // Interactive Chat State
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Welcome to OPEC Clean Energy Support. Let us know if you have questions about deposits, rates, or contracts!',
      sender: 'agent',
      timestamp: '15:02'
    }
  ]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/436789031206271').catch(() => {
      Toast.show({ type: 'error', text1: 'App Missing', text2: 'WhatsApp is not installed on this device.' });
    });
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@oilfund.app').catch(() => {
      Toast.show({ type: 'error', text1: 'Mail Client Error', text2: 'Could not open mail app.' });
    });
  };

  const handleSendChat = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => {
      let reply = 'Our support executives are verifying your query. Please upload proof of payment or verify bank details if your request concerns wallet balances.';
      if (inputText.toLowerCase().includes('withdraw') || inputText.toLowerCase().includes('fee')) {
        reply = 'Withdrawals carry a 2% processing fee and are completed between Monday and Thursday from 10 AM to 4 PM.';
      } else if (inputText.toLowerCase().includes('recharge') || inputText.toLowerCase().includes('deposit')) {
        reply = 'Make sure you copy the UPI ID from our deposit wizard, finish payment, and submit the 12-digit reference number.';
      }
      setChatMessages(prev => [...prev, {
        id: Math.random().toString(),
        text: reply,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Help Header Title */}
        <View style={styles.helpTitleCard}>
          <Text style={styles.helpTitleText}>How can we help you?</Text>
        </View>

        {/* Support Card */}
        <View style={styles.supportCard}>
          {/* Agent Row */}
          <View style={styles.agentRow}>
            <View style={styles.avatarContainer}>
              <Headphones size={24} color="#00C896" />
            </View>
            <View style={styles.agentInfo}>
              <Text style={styles.agentName}>Customer Service Manager</Text>
              <Text style={styles.agentTitle}>Professional Manager</Text>
            </View>
            <Pressable onPress={() => setChatVisible(true)} style={styles.msgBtn}>
              <MessageSquare size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.msgBtnText}>Message</Text>
            </Pressable>
          </View>

          <View style={styles.mintDivider} />

          {/* WhatsApp Row */}
          <View style={styles.whatsappRow}>
            <View style={[styles.optionIcon, { backgroundColor: '#E6FFF7' }]}>
              <Phone size={20} color="#00C896" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionLabel}>WhatsApp Support</Text>
              <Text style={styles.optionValue}>+43 6789031206271</Text>
            </View>
            <Pressable onPress={handleWhatsApp} style={styles.contactOutlinedBtn}>
              <Text style={styles.contactOutlinedText}>Contact</Text>
            </Pressable>
          </View>
        </View>

        {/* Additional support rows */}
        <View style={styles.optionList}>
          {/* Email Row */}
          <Pressable onPress={handleEmail} style={styles.optionCard}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIconBox, { backgroundColor: '#F0F5FF' }]}>
                <Mail size={18} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.optionCardTitle}>Email Support</Text>
                <Text style={styles.optionCardSub}>support@oilfund.app</Text>
              </View>
            </View>
            <Text style={styles.optionTimeNotice}>⏱ Responds in 2h</Text>
          </Pressable>
        </View>

        {/* FAQ Section Accordion */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqContainer}>
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <View key={idx} style={styles.faqCard}>
                <Pressable onPress={() => toggleFaq(idx)} style={styles.faqQuestionRow}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  {isOpen ? <ChevronUp size={18} color="#007A5E" /> : <ChevronDown size={18} color="#007A5E" />}
                </Pressable>
                {isOpen && (
                  <View style={styles.faqAnswerBox}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Interactive Live Chat Modal */}
      <Modal visible={chatVisible} animationType="slide" transparent={false}>
        <View style={styles.chatModalContainer}>
          {/* Chat Modal Header */}
          <View style={styles.chatModalHeader}>
            <Pressable onPress={() => setChatVisible(false)} style={styles.modalBackBtn}>
              <ArrowLeft color="#FFFFFF" size={24} />
            </Pressable>
            <Text style={styles.modalHeaderTitle}>Live OPEC Support</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Messages */}
          <ScrollView contentContainerStyle={styles.chatScrollContent} showsVerticalScrollIndicator={false}>
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View key={msg.id} style={[styles.msgContainer, isUser ? styles.msgUser : styles.msgAgent]}>
                  <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAgent]}>
                    <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAgent]}>{msg.text}</Text>
                    <View style={styles.bubbleMeta}>
                      <Text style={[styles.bubbleTime, isUser ? styles.bubbleTimeUser : styles.bubbleTimeAgent]}>{msg.timestamp}</Text>
                      {isUser && <Check size={12} color="#E6FFF7" style={{ marginLeft: 4 }} />}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Keyboard input */}
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type message here..."
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSendChat}
                placeholderTextColor="#9ABFB5"
              />
              <Pressable onPress={handleSendChat} style={styles.sendBtn}>
                <Send size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
  helpTitleCard: {
    backgroundColor: '#007A5E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  helpTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6FFF7',
    borderWidth: 2,
    borderColor: '#00C896',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  agentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  agentTitle: {
    fontSize: 12,
    color: '#9ABFB5',
    marginTop: 2,
  },
  msgBtn: {
    flexDirection: 'row',
    backgroundColor: '#00C896',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  msgBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mintDivider: {
    height: 1,
    backgroundColor: '#E6FFF7',
    marginVertical: 16,
  },
  whatsappRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  optionValue: {
    fontSize: 12,
    color: '#9ABFB5',
    marginTop: 2,
  },
  contactOutlinedBtn: {
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#00C896',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  contactOutlinedText: {
    color: '#00C896',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionList: {
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0D1F1A',
  },
  optionCardSub: {
    fontSize: 11,
    color: '#9ABFB5',
    marginTop: 2,
  },
  optionTimeNotice: {
    fontSize: 11,
    color: '#4A7C6F',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginBottom: 12,
  },
  faqContainer: {
    marginBottom: 24,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0D1F1A',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswerBox: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0FBF7',
    paddingTop: 12,
  },
  faqAnswer: {
    fontSize: 12,
    color: '#4A7C6F',
    lineHeight: 18,
  },
  chatModalContainer: {
    flex: 1,
    backgroundColor: '#F0FBF7',
  },
  chatModalHeader: {
    backgroundColor: '#007A5E',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  modalBackBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  chatScrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  msgContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  msgAgent: {
    alignSelf: 'flex-start',
  },
  msgUser: {
    alignSelf: 'flex-end',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleAgent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#E6FFF7',
  },
  bubbleUser: {
    backgroundColor: '#00C896',
    borderTopRightRadius: 0,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextAgent: {
    color: '#0D1F1A',
  },
  bubbleTextUser: {
    color: '#FFFFFF',
  },
  bubbleMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  bubbleTime: {
    fontSize: 9,
  },
  bubbleTimeAgent: {
    color: '#9ABFB5',
  },
  bubbleTimeUser: {
    color: '#E6FFF7',
  },
  chatInputRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E6FFF7',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
  },
  chatInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#F0FBF7',
    borderRadius: 24,
    paddingHorizontal: 16,
    color: '#0D1F1A',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#C6F6E5',
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00C896',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
