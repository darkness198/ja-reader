import React from 'react';
import { StyleSheet } from 'react-native';
import { playSound, USE_LEGACY_AUDIO_PLAYER } from '../utils/audioPlayer';
// import { useAudioPlayer } from 'expo-audio'; // Removed as logic moved to BaseDetailsPanel
import { Colors } from '../constants/Colors';
import { BaseDetailsPanel } from './base/BaseDetailsPanel'; // Import BaseDetailsPanel

interface MultiLanguageText {
  [key: string]: string;
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

type SelectedItem = WordType | SentenceType | null;

interface StyledDetailsPanelProps {
  selectedItem: SelectedItem;
  languageCode: string;
  defaultLanguageCode: string;
}

const StyledDetailsPanel: React.FC<StyledDetailsPanelProps> = ({ selectedItem, languageCode, defaultLanguageCode }) => {
  const isWord = (item: SelectedItem): item is WordType => {
    return (item as WordType).text !== undefined && (item as WordType).id !== undefined;
  };

  const title = selectedItem
    ? (isWord(selectedItem) 
      ? selectedItem.text[languageCode] || selectedItem.text[defaultLanguageCode] || ''
      : selectedItem.fullText[languageCode] || selectedItem.fullText[defaultLanguageCode] || '')
    : '';

  const romanjiText = selectedItem && (languageCode === 'ja' || defaultLanguageCode === 'ja')
    ? (isWord(selectedItem)
      ? selectedItem.text['ja-rm'] || ''
      : selectedItem.fullText['ja-rm'] || '')
    : ''; // Ensure it's an empty string, not null

  const translation = selectedItem
    ? (isWord(selectedItem) 
      ? selectedItem.text.en || ''
      : selectedItem.fullText.en || '')
    : ''; // Ensure it's an empty string, not null

  const tone = selectedItem && isWord(selectedItem) && selectedItem.tone
    ? `Tone: ${selectedItem.tone}`
    : null;

  const kanjiText = selectedItem && isWord(selectedItem) && selectedItem.kanji
    ? selectedItem.kanji
    : null;

  const audioUri = selectedItem ? selectedItem.audioUri : null;

  return (
    <BaseDetailsPanel
      selectedItem={selectedItem}
      titleText={title}
      romanjiText={romanjiText}
      translationText={translation}
      toneText={tone}
      kanjiText={kanjiText}
      audioUri={audioUri}
      // onPlayAudio={playSound} // Removed as BaseDetailsPanel now handles its own audio playback
      placeholderText="Click a word or sentence for details"
      // Apply styles to the BaseDetailsPanel's internal components via props
      style={styles.container}
      titleStyle={styles.title}
      romanjiStyle={styles.romanji}
      translationStyle={styles.translation}
      toneStyle={styles.tone}
      kanjiStyle={styles.kanji}
      placeholderTextStyle={styles.placeholderText}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '30%',
    padding: 15,
    borderLeftWidth: 1,
    borderColor: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  placeholderText: {
    textAlign: 'center',
    color: Colors.light.icon,
    fontStyle: 'italic',
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.light.text,
  },
  romanji: {
    fontSize: 16,
    color: Colors.light.icon,
    marginBottom: 5,
  },
  translation: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 15,
  },
  tone: {
    fontSize: 16,
    color: Colors.light.icon,
    marginBottom: 10,
  },
  kanji: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 5,
  },
});

export default StyledDetailsPanel;
