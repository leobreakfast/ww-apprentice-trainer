import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ModulesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Module</Text>

      <TouchableOpacity 
        style={styles.module}
        onPress={() => router.push('/screens/foraging')}
      >
        <Text style={styles.moduleName}>Foraging 🌿</Text>

      </TouchableOpacity>

      <TouchableOpacity style={[styles.module, styles.locked]}>
        <Text style={styles.moduleName}>Camp Intro</Text>
        <Text style={styles.moduleStatus}>🔒 Coming soon</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.module, styles.locked]}>
        <Text style={styles.moduleName}>Knife and Saw Skills</Text>
        <Text style={styles.moduleStatus}>🔒 Coming soon</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a0e',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c8a96e',
    marginBottom: 32,
  },
  module: {
    backgroundColor: '#2a2a1a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4a7c59',
  },
  locked: {
    opacity: 0.4,
  },
  moduleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  moduleStatus: {
    fontSize: 14,
    color: '#8a9a6e',
  },
});