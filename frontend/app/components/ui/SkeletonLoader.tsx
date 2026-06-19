import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style
}) => {
  const pulseAnim = new Animated.Value(0.3);

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.7,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: true,
      })
    ]);

    Animated.loop(pulse).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.skeleton, 
        { 
          width, 
          height, 
          borderRadius, 
          opacity: pulseAnim 
        }, 
        style
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#9ABFB5',
  },
});
export default SkeletonLoader;
