import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import ViewerScreen from './(screens)/ViewerScreen';

export default function App() {
  if (process.env.NODE_ENV === 'production') {
    return <ViewerScreen />;
  }

  return (
    <View style={styles.container}>
      <Link href="/(screens)/ViewerScreen" style={styles.link}>
        Go to Viewer
      </Link>
      <Link href="/(screens)/EditorScreen" style={styles.link}>
        Go to Editor
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    marginVertical: 10,
    fontSize: 18,
    color: '#007AFF',
  },
});