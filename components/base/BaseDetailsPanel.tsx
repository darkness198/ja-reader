import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAudioPlayer } from 'expo-audio'; // Import useAudioPlayer
// Removed: import { playSound, USE_LEGACY_AUDIO_PLAYER } from '../../utils/audioPlayer'; // Import playSound and flag
import { useAssets } from 'expo-asset';
import { getlocalAudioURI } from '@/utils/localaudio';

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

interface BaseDetailsPanelProps {
  selectedItem: SelectedItem;
  titleText: string;
  romanjiText: string | null; // New prop for Romanization
  translationText: string | null;
  toneText: string | null;
  kanjiText: string | null;
  audioUri: string | null;
  // onPlayAudio: (uri: string) => void; // REMOVE THIS PROP
  placeholderText: string;
  // Add style props for internal components
  style?: object;
  titleStyle?: object;
  romanjiStyle?: object; // New style prop for Romanization
  translationStyle?: object;
  toneStyle?: object;
  kanjiStyle?: object;
  placeholderTextStyle?: object;
}

function speakJapanese(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    speechSynthesis.speak(utterance);
}

export const BaseDetailsPanel: React.FC<BaseDetailsPanelProps> = ({
  selectedItem,
  titleText,
  romanjiText,
  translationText,
  toneText,
  kanjiText,
  audioUri,
  // onPlayAudio, // REMOVED THIS PROP
  placeholderText,
  style,
  titleStyle,
  romanjiStyle,
  translationStyle,
  toneStyle,
  kanjiStyle,
  placeholderTextStyle,
}) => {
 
  console.log('here', `../../${audioUri}`)
  audioUri = getlocalAudioURI(selectedItem)// '/assets/?unstable_path=.%2Fassets%2Faudio%2Flines/' + `${selectedItem?.id}.mp3`
  const player = useAudioPlayer(audioUri|| undefined);

  const handlePlayAudio = () => {
    if(!selectedItem?.audioUri) {
      selectedItem && speakJapanese((selectedItem as any)?.fullText?.ja || (selectedItem as any)?.text?.ja)
      console.warn('using browser audio')
      return
    }
    if (!audioUri) {

      console.warn("No audio URI available for playback.");
      return;
    }

    if (player) {
      player.seekTo(0);
      player.play();
    } else {
      console.warn("Audio player not initialized for hook-based playback in BaseDetailsPanel.");
    }
  };

  if (!selectedItem) {
    return (
      <View style={style}>
        <Text style={placeholderTextStyle}>{placeholderText}</Text>
      </View>
    );
  }

  return (
    <View style={style}>
      <Text style={titleStyle}>{String(titleText)}</Text>
      {romanjiText && <Text style={romanjiStyle}>{String(romanjiText)}</Text>}
      {translationText && <Text style={translationStyle}>{String(translationText)}</Text>}
      {toneText && <Text style={toneStyle}>{String(toneText)}</Text>}
      {kanjiText && <Text style={kanjiStyle}>{String(kanjiText)}</Text>}
      {audioUri && (
        <Button title="Play Audio" onPress={handlePlayAudio} />
      )}
    </View>
  );
};