import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { getSessionProgress, SessionProgress, clearSessionProgress } from '../../utils/progress';
import { useFocusEffect } from 'expo-router';


export default function ForagingScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [savedSession, setSavedSession] = useState<SessionProgress | null>(null);

useFocusEffect(
  useCallback(() => {
    getSessionProgress('foraging').then(session => {
      setSavedSession(session);
    });
  }, [])
);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foraging</Text>
      <Text style={styles.subtitle}>Choose your level</Text>

      <TouchableOpacity
        style={styles.level}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.levelName}>⚡ Spark</Text>
        <Text style={styles.levelDesc}>Multiple choice — Recognition</Text>
        {savedSession && (
          <Text style={styles.savedText}>
            ● {savedSession.completedPlantIds.length} of 5 plants saved
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.level, styles.locked]}>
        <Text style={styles.levelName}>🔥 Ember</Text>
        <Text style={styles.levelDesc}>🔒 Complete Spark first</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.level, styles.locked]}>
        <Text style={styles.levelName}>🔥 Flame</Text>
        <Text style={styles.levelDesc}>🔒 Complete Ember first</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {savedSession && savedSession.completedPlantIds.length > 0 ? (
              <>
                <Text style={styles.modalTitle}>Continue session?</Text>
                <Text style={styles.modalText}>
                  {savedSession.completedPlantIds.length} of 5 plants completed
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setModalVisible(false);
                    router.push({
                      pathname: '/screens/question',
                      params: {
                        continueSession: 'true',
                        completedPlantIds: JSON.stringify(savedSession.completedPlantIds),
                        savedScore: savedSession.currentScore,
                        savedBonusScore: savedSession.currentBonusScore,
                      }
                    });
                  }}
                >
                  <Text style={styles.modalButtonText}>Continue</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonSecondary}
                  onPress={() => {
                    setModalVisible(false);
                    router.push('/screens/narrative');
                  }}
                >
                  <Text style={styles.modalButtonSecondaryText}>Start Fresh</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Ready to begin?</Text>
                <Text style={styles.modalText}>Spark level — Foraging</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={async () => {
  setModalVisible(false);
  await clearSessionProgress('foraging');
  setSavedSession(null);
  router.push('/screens/narrative');
}}
                >
                  <Text style={styles.modalButtonText}>Yes, let's go</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Not yet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8a9a6e',
    marginBottom: 32,
  },
  level: {
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
  levelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  levelDesc: {
    fontSize: 14,
    color: '#8a9a6e',
  },
  savedText: {
    fontSize: 12,
    color: '#4a7c59',
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: '#2a2a1a',
    borderRadius: 12,
    padding: 32,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c8a96e',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#8a9a6e',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#4a7c59',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonSecondary: {
    backgroundColor: '#2a3a2a',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a7c59',
  },
  modalButtonSecondaryText: {
    color: '#8a9a6e',
    fontSize: 16,
  },
  modalCancel: {
    paddingVertical: 10,
  },
  modalCancelText: {
    color: '#8a9a6e',
    fontSize: 14,
  },
});