import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function NarrativeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
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
});