import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import EditableMultiLanguageText from './EditableMultiLanguageText';
import EditableAudioUri from './EditableAudioUri';
import { Colors } from '../../constants/Colors';

interface MultiLanguageText {
  [key: string]: string;
}

interface WordType {
  id: string;
  text: MultiLanguageText;
  audioUri: string | null;
  tone?: string | null;
}

interface WordListItem {
  id: string;
  term: MultiLanguageText;
  definition: MultiLanguageText;
  audioUri: string | null;
}

interface EditableWordListSectionProps {
  section: {
    id: string;
    title: { [key: string]: string };
    content: WordListItem[];
  };
  sectionPath: (string | number)[];
  onDataChange: (path: (string | number)[], newValue: any) => void;
  onFileSelect: (path: (string | number)[], file: File, type: 'audio' | 'image') => void;
  languages: { code: string; name: string }[];
}

const EditableWordListSection: React.FC<EditableWordListSectionProps> = ({ section, sectionPath, onDataChange, onFileSelect, languages }) => {
  const handleItemChange = (itemIndex: number, field: 'term' | 'definition' | 'audioUri', newValue: any) => {
    const updatedContent = section.content.map((item, idx) => 
      idx === itemIndex ? { ...item, [field]: newValue } : item
    );
    onDataChange(sectionPath, { ...section, content: updatedContent });
  };

  const handleAddItem = () => {
    const newItem: WordListItem = { 
      id: `wordlist-${Date.now()}`, 
      term: { ja: '', 'ja-rm': '', en: '' }, 
      definition: { ja: '', 'ja-rm': '', en: '' }, 
      audioUri: null 
    };
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
          <EditableMultiLanguageText
            label="Term"
            value={item.term}
            onChange={(newValue) => handleItemChange(itemIndex, 'term', newValue)}
            languages={languages}
          />
          <EditableMultiLanguageText
            label="Definition"
            value={item.definition}
            onChange={(newValue) => handleItemChange(itemIndex, 'definition', newValue)}
            languages={languages}
          />
          <EditableAudioUri
            label="Audio URI"
            value={item.audioUri}
            onChange={(newUri) => handleItemChange(itemIndex, 'audioUri', newUri)}
            onFileSelect={(file) => onFileSelect([...sectionPath, 'content', itemIndex, 'audioUri'], file, 'audio')}
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

export default EditableWordListSection;
