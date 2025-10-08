import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SnackbarProvider } from './components/SnackbarProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SnackbarProvider>
        <Stack>
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
        </Stack>
      </SnackbarProvider>
    </SafeAreaProvider>
  );
}
