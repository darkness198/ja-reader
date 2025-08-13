import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
import { StyledText } from '@/components/StyledText';
import { StyledView } from '@/components/StyledView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <StyledView style={styles.container}>
        <StyledText type="title">This screen does not exist.</StyledText>
        <Link href="/" style={styles.link}>
          <StyledText type="link">Go to home screen!</StyledText>
        </Link>
      </StyledView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
