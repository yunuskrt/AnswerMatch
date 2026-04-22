import { useFonts, Caveat_400Regular, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

type Props = {}
const RootLayout = ({}: Props) => {
  const [fontsLoaded] = useFonts({ Caveat_400Regular, Caveat_700Bold });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#fafaf8' },
          headerTintColor: '#1a1a1a',
          headerTitleStyle: { fontFamily: 'Caveat_700Bold', fontWeight: '700' },
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
export default RootLayout;
