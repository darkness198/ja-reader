import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { Colors } from '../../constants/Colors';

interface EditableIllustrationUriProps {
  label: string;
  value: string | null;
  onChange: (newValue: string | null) => void;
  onFileSelect: (file: File) => void;
}

const EditableIllustrationUri: React.FC<EditableIllustrationUriProps> = ({ label, value, onChange, onFileSelect }) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const createAndTriggerFileInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleFileSelect as any; // Workaround for onchange type
    input.click();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controls}>
        <Button title="Select Image" onPress={createAndTriggerFileInput} />
        {value && <Button title="Remove" color="red" onPress={() => onChange(null)} />}
      </View>
      {value && <Image source={{ uri: value }} style={styles.imagePreview} />}
      <Text style={styles.uriText}>{value || 'No image set'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.text,
    borderRadius: 5,
    padding: 8,
    backgroundColor: Colors.light.background,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.light.text,
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 5,
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  uriText: {
    fontSize: 12,
    color: Colors.light.icon,
    fontFamily: 'monospace',
  },
});

export default EditableIllustrationUri;
