import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Button } from 'react-native';
import StoryPage from './StoryPage';
import PracticePage from './PracticePage';
import { Colors } from '../../constants/Colors';
import { playSound } from '../../utils/audioPlayer';

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
  tone?: string | null;
}

interface SentenceType {
  id: string;
  fullText: MultiLanguageText;
  audioUri: string | null;
  words: WordType[];
}

interface StoryBlockType {
  id: string;
  illustrationUri: string | null;
  lines: SentenceType[];
}

interface StoryPageType {
  pageNumber: number;
  title: MultiLanguageText;
  audioUri: string | null;
  storyBlocks: StoryBlockType[];
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

interface LessonType {
  lessonNumber: number;
  id: string;
  title: MultiLanguageText;
  storyPage: StoryPageType;
  practicePage: PracticePageType;
}

interface LessonScreenProps {
  lesson: LessonType;
  languageCode: string;
  defaultLanguageCode: string;
  onWordSelect: (word: WordType) => void;
  onSentenceSelect: (sentence: SentenceType) => void;
  audioMode: 'word' | 'sentence' | 'page' | 'story';
  isEditing: boolean; // New prop
  onDataChange: (path: (string | number)[], newValue: any) => void; // New prop
  onFileSelect: (path: (string | number)[], file: File, type: 'audio' | 'image') => void; // New prop
  bookLanguages: Language[]; // New prop
}

export default function LessonScreen({
  lesson,
  languageCode,
  defaultLanguageCode,
  onWordSelect,
  onSentenceSelect,
  audioMode,
  isEditing, // Destructure new prop
  onDataChange, // Destructure new prop
  onFileSelect, // Destructure new prop
  bookLanguages, // Destructure new prop
}: LessonScreenProps) {
  const [activeTab, setActiveTab] = useState('story');

  if (!lesson) {
    return <View><Text>No lesson selected.</Text></View>;
  }
  const title = lesson.title[languageCode] || lesson.title[defaultLanguageCode] || '';

  const playStoryAudio = async () => {
    if (lesson.storyPage.audioUri) {
      await playSound(lesson.storyPage.audioUri);
    }
    for (const block of lesson.storyPage.storyBlocks) {
      for (const line of block.lines) {
        if (line.audioUri) {
          await playSound(line.audioUri);
        }
        for (const word of line.words) {
          if (word.audioUri) {
            await playSound(word.audioUri);
          }
        }
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.lessonTitle}>{title}</Text>
      <View style={styles.tabContainer}>
        <Pressable style={[styles.tab, activeTab === 'story' && styles.activeTab]} onPress={() => setActiveTab('story')}>
          <Text style={activeTab === 'story' ? styles.activeTabText : styles.tabText}>Story</Text>
        </Pressable>
        <Pressable style={[styles.tab, activeTab === 'practice' && styles.activeTab]} onPress={() => setActiveTab('practice')}>
          <Text style={activeTab === 'practice' ? styles.activeTabText : styles.tabText}>Practice</Text>
        </Pressable>
      </View>
      {audioMode === 'story' && activeTab === 'story' && (
        <Button title="Play Story Audio" onPress={playStoryAudio} />
      )}
      {activeTab === 'story' ? (
        <StoryPage
          pageData={lesson.storyPage}
          languageCode={languageCode}
          defaultLanguageCode={defaultLanguageCode}
          onWordSelect={onWordSelect}
          onSentenceSelect={onSentenceSelect}
          audioMode={audioMode}
          isEditing={isEditing} // Pass new prop
          onDataChange={onDataChange} // Pass new prop
          onFileSelect={onFileSelect} // Pass new prop
          bookLanguages={bookLanguages} // Pass new prop
          lessonIndex={lesson.lessonNumber - 1} // Pass lesson index for path construction
        />
      ) : (
        <PracticePage
          pageData={lesson.practicePage}
          languageCode={languageCode}
          defaultLanguageCode={defaultLanguageCode}
          onWordSelect={onWordSelect}
          onSentenceSelect={onSentenceSelect}
          audioMode={audioMode}
          isEditing={isEditing} // Pass new prop
          onDataChange={onDataChange} // Pass new prop
          onFileSelect={onFileSelect} // Pass new prop
          bookLanguages={bookLanguages} // Pass new prop
          lessonIndex={lesson.lessonNumber - 1} // Pass lesson index for path construction
        />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  lessonTitle: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginVertical: 10, paddingHorizontal: 10, color: Colors.light.text },
  tabContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  tab: { paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: Colors.light.text, backgroundColor: Colors.light.background },
  activeTab: { backgroundColor: Colors.light.tint, borderColor: Colors.light.tint },
  tabText: { fontSize: 16, color: Colors.light.tint },
  activeTabText: { fontSize: 16, color: Colors.light.background },
});
