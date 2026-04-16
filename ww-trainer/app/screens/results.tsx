import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResultsScreen() {
  const router = useRouter();
  const { score, total } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌿</Text>
      <Text style={styles.title}>Session Complete</Text>
      <Text style={styles.score}>{score} / {total}</Text>
      <Text style={styles.subtitle}>Foraging — Spark — Introduction</Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/screens/foraging')}
      >
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.buttonSecondary}
        onPress={() => router.push('/screens/modules')}
      >
        <Text style={styles.buttonSecondaryText}>Back to Modules</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a0e',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c8a96e',
    marginBottom: 16,
  },
  score: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8a9a6e',
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#4a7c59',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#8a9a6e',
    fontSize: 16,
  },
});