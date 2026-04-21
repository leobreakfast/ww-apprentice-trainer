import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function NarrativeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.scene}>🌿</Text>
        <Text style={styles.narrative}>
          Your customers are gathered and ready to head out. Before you go,
          you need to cover the basics of foraging law and safe practice.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/screens/question')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.exitButton}
        onPress={() => router.push({
          pathname: '/screens/foraging',
          params: { view: 'spark' }
        })}
      >
        <Text style={styles.exitText}>← Exit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a0e',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  scene: {
    fontSize: 64,
    marginBottom: 32,
  },
  narrative: {
    fontSize: 18,
    color: '#c8a96e',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#4a7c59',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 10,
  },
  backText: {
    color: '#8a9a6e',
    fontSize: 16,
  },
  exitButton: {
    paddingVertical: 14,
    paddingBottom: 32,
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2a2a1a',
  },
  exitText: {
    color: '#8a9a6e',
    fontSize: 16,
  },
  
});