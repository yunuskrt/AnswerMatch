import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#fafaf8' },
          headerTintColor: '#1a1a1a',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#fafaf8' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="create-room" options={{ title: 'Create Room' }} />
        <Stack.Screen name="host-lobby" options={{ title: 'Lobby', headerBackVisible: false }} />
        <Stack.Screen name="guest-lobby" options={{ title: 'Join Room' }} />
        <Stack.Screen name="ask-phase" options={{ headerShown: false }} />
        <Stack.Screen name="answer-phase" options={{ headerShown: false }} />
        <Stack.Screen name="matching-phase" options={{ headerShown: false }} />
        <Stack.Screen name="round-leaderboard" options={{ headerShown: false }} />
        <Stack.Screen name="final-results" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
