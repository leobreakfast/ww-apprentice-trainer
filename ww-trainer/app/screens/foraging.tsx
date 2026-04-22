import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useState, useCallback } from 'react';
import { getModuleProgress, ModuleProgress, clearSessionProgress, getSessionProgress, SessionProgress } from '../../utils/progress';

const INTRO = { id: 'foraging_intro', name: 'Foraging Law & Intro', botanical: '' };

const PLANTS = [
  { id: 'rubus_fruticosus', name: 'Bramble', botanical: 'Rubus fruticosus' },
  { id: 'plantago_major', name: 'Broadleaf Plantain', botanical: 'Plantago major' },
  { id: 'arctium_lappa_minus', name: 'Burdock — Greater / Lesser', botanical: 'Arctium lappa / Arctium minus' },
  { id: 'stellaria_media', name: 'Chickweed', botanical: 'Stellaria media' },
  { id: 'galium_aparine', name: 'Cleavers', botanical: 'Galium aparine' },
  { id: 'rumex_obtusifolius_crispus', name: 'Dock — Broad-leaved / Curled', botanical: 'Rumex obtusifolius / Rumex crispus' },
  { id: 'glechoma_hederacea', name: 'Ground Ivy', botanical: 'Glechoma hederacea' },
  { id: 'geranium_robertianum', name: 'Herb Robert', botanical: 'Geranium robertianum' },
  { id: 'arum_maculatum', name: 'Lords and Ladies', botanical: 'Arum maculatum' },
  { id: 'carex_pendula', name: 'Pendulous Sedge', botanical: 'Carex pendula' },
  { id: 'matricaria_discoidea', name: 'Pineapple Weed', botanical: 'Matricaria discoidea' },
  { id: 'urtica_dioica', name: 'Stinging Nettle', botanical: 'Urtica dioica' },
  { id: 'oxalis_acetosella', name: 'Wood Sorrel', botanical: 'Oxalis acetosella' },
];

export default function ForagingScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState<ModuleProgress | null>(null);
  const [savedSession, setSavedSession] = useState<SessionProgress | null>(null);
  const [forageModal, setForageModal] = useState(false);
  const params = useLocalSearchParams();
  const [view, setView] = useState<'levels' | 'spark'>(
    params.view === 'spark' ? 'spark' : 'levels'
);
  

  useFocusEffect(
    useCallback(() => {
      getModuleProgress('foraging').then(setProgress);
      getSessionProgress('foraging').then(setSavedSession);
    }, [])
  );

  function getPlantStatus(plantId: string) {
    if (!progress) return { perfectCompletions: 0, currentStreak: 0 };
    return progress.plants[plantId] || { perfectCompletions: 0, currentStreak: 0 };
  }

if (view === 'levels') {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.push('/screens/modules')}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Foraging</Text>
        <Text style={styles.subtitle}>Choose your level</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => setView('spark')}
        >
          <Text style={styles.cardTitle}>💫 Spark</Text>
          <Text style={styles.cardDesc}>Multiple choice — Recognition</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, styles.locked]}>
          <Text style={styles.cardTitle}>💥 Ember</Text>
          <Text style={styles.cardDesc}>
            {progress?.emberUnlocked
              ? 'Unlocked — coming soon'
              : '🔒 Complete Spark to unlock'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, styles.locked]}>
          <Text style={styles.cardTitle}>🔥 Flame</Text>
          <Text style={styles.cardDesc}>🔒 Complete Ember to unlock</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => setView('levels')}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Foraging - Spark</Text>
      <Text style={styles.subtitle}>Score 100% on each lesson twice, or the full forage once, to unlock Ember.
                                

      </Text>

      <Text style={styles.sectionHeader}>Introduction</Text>
<TouchableOpacity
  style={[styles.card, getPlantStatus('foraging_intro').perfectCompletions >= 2 && styles.cardCompleted]}
  onPress={() => router.push({
  pathname: '/screens/question',
  params: { mode: 'intro' }
})}
>
  <View style={styles.cardRow}>
    <View>
      <Text style={styles.cardTitle}>Foraging Law & Intro</Text>
      <Text style={styles.cardDesc}>Cover the basics before heading out</Text>
    </View>
    <View style={styles.cardStats}>
      <Text style={styles.statText}>✓ {getPlantStatus('foraging_intro').perfectCompletions}</Text>
      {getPlantStatus('foraging_intro').currentStreak > 0 && (
        <Text style={styles.streakText}>🔥 {getPlantStatus('foraging_intro').currentStreak}</Text>
      )}
    </View>
  </View>
</TouchableOpacity>

      <Text style={styles.sectionHeader}>Plants</Text>
      {PLANTS.map(plant => {
        const status = getPlantStatus(plant.id);
        const completed = status.perfectCompletions >= 2;
        return (
          <TouchableOpacity
  key={plant.id}
  style={[styles.card, completed && styles.cardCompleted]}
  onPress={() => router.push({
    pathname: '/screens/question',
    params: { mode: 'plant', plantId: plant.id }
  })}
>
  <View style={styles.cardRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.cardTitle}>{plant.name}</Text>
      <Text style={styles.cardBotanical}>
        {plant.botanical}{completed ? '  · Ready for Ember ✓' : ''}
      </Text>
    </View>
    <View style={styles.cardStats}>
      {status.currentStreak > 0 && (
        <Text style={styles.streakText}>🔥 {status.currentStreak}</Text>
      )}
      <Text style={styles.statText}>✓ {status.perfectCompletions}</Text>
    </View>
  </View>
</TouchableOpacity>
        );
      })}

      <Text style={styles.sectionHeader}>Full Test</Text>
     
<TouchableOpacity
  style={[styles.card, styles.forageCard]}
  onPress={() => setForageModal(true)}
>
  <View style={styles.cardRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.cardTitle}>🌿 Take the Customers on a Forage</Text>
      <Text style={styles.cardDesc}>All plants in random order — unlocks Ember on perfect completion</Text>
      {savedSession && savedSession.completedPlantIds.length > 0 && (
        <Text style={styles.savedText}>● {savedSession.completedPlantIds.length} of {PLANTS.length} plants saved</Text>
      )}
    </View>
    <View style={styles.cardStats}>
      <Text style={styles.statText}>✓ {progress?.forage?.perfectCompletions ?? 0}</Text>
      {(progress?.forage?.currentStreak ?? 0) > 0 && (
        <Text style={styles.streakText}>🔥 {progress?.forage?.currentStreak}</Text>
      )}
    </View>
  </View>
</TouchableOpacity>

      <Modal visible={forageModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {savedSession && savedSession.completedPlantIds.length > 0 ? (
              <>
                <Text style={styles.modalTitle}>Continue session?</Text>
                <Text style={styles.modalText}>
                  {savedSession.completedPlantIds.length} of {PLANTS.length} plants completed
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setForageModal(false);
                    router.push({
                      pathname: '/screens/question',
                      params: {
                        mode: 'forage',
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
                  onPress={async () => {
                    await clearSessionProgress('foraging');
                    setSavedSession(null);
                    setForageModal(false);
                    router.push({
                      pathname: '/screens/narrative',
                      params: { mode: 'forage' }
                    });
                  }}
                >
                  <Text style={styles.modalButtonSecondaryText}>Start Fresh</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Ready to begin?</Text>
                <Text style={styles.modalText}>Take the customers on a full forage</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setForageModal(false);
                    router.push({
                      pathname: '/screens/narrative',
                      params: { mode: 'forage' }
                    });
                  }}
                >
                  <Text style={styles.modalButtonText}>Let's go</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setForageModal(false)}
            >
              <Text style={styles.modalCancelText}>Not yet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a0e',
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c8a96e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8a9a6e',
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 13,
    color: '#8a9a6e',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#2a2a1a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4a7c59',
  },
  cardCompleted: {
    borderLeftColor: '#c8a96e',
  },
  forageCard: {
    borderLeftColor: '#4a7c59',
    borderWidth: 1,
    borderColor: '#4a7c59',
  },
  locked: {
    opacity: 0.4,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardBotanical: {
    fontSize: 13,
    color: '#8a9a6e',
    fontStyle: 'italic',
  },
  cardDesc: {
    fontSize: 14,
    color: '#8a9a6e',
  },
  cardStats: {
    alignItems: 'flex-end',
  },
  statText: {
    fontSize: 16,
    color: '#c8a96e',
    fontWeight: 'bold',
  },
  streakText: {
    fontSize: 14,
    color: '#4a7c59',
    marginTop: 4,
  },
  completedText: {
    fontSize: 12,
    color: '#c8a96e',
    marginTop: 8,
  },
  savedText: {
    fontSize: 12,
    color: '#4a7c59',
    marginTop: 8,
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
    textAlign: 'center',
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
  
backText: {
  color: '#8a9a6e',
  fontSize: 16,
},
  
});