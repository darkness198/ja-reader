import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, Button, Text, Pressable } from 'react-native';
import LessonScreen from '../../components/viewer/LessonScreen';
import StyledDetailsPanel from '../../components/StyledDetailsPanel';
import bookData from '../../data/bookData.json';
import { Colors } from '../../constants/Colors';

// Define types based on the structure of your bookData.json
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

interface LessonType {
  lessonNumber: number;
  id: string;
  title: MultiLanguageText;
  storyPage: any; // Define more specific types if needed
  practicePage?: any; // Define more specific types if needed
}

interface BookData {
  metadata: {
    title: MultiLanguageText;
    subtitle: MultiLanguageText;
    languages: Language[];
  };
  lessons: LessonType[];
}

const typedBookData: BookData = bookData;

const defaultLanguage = typedBookData.metadata.languages[0];

type AudioMode = 'word' | 'sentence' | 'page' | 'story';

export default function ViewerScreen() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [selectedItem, setSelectedItem] = useState<WordType | SentenceType | null>(null);
  const [audioMode, setAudioMode] = useState<AudioMode>('word'); // Default audio mode

  const LanguageSelector = () => (
    <View style={styles.langSelector}>
      {typedBookData.metadata.languages.map(lang => (
        <Pressable key={lang.code} style={[styles.langButton, language.code === lang.code && styles.activeLangButton]} onPress={() => setLanguage(lang)}>
          <Text style={language.code === lang.code ? styles.activeLangButtonText : styles.langButtonText}>{lang.name}</Text>
        </Pressable>
      ))}
    </View>
  );

  const AudioModeSelector = () => (
    <View style={styles.audioModeSelector}>
      <Pressable 
        style={[styles.modeButton, audioMode === 'word' && styles.activeModeButton]}
        onPress={() => setAudioMode('word')}
      >
        <Text style={audioMode === 'word' ? styles.modeButtonText : styles.modeButtonText}>Word Mode</Text>
      </Pressable>
      <Pressable 
        style={[styles.modeButton, audioMode === 'sentence' && styles.activeModeButton]}
        onPress={() => setAudioMode('sentence')}
      >
        <Text style={audioMode === 'sentence' ? styles.modeButtonText : styles.modeButtonText}>Sentence Mode</Text>
      </Pressable>
      {/* Page and Story mode buttons will be added later, or handled differently */}
    </View>
  );

  const handleWordSelect = (word: WordType) => {
    setSelectedItem(word);
  };

  const handleSentenceSelect = (sentence: SentenceType) => {
    setSelectedItem(sentence);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.mainContent}>
        <View style={styles.lessonContainer}>
          <View style={styles.header}>
            <Text style={styles.bookTitle}>{typedBookData.metadata.title[language.code] || typedBookData.metadata.title.en}</Text>
            <LanguageSelector />
            <AudioModeSelector />
          </View>
          <LessonScreen 
            lesson={typedBookData.lessons[currentLessonIndex]} 
            languageCode={language.code} 
            defaultLanguageCode={defaultLanguage.code} 
            onWordSelect={handleWordSelect}
            onSentenceSelect={handleSentenceSelect}
            audioMode={audioMode}
            isEditing={false} // Added missing prop
            onDataChange={() => {}} // Added missing prop
            onFileSelect={() => {}} // Added missing prop
            bookLanguages={typedBookData.metadata.languages} // Added missing prop
          />
          <View style={styles.navigation}>
            <Button title="Previous" onPress={() => setCurrentLessonIndex(p => Math.max(0, p - 1))} disabled={currentLessonIndex === 0} />
            <Text style={{color: Colors.light.text}}>Lesson {currentLessonIndex + 1}</Text>
            <Button title="Next" onPress={() => setCurrentLessonIndex(p => Math.min(typedBookData.lessons.length - 1, p + 1))} disabled={currentLessonIndex === typedBookData.lessons.length - 1} />
          </View>
        </View>
        <StyledDetailsPanel 
          selectedItem={selectedItem} 
          languageCode={language.code} 
          defaultLanguageCode={defaultLanguage.code} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  mainContent: { flexDirection: 'row', flex: 1 },
  lessonContainer: { flex: 1, },
  header: { padding: 10, borderBottomWidth: 1, borderBottomColor: Colors.light.text },
  bookTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: Colors.light.text },
  langSelector: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  langButton: { paddingVertical: 5, paddingHorizontal: 15, marginHorizontal: 5, borderRadius: 15, borderWidth: 1, borderColor: Colors.light.tint },
  activeLangButton: { backgroundColor: Colors.light.tint },
  langButtonText: { color: Colors.light.tint, fontWeight: 'bold' },
  activeLangButtonText: { color: Colors.light.background, fontWeight: 'bold' },
  audioModeSelector: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  modeButton: { paddingVertical: 5, paddingHorizontal: 15, marginHorizontal: 5, borderRadius: 15, borderWidth: 1, borderColor: Colors.light.tint },
  activeModeButton: { backgroundColor: Colors.light.tint },
  modeButtonText: { color: Colors.light.tint, fontWeight: 'bold' },
  activeModeButtonText: { color: Colors.light.background, fontWeight: 'bold' },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: Colors.light.text },
});