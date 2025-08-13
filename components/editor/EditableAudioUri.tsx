import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

interface EditableAudioUriProps {
  label: string;
  value: string | null;
  onChange: (newValue: string | null) => void;
  onFileSelect: (file: File) => void;
}

const EditableAudioUri: React.FC<EditableAudioUriProps> = ({ label, value, onChange, onFileSelect }) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const createAndTriggerFileInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = handleFileSelect as any; // Workaround for onchange type
    input.click();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controls}>
        <Button title="Select Audio" onPress={createAndTriggerFileInput} />
        {value && <Button title="Remove" color="red" onPress={() => onChange(null)} />}
      </View>
      <Text style={styles.uriText}>{value || 'No audio set'}</Text>
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
  uriText: {
    fontSize: 12,
    color: Colors.light.icon,
    fontFamily: 'monospace',
  },
});

export default EditableAudioUri;
