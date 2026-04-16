import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1a1a0e',
  },
};

export default function RootLayout() {
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