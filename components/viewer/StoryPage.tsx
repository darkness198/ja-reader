import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import Sentence from './Sentence';
import { Colors } from '../../constants/Colors';
import { playSound } from '../../utils/audioPlayer';

// Import Editable components
import EditableText from '../../components/editor/EditableText';
import EditableMultiLanguageText from '../../components/editor/EditableMultiLanguageText';
import EditableAudioUri from '../../components/editor/EditableAudioUri';
import EditableIllustrationUri from '../../components/editor/EditableIllustrationUri';

const PlaceholderImage = () => <View style={styles.placeholderImage}><Text>Illustration</Text></View>;

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

interface StoryPageProps {
  pageData: StoryPageType;
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

export default function StoryPage({
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
}: StoryPageProps) {
  const title = pageData.title[languageCode] || pageData.title[defaultLanguageCode] || '';

  const playPageAudio = async () => {
    if (pageData.audioUri) {
      await playSound(pageData.audioUri);
    }
    for (const block of pageData.storyBlocks) {
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

  const handleAddStoryBlock = () => {
    const newBlock: StoryBlockType = {
      id: `block-${Date.now()}`,
      illustrationUri: null,
      lines: [],
    };
    onDataChange(['lessons', lessonIndex, 'storyPage', 'storyBlocks'], [...pageData.storyBlocks, newBlock]);
  };

  const handleRemoveStoryBlock = (blockIndex: number) => {
    const updatedBlocks = pageData.storyBlocks.filter((_, idx) => idx !== blockIndex);
    onDataChange(['lessons', lessonIndex, 'storyPage', 'storyBlocks'], updatedBlocks);
  };

  const handleAddLine = (blockIndex: number) => {
    const newLine: SentenceType = {
      id: `line-${Date.now()}`,
      fullText: { ja: '', 'ja-rm': '', en: '' },
      audioUri: null,
      words: [],
    };
    onDataChange(['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'lines'], [...pageData.storyBlocks[blockIndex].lines, newLine]);
  };

  const handleRemoveLine = (blockIndex: number, lineIndex: number) => {
    const updatedLines = pageData.storyBlocks[blockIndex].lines.filter((_, idx) => idx !== lineIndex);
    onDataChange(['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'lines'], updatedLines);
  };

  return (
    <View style={styles.pageContainer}>
      {isEditing ? (
        <EditableMultiLanguageText
          label="Story Page Title"
          value={pageData.title}
          onChange={(newValue) => onDataChange(['lessons', lessonIndex, 'storyPage', 'title'], newValue)}
          languages={bookLanguages}
        />
      ) : (
        <Text style={styles.pageTitle}>{title}</Text>
      )}
      
      {isEditing && (
        <EditableAudioUri
          label="Story Page Audio URI"
          value={pageData.audioUri}
          onChange={(newUri) => onDataChange(['lessons', lessonIndex, 'storyPage', 'audioUri'], newUri)}
          onFileSelect={(file) => onFileSelect(['lessons', lessonIndex, 'storyPage', 'audioUri'], file, 'audio')}
        />
      )}

      {audioMode === 'page' && !isEditing && (
        <Button title="Play Page Audio" onPress={playPageAudio} />
      )}

      {isEditing && <Button title="Add Story Block" onPress={handleAddStoryBlock} />}

      {pageData.storyBlocks.map((block, blockIndex) => (
        <View key={block.id} style={[styles.storyBlock, isEditing && styles.editableBlock]}>
          {isEditing ? (
            <View>
              <EditableIllustrationUri
                label="Illustration URI"
                value={block.illustrationUri}
                onChange={(newUri) => onDataChange(['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'illustrationUri'], newUri)}
                onFileSelect={(file) => onFileSelect(['lessons', lessonIndex, 'storyPage', 'storyBlocks', blockIndex, 'illustrationUri'], file, 'image')}
              />
              <Button title="Remove Story Block" onPress={() => handleRemoveStoryBlock(blockIndex)} color="red" />
            </View>
          ) : (
            block.illustrationUri ? <Image source={{uri: block.illustrationUri}} style={styles.illustration} /> : <PlaceholderImage />
          )}

          {isEditing && <Button title="Add Line" onPress={() => handleAddLine(blockIndex)} />}

          {block.lines.map((line, lineIndex) => (
            <View key={line.id} style={isEditing && styles.editableLine}>
              <Sentence
                sentence={line}
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
                blockIndex={blockIndex} // Pass new prop
                lineIndex={lineIndex} // Pass new prop
              />
              {isEditing && <Button title="Remove Line" onPress={() => handleRemoveLine(blockIndex, lineIndex)} color="red" />}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  pageContainer: { padding: 15, backgroundColor: Colors.light.background },
  pageTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: Colors.light.text },
  storyBlock: { marginBottom: 20, alignItems: 'center' },
  editableBlock: { borderWidth: 1, borderColor: 'blue', padding: 10, marginBottom: 20 }, // Visual indicator for editable block
  editableLine: { borderWidth: 1, borderColor: 'green', padding: 5, marginBottom: 10 }, // Visual indicator for editable line
  placeholderImage: { width: '90%', height: 150, backgroundColor: Colors.light.background, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  illustration: { width: '90%', height: 150, borderRadius: 10, marginBottom: 10, resizeMode: 'contain' },
});