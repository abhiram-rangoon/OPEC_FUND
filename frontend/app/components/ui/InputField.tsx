import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputFieldProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  icon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  icon
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View 
        style={[
          styles.inputContainer, 
          isFocused && styles.inputFocused
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9ABFB5"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.input}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.toggle}>
            {showPassword ? (
              <EyeOff size={20} color="#4A7C6F" />
            ) : (
              <Eye size={20} color="#4A7C6F" />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1F1A',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFF7',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 12,
    height: 52,
  },
  inputFocused: {
    borderColor: '#00C896',
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#0D1F1A',
    fontSize: 16,
  },
  toggle: {
    padding: 4,
  },
});
export default InputField;
