import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, ...props }) => {
  return (
    <View style={[styles.glassCard, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
});
export default GlassCard;
