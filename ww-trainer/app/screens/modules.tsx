import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function ModulesScreen() {
  const router = useRouter();

  return (
    <ImageBackground
  source={require('../../assets/images/backgrounds/background-field_01.jpg')}
  style={styles.container}
  resizeMode="cover">

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
    </ImageBackground>
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
    fontFamily: `PressStart2P_400Regular`,
    fontSize: 20,
    textAlign: 'center',
    color: '#000000',
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
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 0,
    fontFamily: `PressStart2P_400Regular`,
  },
  moduleStatus: {
    fontSize: 14,
    color: '#8a9a6e',
  },
});