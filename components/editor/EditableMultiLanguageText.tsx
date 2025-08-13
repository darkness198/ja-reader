import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import EditableText from './EditableText';
import { Colors } from '../../constants/Colors';

interface MultiLanguageText {
  [key: string]: string;
}

interface Language {
  code: string;
  name: string;
}

interface EditableMultiLanguageTextProps {
  label: string;
  value: MultiLanguageText;
  onChange: (newValue: MultiLanguageText) => void;
  languages: Language[];
}

const EditableMultiLanguageText: React.FC<EditableMultiLanguageTextProps> = ({ label, value, onChange, languages }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {languages.map(lang => (
        <EditableText
          key={lang.code}
          label={lang.name}
          value={value[lang.code] || ''}
          onChangeText={(text) => onChange({ ...value, [lang.code]: text })}
          style={styles.languageInput}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.text,
    borderRadius: 8,
    padding: 10,
    backgroundColor: Colors.light.background,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.light.text,
  },
  languageInput: {
    marginBottom: 5,
  },
});

export default EditableMultiLanguageText;
