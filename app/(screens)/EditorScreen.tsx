import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, SafeAreaView, Alert, Platform } from 'react-native';
import { produce } from 'immer';
import initialBookData from '../../data/bookData.json';
import { Colors } from '../../constants/Colors';
import LessonScreen from '../../components/viewer/LessonScreen'; // Import LessonScreen

// Define types based on the structure of your bookData.json
interface MultiLanguageText {
  [key: string]: string;
}

interface WordType {
  id: string;
  text: MultiLanguageText;
  audioUri: string | null;
  tone?: string | null;
}

interface LineType {
  id: string;
  fullText: MultiLanguageText;
  audioUri: string | null;
  words: WordType[];
}

interface StoryBlockType {
  id: string;
  illustrationUri: string | null;
  lines: LineType[];
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
  practicePage?: PracticePageType;
}

interface Language {
  code: string;
  name: string;
}

interface BookData {
  metadata: {
    title: MultiLanguageText;
    subtitle: MultiLanguageText;
    languages: Language[];
  };
  lessons: LessonType[];
}

const typedInitialBookData: BookData = initialBookData as BookData;
const defaultLanguage = typedInitialBookData.metadata.languages[0];

export default function EditorScreen() {
  const [bookData, setBookData] = useState<BookData>(typedInitialBookData);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newAudioFiles, setNewAudioFiles] = useState<Set<string>>(new Set());
  const [newImageFiles, setNewImageFiles] = useState<Set<string>>(new Set());

  // Generic handler for updating any part of the bookData state
  const handleDataChange = (path: (string | number)[], newValue: any) => {
    const nextState = produce(bookData, draft => {
      let current: any = draft;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = newValue;
    });
    setBookData(nextState);
  };

  // Generic handler for file selection (audio or image)
  const handleAudioUpload = async (
    file: File,
    lessonNumber: number,
    itemType: 'words' | 'lines',
    itemId: string,
    dataPath: (string | number)[] // The path to update in bookData
  ) => {
    if (Platform.OS !== 'web') {
      Alert.alert("Error", "Audio upload is only supported on web for local development.");
      return;
    }

    const formData = new FormData();
    formData.append('audioFile', file);
    formData.append('lessonNumber', String(lessonNumber));
    formData.append('itemType', itemType);
    formData.append('itemId', itemId);

    try {
      const response = await fetch('http://localhost:3001/upload-audio', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("Success", result.message);
        // Update the audioUri in the local state
        handleDataChange(dataPath, result.audioUri);
        // Add the new audio file to the set for export instructions (if still needed)
        setNewAudioFiles(prev => new Set(prev).add(result.audioUri));
      } else {
        Alert.alert("Error", result.message || "Failed to upload audio.");
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      Alert.alert("Error", "Could not connect to local audio server or an unknown error occurred.");
    }
  };

  const handleFileSelect = async (path: (string | number)[], file: File, type: 'audio' | 'image') => {
    if (!file) return;

    if (type === 'audio') {
      const lessonIndex = path[1] as number;
      const lessonNumber = bookData.lessons[lessonIndex].lessonNumber;

      let itemType: 'words' | 'lines';
      let itemId: string;

      // Determine itemType and itemId based on path structure
      if (path.includes('words')) {
        itemType = 'words';
        let currentItem: any = bookData;
        for (let i = 0; i < path.length - 1; i++) {
          currentItem = currentItem[path[i]];
        }
        itemId = currentItem.id;
      } else if (path.includes('lines')) {
        itemType = 'lines';
        let currentItem: any = bookData;
        for (let i = 0; i < path.length - 1; i++) {
          currentItem = currentItem[path[i]];
        }
        itemId = currentItem.id;
      } else {
        Alert.alert("Error", "Could not determine audio item type (word or line).");
        return;
      }

      await handleAudioUpload(file, lessonNumber, itemType, itemId, path);

    } else {
      const fileName = file.name;
      const newUri = `/images/lessons/${fileName}`;
      setNewImageFiles(prev => new Set(prev).add(fileName));
      handleDataChange(path, newUri);
    }
  };

  const handleExport = () => {
    const jsonString = JSON.stringify(bookData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookData.json';
    a.click();
    URL.revokeObjectURL(url);
    
    Alert.alert("Export Complete", "✅ `bookData.json` downloaded!\n\nReplace the old file at `data/bookData.json`.");
    setNewAudioFiles(new Set());
    setNewImageFiles(new Set());
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData: BookData = JSON.parse(e.target?.result as string);
          setBookData(importedData);
          Alert.alert("Import Complete", "`bookData.json` imported successfully!");
        } catch (error) {
          Alert.alert("Import Error", "Failed to parse JSON file.");
          console.error("Error parsing imported JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const createAndTriggerFileInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = handleImport as any; // Workaround for onchange type
    input.click();
  };

  return (
    <SafeAreaView style={editorStyles.container}>
      <View style={editorStyles.header}>
        <Text style={editorStyles.title}>Nihongo Book Editor</Text>
        <View style={editorStyles.buttonContainer}>
          <Button title={isEditing ? "Save & View" : "Edit Mode"} onPress={() => setIsEditing(!isEditing)} />
          <Button title="Import `bookData.json`" onPress={createAndTriggerFileInput} />
          <Button title="Export `bookData.json`" onPress={handleExport} />
        </View>
        {isEditing && (
          <Text style={editorStyles.instructions}>Editing is active. Changes are saved automatically. Click "Save & View" to exit.</Text>
        )}
        {!isEditing && (
          <Text style={editorStyles.instructions}>Click "Edit Mode" to enable in-place editing.</Text>
        )}
      </View>

      <LessonScreen
        lesson={bookData.lessons[currentLessonIndex]}
        languageCode={language.code}
        defaultLanguageCode={defaultLanguage.code}
        onWordSelect={() => {}} // Placeholder, will be implemented later
        onSentenceSelect={() => {}} // Placeholder, will be implemented later
        audioMode="word" // Default audio mode for now
        isEditing={isEditing} // Pass isEditing prop
        onDataChange={handleDataChange} // Pass data change handler
        onFileSelect={handleFileSelect} // Pass file select handler
        bookLanguages={bookData.metadata.languages} // Pass book languages
      />

      <View style={editorStyles.navigation}>
        <Button title="Previous" onPress={() => setCurrentLessonIndex(p => Math.max(0, p - 1))} disabled={currentLessonIndex === 0} />
        <Text style={{color: Colors.light.text}}>Lesson {currentLessonIndex + 1}</Text>
        <Button title="Next" onPress={() => setCurrentLessonIndex(p => Math.min(typedInitialBookData.lessons.length - 1, p + 1))} disabled={currentLessonIndex === typedInitialBookData.lessons.length - 1} />
      </View>
    </SafeAreaView>
  );
}

const editorStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { padding: 20, backgroundColor: Colors.light.background, borderBottomWidth: 1, borderColor: Colors.light.text },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: Colors.light.text },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 10 },
  instructions: { textAlign: 'center', color: Colors.light.icon, marginTop: 10, marginBottom: 5 },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: Colors.light.text },
});
