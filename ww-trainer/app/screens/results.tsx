import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResultsScreen() {
  const router = useRouter();
  const { score, bonusScore, total, totalBonus, mode, plantId, missedQuestions } = useLocalSearchParams();

  const scoreNum = Number(score);
  const totalNum = Number(total);
  const passed = scoreNum === totalNum;
  const isPlantMode = mode === 'plant';

  const missed: { id: string; question: string }[] = missedQuestions
    ? JSON.parse(missedQuestions as string)
    : [];

  const modeLabel = isPlantMode ? 'Plant Practice' : 'Full Customer Forage';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.emoji}>{passed ? '🔥' : '🌱'}</Text>
      <Text style={styles.title}>{passed ? 'Perfect!' : 'Keep Practising'}</Text>

      <View style={styles.scoreBox}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.score}>{score} / {total}</Text>
        {passed && <Text style={styles.passText}>100% ✓</Text>}
      </View>

      <View style={styles.bonusBox}>
        <Text style={styles.bonusLabel}>Bonus Questions</Text>
        <Text style={styles.bonusScore}>{bonusScore} / {totalBonus}</Text>
      </View>

      <Text style={styles.subtitle}>{modeLabel} — Spark</Text>

      {missed.length > 0 && (
        <View style={styles.missedBox}>
          <Text style={styles.missedTitle}>⚠️ Review these questions</Text>
          {missed.map((q, i) => (
            <Text key={i} style={styles.missedItem}>· {q.question}</Text>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({
          pathname: '/screens/foraging',
          params: { view: 'spark' }
        })}
      >
        <Text style={styles.buttonText}>
          {isPlantMode ? 'Back to Plants' : 'Back to Foraging'}
        </Text>
      </TouchableOpacity>

      {isPlantMode && (
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => router.push({
            pathname: '/screens/question',
            params: { mode: 'plant', plantId }
          })}
        >
          <Text style={styles.buttonSecondaryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  passText: {
    fontSize: 16,
    color: '#4a7c59',
    marginTop: 8,
    fontWeight: 'bold',
  },
  bonusBox: {
    backgroundColor: '#2a2a1a',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
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
    marginBottom: 24,
  },
  missedBox: {
    backgroundColor: '#2a1a1a',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#7c4a4a',
  },
  missedTitle: {
    fontSize: 14,
    color: '#c87a7a',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  missedItem: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 22,
    marginBottom: 4,
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