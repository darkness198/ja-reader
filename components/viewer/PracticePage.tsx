import React from 'react';
import { View, Text, StyleSheet, Pressable, Button } from 'react-native';
import Sentence from './Sentence';
import { playSound } from '../../utils/audioPlayer';
import { Colors } from '../../constants/Colors';

// Import Editable components
import EditableText from '../../components/editor/EditableText';
import EditableMultiLanguageText from '../../components/editor/EditableMultiLanguageText';
import EditableAudioUri from '../../components/editor/EditableAudioUri';
import EditableExplanationListSection from '../../components/editor/EditableExplanationListSection';
import EditableWordListSection from '../../components/editor/EditableWordListSection';
import EditableSentenceListSection from '../../components/editor/EditableSentenceListSection';

interface MultiLanguageText {
  [key: string]: string;
}

interface Language {
  code: string;
  name: string;
}

interface WordType {
  id: string;
  text: MultiLanguageText;
  audioUri: string | null;
}

interface SentenceType {
  id: string;
  fullText: MultiLanguageText;
  audioUri: string | null;
  words: WordType[];
}

interface PracticeSectionType {
  id: string;
  title: MultiLanguageText;
  type: 'explanation_list' | 'word_list' | 'sentence_list' | 'kana_list';
  content: any[];
}

interface PracticePageType {
  pageNumber: number;
  title: MultiLanguageText;
  practiceSections: PracticeSectionType[];
}

interface PracticeSectionProps {
  section: PracticeSectionType;
  languageCode: string;
  defaultLanguageCode: string;
  onWordSelect: (word: WordType) => void;
  onSentenceSelect: (sentence: SentenceType) => void;
  audioMode: 'word' | 'sentence' | 'page' | 'story';
  isEditing: boolean; // New prop
  onDataChange: (path: (string | number)[], newValue: any) => void; // New prop
  onFileSelect: (path: (string | number)[], file: File, type: 'audio' | 'image') => void; // New prop
  bookLanguages: Language[]; // New prop
  lessonIndex: number; // New prop
  sectionIndex: number; // New prop
}

const PracticeSection = ({
  section,
  languageCode,
  defaultLanguageCode,
  onWordSelect,
  onSentenceSelect,
  audioMode,
  isEditing, // Destructure new prop
  onDataChange, // Destructure new prop
  onFileSelect, // Destructure new prop
  bookLanguages, // Destructure new prop
  lessonIndex, // Destructure new prop
  sectionIndex, // Destructure new prop
}: PracticeSectionProps) => {
  const sectionTitle = section.title[languageCode] || section.title[defaultLanguageCode] || '';

  const sectionPath = ['lessons', lessonIndex, 'practicePage', 'practiceSections', sectionIndex];

  const renderContent = () => {
    if (isEditing) {
      switch (section.type) {
        case 'explanation_list':
          return (
            <EditableExplanationListSection
              section={section as any}
              sectionPath={sectionPath}
              onDataChange={onDataChange}
              languages={bookLanguages}
            />
          );
        case 'word_list':
          return (
            <EditableWordListSection
              section={section as any}
              sectionPath={sectionPath}
              onDataChange={onDataChange}
              onFileSelect={onFileSelect}
              languages={bookLanguages}
            />
          );
        case 'sentence_list':
          return (
            <EditableSentenceListSection
              section={section as any}
              sectionPath={sectionPath}
              onDataChange={onDataChange}
              onFileSelect={onFileSelect}
              languages={bookLanguages}
            />
          );
        default:
          return <Text>Unsupported practice type: {section.type}</Text>;
      }
    } else {
      switch (section.type) {
        case 'explanation_list':
          return section.content.map((item: { id: string; jp: string; romanji: string }) => (
            <View key={item.id} style={styles.explanationItem}>
              <Text style={styles.jpText}>{item.jp}</Text>
              <Text style={styles.romanjiText}>{item.romanji}</Text>
            </View>
          ));
        case 'word_list':
          return section.content.map((item: { id: string; term: MultiLanguageText; definition: MultiLanguageText; audioUri: string | null }) => {
            const term = item.term[languageCode] || item.term[defaultLanguageCode];
            const definition = item.definition[languageCode] || item.definition[Object.keys(item.definition)[0]];
            return (
              <Pressable key={item.id} style={styles.wordItem} onPress={() => playSound(item.audioUri)}>
                <Text style={styles.jpText}>{term}</Text>
                <Text style={styles.romanjiText}>{definition}</Text>
              </Pressable>
            );
          });
        case 'sentence_list':
          return section.content.map((sentence: SentenceType) => (
            <Sentence
              key={sentence.id}
              sentence={sentence}
              languageCode={languageCode}
              defaultLanguageCode={defaultLanguageCode}
              onWordSelect={onWordSelect}
              onSentenceSelect={onSentenceSelect}
              audioMode={audioMode}
              isEditing={isEditing} // Pass new prop
              onDataChange={onDataChange} // Pass new prop
              onFileSelect={onFileSelect} // Pass new prop
              bookLanguages={bookLanguages} // Pass new prop
              lessonIndex={lessonIndex} // Pass new prop
              sectionIndex={sectionIndex} // Pass new prop
            />
          ));
        default:
          return <Text>Unsupported practice type: {section.type}</Text>;
      }
    }
  };

  return (
    <View style={[styles.sectionContainer, isEditing && styles.editableSection]}>
      {isEditing ? (
        <View>
          <EditableMultiLanguageText
            label="Section Title"
            value={section.title}
            onChange={(newValue) => onDataChange([...sectionPath, 'title'], newValue)}
            languages={bookLanguages}
          />
          <EditableText
            label="Section Type"
            value={section.type}
            onChangeText={(newValue) => onDataChange([...sectionPath, 'type'], newValue as PracticeSectionType['type'])}
          />
        </View>
      ) : (
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      )}
      {renderContent()}
    </View>
  );
};

interface PracticePageProps {
  pageData: PracticePageType;
  languageCode: string;
  defaultLanguageCode: string;
  onWordSelect: (word: WordType) => void;
  onSentenceSelect: (sentence: SentenceType) => void;
  audioMode: 'word' | 'sentence' | 'page' | 'story';
  isEditing: boolean; // New prop
  onDataChange: (path: (string | number)[], newValue: any) => void; // New prop
  onFileSelect: (path: (string | number)[], file: File, type: 'audio' | 'image') => void; // New prop
  bookLanguages: Language[]; // New prop
  lessonIndex: number; // New prop
}

export default function PracticePage({
  pageData,
  languageCode,
  defaultLanguageCode,
  onWordSelect,
  onSentenceSelect,
  audioMode,
  isEditing, // Destructure new prop
  onDataChange, // Destructure new prop
  onFileSelect, // Destructure new prop
  bookLanguages, // Destructure new prop
  lessonIndex, // Destructure new prop
}: PracticePageProps) {
    const title = pageData.title[languageCode] || pageData.title[defaultLanguageCode] || '';

    const playPageAudio = async () => {
      for (const section of pageData.practiceSections) {
        if (section.type === 'sentence_list') {
          for (const sentence of section.content) {
            if (sentence.audioUri) {
              await playSound(sentence.audioUri);
            }
            for (const word of sentence.words) {
              if (word.audioUri) {
                await playSound(word.audioUri);
              }
            }
          }
        } else if (section.type === 'word_list') {
          for (const item of section.content) {
            if (item.audioUri) {
              await playSound(item.audioUri);
            }
          }
        }
      }
    };

    const handleAddPracticeSection = () => {
      const newSection: PracticeSectionType = {
        id: `practice-section-${Date.now()}`,
        title: { ja: '', 'ja-rm': '', en: '' },
        type: 'explanation_list', // Default type
        content: [],
      };
      onDataChange(['lessons', lessonIndex, 'practicePage', 'practiceSections'], [...pageData.practiceSections, newSection]);
    };
  
    const handleRemovePracticeSection = (sectionIndex: number) => {
      const updatedSections = pageData.practiceSections.filter((_, idx) => idx !== sectionIndex);
      onDataChange(['lessons', lessonIndex, 'practicePage', 'practiceSections'], updatedSections);
    };

    return (
        <View style={styles.pageContainer}>
        {isEditing ? (
          <EditableMultiLanguageText
            label="Practice Page Title"
            value={pageData.title}
            onChange={(newValue) => onDataChange(['lessons', lessonIndex, 'practicePage', 'title'], newValue)}
            languages={bookLanguages}
          />
        ) : (
          <Text style={styles.pageTitle}>{title}</Text>
        )}
        
        {audioMode === 'page' && !isEditing && (
          <Button title="Play Page Audio" onPress={playPageAudio} />
        )}

        {isEditing && <Button title="Add Practice Section" onPress={handleAddPracticeSection} />}

        {pageData.practiceSections.map((section, sectionIndex) => (
            <PracticeSection
              key={section.id}
              section={section}
              languageCode={languageCode}
              defaultLanguageCode={defaultLanguageCode}
              onWordSelect={onWordSelect}
              onSentenceSelect={onSentenceSelect}
              audioMode={audioMode}
              isEditing={isEditing} // Pass new prop
              onDataChange={onDataChange} // Pass new prop
              onFileSelect={onFileSelect} // Pass new prop
              bookLanguages={bookLanguages} // Pass new prop
              lessonIndex={lessonIndex} // Pass new prop
              sectionIndex={sectionIndex} // Pass new prop
            />
        ))}
        </View>
  );
}
const styles = StyleSheet.create({
  pageContainer: { padding: 15, backgroundColor: Colors.light.background },
  pageTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: Colors.light.text },
  sectionContainer: { marginBottom: 20, backgroundColor: Colors.light.background, padding: 10, borderRadius: 8, borderColor: Colors.light.text, borderWidth: 1 },
  editableSection: { borderWidth: 1, borderColor: 'purple', padding: 10, marginBottom: 20 }, // Visual indicator for editable section
  sectionTitle: { fontSize: 22, fontWeight: '600', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: Colors.light.text, paddingBottom: 5, color: Colors.light.text },
  explanationItem: { marginBottom: 8 },
  wordItem: { marginBottom: 8, padding: 5, backgroundColor: Colors.light.background, borderRadius: 4 },
  jpText: { fontSize: 18, color: Colors.light.text },
  romanjiText: { fontSize: 14, color: Colors.light.icon, fontStyle: 'italic' },
});