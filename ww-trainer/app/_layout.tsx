import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    PressStart2P_400Regular,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  const theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#1a1a0e',
    },
  };

  return (
    <ThemeProvider value={theme}>
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#1a1a0e' },
        animation: 'none',
        animationTypeForReplace: 'pop'
      }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="screens/modules" />
        <Stack.Screen name="screens/foraging" />
        <Stack.Screen name="screens/narrative" />
        <Stack.Screen name="screens/question" />
        <Stack.Screen name="screens/results" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}