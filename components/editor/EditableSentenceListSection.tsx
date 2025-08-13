import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import EditableMultiLanguageText from './EditableMultiLanguageText';
import EditableAudioUri from './EditableAudioUri';
import EditableText from './EditableText';
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

interface SentenceType {
  id: string;
  fullText: MultiLanguageText;
  audioUri: string | null;
  words: WordType[];
}

interface EditableSentenceListSectionProps {
  section: {
    id: string;
    title: { [key: string]: string };
    content: SentenceType[];
  };
  sectionPath: (string | number)[];
  onDataChange: (path: (string | number)[], newValue: any) => void;
  onFileSelect: (path: (string | number)[], file: File, type: 'audio' | 'image') => void;
  languages: { code: string; name: string }[];
}

const EditableSentenceListSection: React.FC<EditableSentenceListSectionProps> = ({ section, sectionPath, onDataChange, onFileSelect, languages }) => {
  const handleSentenceChange = (sentenceIndex: number, field: 'fullText' | 'audioUri', newValue: any) => {
    const updatedContent = section.content.map((sentence, idx) => 
      idx === sentenceIndex ? { ...sentence, [field]: newValue } : sentence
    );
    onDataChange(sectionPath, { ...section, content: updatedContent });
  };

  const handleWordChange = (sentenceIndex: number, wordIndex: number, field: 'text' | 'audioUri' | 'tone', newValue: any) => {
    const updatedSentences = section.content.map((sentence, sIdx) => {
      if (sIdx === sentenceIndex) {
        const updatedWords = sentence.words.map((word, wIdx) => 
          wIdx === wordIndex ? { ...word, [field]: newValue } : word
        );
        return { ...sentence, words: updatedWords };
      }
      return sentence;
    });
    onDataChange(sectionPath, { ...section, content: updatedSentences });
  };

  const handleAddSentence = () => {
    const newSentence: SentenceType = { 
      id: `sentence-${Date.now()}`, 
      fullText: { ja: '', 'ja-rm': '', en: '' }, 
      audioUri: null, 
      words: [] 
    };
    onDataChange(sectionPath, { ...section, content: [...section.content, newSentence] });
  };

  const handleRemoveSentence = (sentenceIndex: number) => {
    const updatedContent = section.content.filter((_, idx) => idx !== sentenceIndex);
    onDataChange(sectionPath, { ...section, content: updatedContent });
  };

  const handleAddWord = (sentenceIndex: number) => {
    const newWord: WordType = { 
      id: `word-${Date.now()}`, 
      text: { ja: '', 'ja-rm': '', en: '' }, 
      audioUri: null 
    };
    const updatedSentences = section.content.map((sentence, sIdx) => {
      if (sIdx === sentenceIndex) {
        return { ...sentence, words: [...sentence.words, newWord] };
      }
      return sentence;
    });
    onDataChange(sectionPath, { ...section, content: updatedSentences });
  };

  const handleRemoveWord = (sentenceIndex: number, wordIndex: number) => {
    const updatedSentences = section.content.map((sentence, sIdx) => {
      if (sIdx === sentenceIndex) {
        return { ...sentence, words: sentence.words.filter((_, wIdx) => wIdx !== wordIndex) };
      }
      return sentence;
    });
    onDataChange(sectionPath, { ...section, content: updatedSentences });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{section.title.en || section.title.ja}</Text>
      {section.content.map((sentence, sentenceIndex) => (
        <View key={sentence.id} style={styles.sentenceContainer}>
          <EditableMultiLanguageText
            label="Full Text"
            value={sentence.fullText}
            onChange={(newValue) => handleSentenceChange(sentenceIndex, 'fullText', newValue)}
            languages={languages}
            multiline
          />
          <EditableAudioUri
            label="Audio URI"
            value={sentence.audioUri}
            onChange={(newUri) => handleSentenceChange(sentenceIndex, 'audioUri', newUri)}
            onFileSelect={(file) => onFileSelect([...sectionPath, 'content', sentenceIndex, 'audioUri'], file, 'audio')}
          />
          <Text style={styles.wordsLabel}>Words:</Text>
          {sentence.words.map((word, wordIndex) => (
            <View key={word.id} style={styles.wordContainer}>
              <EditableMultiLanguageText
                label="Word Text"
                value={word.text}
                onChange={(newValue) => handleWordChange(sentenceIndex, wordIndex, 'text', newValue)}
                languages={languages}
              />
              <EditableText
                label="Tone"
                value={word.tone || ''}
                onChangeText={(newValue) => handleWordChange(sentenceIndex, wordIndex, 'tone', newValue)}
              />
              <EditableAudioUri
                label="Word Audio URI"
                value={word.audioUri}
                onChange={(newUri) => handleWordChange(sentenceIndex, wordIndex, 'audioUri', newUri)}
                onFileSelect={(file) => onFileSelect([...sectionPath, 'content', sentenceIndex, 'words', wordIndex, 'audioUri'], file, 'audio')}
              />
              <Button title="Remove Word" onPress={() => handleRemoveWord(sentenceIndex, wordIndex)} color="red" />
            </View>
          ))}
          <Button title="Add Word" onPress={() => handleAddWord(sentenceIndex)} />
          <Button title="Remove Sentence" onPress={() => handleRemoveSentence(sentenceIndex)} color="red" />
        </View>
      ))}
      <Button title="Add Sentence" onPress={handleAddSentence} />
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
  sentenceContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 5,
    backgroundColor: Colors.light.background,
  },
  wordsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: Colors.light.text,
  },
  wordContainer: {
    marginLeft: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 5,
    backgroundColor: Colors.light.background,
    marginBottom: 5,
  },
});

export default EditableSentenceListSection;
