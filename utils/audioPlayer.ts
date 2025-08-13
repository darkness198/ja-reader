// import { Audio } from 'expo-audio';
import { Platform } from 'react-native';

const GITHUB_PAGES_BASE_URL = 'https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPO_NAME>';

// // Flag to switch between legacy and new audio player implementation
// export const USE_LEGACY_AUDIO_PLAYER = true; // Set to false to use the new hook-based implementation

// let currentSound: Audio.Sound | null = null;
// const isDeployedWeb = Platform.OS === 'web' && process.env.NODE_ENV === 'production';

// export const playSound = async (uri: string | null | undefined) => {
//   console.log("Legacy playSound called with URI:", uri); // Added log

//   if (!uri) {
//     console.warn("No audio URI provided.");
//     return;
//   }

//   let finalUri: string = uri;
//   if (isDeployedWeb && uri.startsWith('/')) {
//     finalUri = `${GITHUB_PAGES_BASE_URL}${uri}`;
//   }
//   console.log("Attempting to play final URI (Legacy):", finalUri); // Added log

//   try {
//     if (currentSound) {
//       console.log("Unloading previous sound (Legacy)."); // Added log
//       await currentSound.unloadAsync();
//       currentSound = null; // Ensure it's null after unloading
//     }

//     const { sound } = await Audio.Sound.createAsync(
//       { uri: finalUri }
//     );
//     currentSound = sound;

//     await currentSound.playAsync();
//     console.log("Sound created and playing (Legacy)."); // Added log
//   } catch (error) {
//     console.error("Failed to play sound from (Legacy):", finalUri, "Error details:", error); // Enhanced error log
//     // Optionally, provide user feedback here
//   }
// };