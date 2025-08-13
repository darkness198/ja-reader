import React from 'react';
import { View, Pressable, Text, StyleSheet, Button } from 'react-native';
import Word from './Word';
import { Colors } from '../../constants/Colors';
// Removed: import { playSound, USE_LEGACY_AUDIO_PLAYER } from '../../utils/audioPlayer';
import { useAudioPlayer } from 'expo-audio';
import { getlocalAudioURI } from '../../utils/localaudio';

// Import Editable components
import EditableMultiLanguageText from '../../components/editor/EditableMultiLanguageText';
import EditableAudioUri from '../../components/editor/EditableAudioUri';

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
  kanji?: string | null;
}

interface SentenceType {
  id: string;
  fullText: MultiLanguageText;
  audioUri: string | null;
  words: WordType[];
}

interface SentenceProps {
  sentence: SentenceType;
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
  blockIndex?: number; // New prop (optional for practice page sentences)
  lineIndex?: number; // New prop (optional for practice page sentences)
  sectionIndex?: number; // New prop (optional for practice page sentences)
}

export default function Sentence({
  sentence,
  languageCode,
  defaultLanguageCode,
  onWordSelect,
  onSentenceSelect,
  audioMode,
  isEditing,
  onDataChange,
  onFileSelect,
  bookLanguages,
  lessonIndex,
  blockIndex,
  lineIndex,
  sectionIndex,
}: SentenceProps) {
  const player = useAudioPlayer(sentence.audioUri ? getlocalAudioURI(sentence) : undefined); // Use the hook

  const handlePress = () => {
    if (audioMode === 'sentence' && sentence.audioUri) {
      if (player) {
        player.seekTo(0);
        player.play();
      } else {
        console.warn("Audio player not initialized for hook-based playback.");
      }
    } else {
      onSentenceSelect(sentence);
    }
  };
  
  const mainText = sentence.fullText[languageCode] || sentence.fullText[defaultLanguageCode] || '';
  const subTextKey = (languageCode === 'en' || languageCode === 'ja-rm') ? 'ja' : 'en';
  const subText = sentence.fullText[subTextKey] || sentence.fullText['ja-rm'] || '';

  const handleAddWord = () => {
    const newWord: WordType = {
      id: `word-${Date.now()}`,
      text: { ja: '', 'ja-rm': '', en: '' },
      audioUri: null,
    };
    // Determine the correct path based on whether it's a story or practice page sentence
    let path: (string | number)[];
    if (blockIndex !== undefined && lineIndex !== undefined) { // Story page sentence
      path = ['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'lines', lineIndex, 'words'];
    } else if (sectionIndex !== undefined && lineIndex !== undefined) { // Practice page sentence
      path = ['lessons', lessonIndex, 'practicePage', 'practiceSections', sectionIndex, 'content', lineIndex, 'words'];
    } else {
      console.error("Cannot add word: Insufficient path information.");
      return;
    }
    onDataChange(path, [...sentence.words, newWord]);
  };

  const handleRemoveWord = (wordIndex: number) => {
    const updatedWords = sentence.words.filter((_, idx) => idx !== wordIndex);
    // Determine the correct path based on whether it's a story or practice page sentence
    let path: (string | number)[];
    if (blockIndex !== undefined && lineIndex !== undefined) { // Story page sentence
      path = ['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'lines', lineIndex, 'words'];
    } else if (sectionIndex !== undefined && lineIndex !== undefined) { // Practice page sentence
      path = ['lessons', lessonIndex, 'practicePage', 'practiceSections', sectionIndex, 'content', lineIndex, 'words'];
    }
    else {
      console.error("Cannot remove word: Insufficient path information.");
      return;
    }
    onDataChange(path, updatedWords);
  };

  return (
    <Pressable onPress={handlePress} style={[styles.sentenceContainer, isEditing && styles.editableSentence]}>
      {isEditing ? (
        <View>
          <EditableMultiLanguageText
            label="Full Text"
            value={sentence.fullText}
            onChange={(newValue) => {
              let path: (string | number)[];
              if (blockIndex !== undefined && lineIndex !== undefined) {
                path = ['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'lines', lineIndex, 'fullText'];
              } else if (sectionIndex !== undefined && lineIndex !== undefined) {
                path = ['lessons', lessonIndex, 'practicePage', 'practiceSections', sectionIndex, 'content', lineIndex, 'fullText'];
              } else {
                console.error("Cannot update full text: Insufficient path information.");
                return;
              }
              onDataChange(path, newValue);
            }}
            languages={bookLanguages}
            multiline
          />
          <EditableAudioUri
            label="Audio URI"
            value={sentence.audioUri}
            onChange={(newUri) => {
              let path: (string | number)[];
              if (blockIndex !== undefined && lineIndex !== undefined) {
                path = ['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'lines', lineIndex, 'audioUri'];
              } else if (sectionIndex !== undefined && lineIndex !== undefined) {
                path = ['lessons', lessonIndex, 'practicePage', 'practiceSections', sectionIndex, 'content', lineIndex, 'audioUri'];
              } else {
                console.error("Cannot update audio URI: Insufficient path information.");
                return;
              }
              onDataChange(path, newUri);
            }}
            onFileSelect={(file) => {
              let path: (string | number)[];
              if (blockIndex !== undefined && lineIndex !== undefined) {
                path = ['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'lines', lineIndex, 'audioUri'];
              } else if (sectionIndex !== undefined && lineIndex !== undefined) {
                path = ['lessons', lessonIndex, 'practicePage', 'practiceSections', sectionIndex, 'content', lineIndex, 'audioUri'];
              }
              else {
                console.error("Cannot select audio file: Insufficient path information.");
                return;
              }
              onFileSelect(path, file, 'audio');
            }}
          />
          <Button title="Add Word" onPress={handleAddWord} />
        </View>
      ) : (
        <View>
          {sentence.words && sentence.words.length > 0 && (
            <View style={styles.wordWrapper}>
              {sentence.words.map((word, wordIndex) => (
                <Word
                  key={word.id}
                  word={word}
                  languageCode={languageCode}
                  defaultLanguageCode={defaultLanguageCode}
                  onSelect={onWordSelect}
                  audioMode={audioMode}
                  isEditing={isEditing} // Pass new prop
                  onDataChange={onDataChange} // Pass new prop
                  onFileSelect={onFileSelect} // Pass new prop
                  bookLanguages={bookLanguages} // Pass new prop
                  lessonIndex={lessonIndex} // Pass new prop
                  blockIndex={blockIndex} // Pass new prop
                  lineIndex={lineIndex} // Pass new prop
                  wordIndex={wordIndex} // Pass new prop
                  sectionIndex={sectionIndex} // Pass new prop
                />
              ))}
            </View>
          )}
          <Text style={styles.mainText}>{mainText}</Text>
          {subText !== mainText && <Text style={styles.subText}>{subText}</Text>}
        </View>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  sentenceContainer: { marginVertical: 10, padding: 10, backgroundColor: Colors.light.background, borderRadius: 8, borderWidth: 1, borderColor: Colors.light.text },
  editableSentence: { borderWidth: 1, borderColor: 'orange', padding: 10, marginBottom: 10 }, // Visual indicator for editable sentence
  wordWrapper: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 5 },
  mainText: { fontSize: 22, color: Colors.light.text },
  subText: { fontSize: 16, color: Colors.light.icon, fontStyle: 'italic' },
});