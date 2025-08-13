import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

interface DisplayWordInEditorProps {
  word: WordType;
}

export default function DisplayWordInEditor({ word }: DisplayWordInEditorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.wordText}>{word.text.ja} ({word.text['ja-rm']})</Text>
      {word.tone && <Text style={styles.toneText}>Tone: {word.tone}</Text>}
      <Text style={styles.uriText}>Audio: {word.audioUri || 'No audio set'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: 10, 
      borderBottomWidth: 1, 
      borderColor: Colors.light.text,
      backgroundColor: Colors.light.background,
      marginBottom: 5,
    },
    wordText: { 
      fontSize: 16, 
      flex: 1, 
      color: Colors.light.text 
    },
    toneText: {
      fontSize: 14,
      color: Colors.light.icon,
      marginLeft: 10,
    },
    uriText: { 
      flex: 2, 
      marginLeft: 15, 
      color: Colors.light.icon, 
      fontFamily: 'monospace', 
      fontSize: 12 
    },
});