import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Development Hub' }} />
      <Stack.Screen name="(screens)/ViewerScreen" options={{ title: 'Viewer' }} />
      <Stack.Screen name="(screens)/EditorScreen" options={{ title: 'Editor' }} />
    </Stack>
  );
}