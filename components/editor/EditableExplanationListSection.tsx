import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import EditableText from './EditableText';
import { Colors } from '../../constants/Colors';

interface ExplanationItem {
  id: string;
  jp: string;
  romanji: string;
}

interface EditableExplanationListSectionProps {
  section: {
    id: string;
    title: { [key: string]: string };
    content: ExplanationItem[];
  };
  sectionPath: (string | number)[];
  onDataChange: (path: (string | number)[], newValue: any) => void;
  languages: { code: string; name: string }[];
}

const EditableExplanationListSection: React.FC<EditableExplanationListSectionProps> = ({ section, sectionPath, onDataChange, languages }) => {
  const handleItemChange = (itemIndex: number, field: 'jp' | 'romanji', newValue: string) => {
    const updatedContent = section.content.map((item, idx) => 
      idx === itemIndex ? { ...item, [field]: newValue } : item
    );
    onDataChange(sectionPath, { ...section, content: updatedContent });
  };

  const handleAddItem = () => {
    const newItem: ExplanationItem = { id: `exp-${Date.now()}`, jp: '', romanji: '' };
    onDataChange(sectionPath, { ...section, content: [...section.content, newItem] });
  };

  const handleRemoveItem = (itemIndex: number) => {
    const updatedContent = section.content.filter((_, idx) => idx !== itemIndex);
    onDataChange(sectionPath, { ...section, content: updatedContent });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{section.title.en || section.title.ja}</Text>
      {section.content.map((item, itemIndex) => (
        <View key={item.id} style={styles.itemContainer}>
          <EditableText
            label="Japanese"
            value={item.jp}
            onChangeText={(text) => handleItemChange(itemIndex, 'jp', text)}
            multiline
          />
          <EditableText
            label="Romanji"
            value={item.romanji}
            onChangeText={(text) => handleItemChange(itemIndex, 'romanji', text)}
            multiline
          />
          <Button title="Remove Item" onPress={() => handleRemoveItem(itemIndex)} color="red" />
        </View>
      ))}
      <Button title="Add Item" onPress={handleAddItem} />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.light.text,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 5,
    backgroundColor: Colors.light.background,
  },
});

export default EditableExplanationListSection;
