import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResultsScreen() {
  const router = useRouter();
  const { score, bonusScore, total, totalBonus } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌿</Text>
      <Text style={styles.title}>Session Complete</Text>

      <View style={styles.scoreBox}>
        <Text style={styles.scoreLabel}>Main Score</Text>
        <Text style={styles.score}>{score} / {total}</Text>
      </View>

      <View style={styles.bonusBox}>
        <Text style={styles.bonusLabel}>Bonus Questions</Text>
        <Text style={styles.bonusScore}>{bonusScore} / {totalBonus}</Text>
      </View>

      <Text style={styles.subtitle}>Foraging — Spark</Text>

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
    marginBottom: 32,
  },
  scoreBox: {
    backgroundColor: '#2a2a1a',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4a7c59',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#8a9a6e',
    marginBottom: 8,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bonusBox: {
    backgroundColor: '#2a2a1a',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#c8a96e',
  },
  bonusLabel: {
    fontSize: 14,
    color: '#8a9a6e',
    marginBottom: 8,
  },
  bonusScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#c8a96e',
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