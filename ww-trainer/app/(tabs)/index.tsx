import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Woodland Ways</Text>
      <Text style={styles.subtitle}>Instructor Trainer</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Start Training</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a0e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#c8a96e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8a9a6e',
    marginBottom: 60,
  },
  button: {
    backgroundColor: '#4a7c59',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});