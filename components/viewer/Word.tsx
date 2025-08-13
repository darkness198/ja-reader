import React from 'react';
import { Text, Pressable, StyleSheet, View, Button } from 'react-native';
import { Colors } from '../../constants/Colors';
// Removed: import { playSound, USE_LEGACY_AUDIO_PLAYER } from '../../utils/audioPlayer';
import { useAudioPlayer } from 'expo-audio';
import { getlocalAudioURI } from '../../utils/localaudio';

// Import Editable components
import EditableText from '../../components/editor/EditableText';
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

interface WordProps {
  word: WordType;
  languageCode: string;
  defaultLanguageCode: string;
  onSelect: (word: WordType) => void;
  audioMode: 'word' | 'sentence' | 'page' | 'story';
  isEditing: boolean; // New prop
  onDataChange: (path: (string | number)[], newValue: any) => void; // New prop
  onFileSelect: (path: (string | number)[], file: File, type: 'audio' | 'image') => void; // New prop
  bookLanguages: Language[]; // New prop
  lessonIndex: number; // New prop
  blockIndex?: number; // New prop (optional for story page words)
  lineIndex?: number; // New prop (optional for story/practice page words)
  wordIndex?: number; // New prop (optional for story/practice page words)
  sectionIndex?: number; // New prop (optional for practice page words)
}

export default function Word({
  word,
  languageCode,
  defaultLanguageCode,
  onSelect,
  audioMode,
  isEditing,
  onDataChange,
  onFileSelect,
  bookLanguages,
  lessonIndex,
  blockIndex,
  lineIndex,
  wordIndex,
  sectionIndex,
}: WordProps) {
  const player = useAudioPlayer(word.audioUri ? getlocalAudioURI(word) : undefined); // Use the hook

  const handlePress = () => {
    console.log('here')
    if (audioMode === 'word' && word.audioUri) {
      if (player) {
        player.seekTo(0);
        player.play();
      } else {
        console.warn("Audio player not initialized for hook-based playback.");
      }
    } else {
      onSelect(word);
    }
  };

  const text = word.text[languageCode] || word.text[defaultLanguageCode] || '...';
  const displayKanji = languageCode === 'ja' && word.kanji;

  const handleRemoveWord = () => {
    // Determine the correct path based on whether it's a story or practice page word
    let path: (string | number)[];
    if (blockIndex !== undefined && lineIndex !== undefined && wordIndex !== undefined) { // Story page word
      path = ['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'lines', lineIndex, 'words'];
    } else if (sectionIndex !== undefined && lineIndex !== undefined && wordIndex !== undefined) { // Practice page word
      path = ['lessons', lessonIndex, 'practicePage', 'practiceSections', sectionIndex, 'content', lineIndex, 'words'];
    } else {
      console.error("Cannot remove word: Insufficient path information.");
      return;
    }
    // Filter out the current word from the array
    const updatedWords = (wordIndex !== undefined && lineIndex !== undefined && blockIndex !== undefined) ?
      (onDataChange as any)(path, (prevWords: WordType[]) => prevWords.filter((_, idx) => idx !== wordIndex)) :
      (onDataChange as any)(path, (prevWords: WordType[]) => prevWords.filter((_, idx) => idx !== wordIndex));
  };

  return (
    <Pressable onPress={handlePress} style={isEditing && styles.editableWord}>
      {isEditing ? (
        <View style={styles.editableWordContainer}>
          <EditableMultiLanguageText
            label="Word Text"
            value={word.text}
            onChange={(newValue) => {
              let path: (string | number)[];
              if (blockIndex !== undefined && lineIndex !== undefined && wordIndex !== undefined) {
                path = ['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'lines', lineIndex, 'words', wordIndex, 'text'];
              } else if (sectionIndex !== undefined && lineIndex !== undefined && wordIndex !== undefined) {
                path = ['lessons', lessonIndex, 'practicePage', 'practiceSections', sectionIndex, 'content', lineIndex, 'words', wordIndex, 'text'];
              } else {
                console.error("Cannot update word text: Insufficient path information.");
                return;
              }
              onDataChange(path, newValue);
            }}
            languages={bookLanguages}
          />
          <EditableText
            label="Kanji"
            value={word.kanji || ''}
            onChangeText={(newValue) => {
              let path: (string | number)[];
              if (blockIndex !== undefined && lineIndex !== undefined && wordIndex !== undefined) {
                path = ['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'lines', lineIndex, 'words', wordIndex, 'kanji'];
              } else if (sectionIndex !== undefined && lineIndex !== undefined && wordIndex !== undefined) {
                path = ['lessons', lessonIndex, 'practicePage', 'practiceSections', sectionIndex, 'content', lineIndex, 'words', wordIndex, 'kanji'];
              } else {
                console.error("Cannot update word kanji: Insufficient path information.");
                return;
              }
              onDataChange(path, newValue);
            }}
          />
          <EditableText
            label="Tone"
            value={word.tone || ''}
            onChangeText={(newValue) => {
              let path: (string | number)[];
              if (blockIndex !== undefined && lineIndex !== undefined && wordIndex !== undefined) {
                path = ['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'lines', lineIndex, 'words', wordIndex, 'tone'];
              } else if (sectionIndex !== undefined && lineIndex !== undefined && wordIndex !== undefined) {
                path = ['lessons', lessonIndex, 'practicePage', 'practiceSections', sectionIndex, 'content', lineIndex, 'words', wordIndex, 'tone'];
              } else {
                console.error("Cannot update word tone: Insufficient path information.");
                return;
              }
              onDataChange(path, newValue);
            }}
          />
          <EditableAudioUri
            label="Audio URI"
            value={word.audioUri}
            onChange={(newUri) => {
              let path: (string | number)[];
              if (blockIndex !== undefined && lineIndex !== undefined && wordIndex !== undefined) {
                path = ['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'lines', lineIndex, 'words', wordIndex, 'audioUri'];
              } else if (sectionIndex !== undefined && lineIndex !== undefined && wordIndex !== undefined) {
                path = ['lessons', lessonIndex, 'practicePage', 'practiceSections', sectionIndex, 'content', lineIndex, 'words', wordIndex, 'audioUri'];
              }
              else {
                console.error("Cannot update word audio URI: Insufficient path information.");
                return;
              }
              onFileSelect(path, file, 'audio');
            }}
          />
          <Button title="Remove Word" onPress={handleRemoveWord} color="red" />
        </View>
      ) : (
        <Text style={styles.wordText}>{displayKanji ? word.kanji : text}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wordText: {
    fontSize: 24,
    marginHorizontal: 4,
    color: Colors.light.tint,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  editableWord: {
    borderWidth: 1,
    borderColor: 'blue',
    padding: 5,
    margin: 2,
  },
  editableWordContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 5,
  }
});