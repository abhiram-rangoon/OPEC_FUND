import React from 'react';
import { Pressable, Text, StyleSheet, Animated } from 'react-native';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'gold';
  style?: any;
  textStyle?: any;
}

export const GradientButton: React.FC<GradientButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  style,
  textStyle 
}) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const bgGradient = variant === 'gold' 
    ? { backgroundColor: '#FFD700', borderColor: '#CCAC00' }
    : { backgroundColor: '#00C896', borderColor: '#007A5E' };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.button, bgGradient, style]}
      >
        <Text style={[styles.text, variant === 'gold' ? styles.goldText : styles.primaryText, textStyle]}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  goldText: {
    color: '#0D1F1A',
  },
});
export default GradientButton;
