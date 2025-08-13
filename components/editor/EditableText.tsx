import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

interface EditableTextProps {
  label: string;
  value: string;
  onChangeText: (newValue: string) => void;
  multiline?: boolean;
  style?: object;
}

const EditableText: React.FC<EditableTextProps> = ({ label, value, onChangeText, multiline = false, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholder={`Enter ${label}`}
        placeholderTextColor={Colors.light.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.text,
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
});

export default EditableText;
