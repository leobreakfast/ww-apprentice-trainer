import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuestionMiss {
  questionId: string;
  question: string;
  missedCount: number;
  lastMissed: boolean;
}

export interface PlantProgress {
  perfectCompletions: number;
  currentStreak: number;
  missedQuestions: QuestionMiss[];
}

export interface ModuleProgress {
  plants: { [plantId: string]: PlantProgress };
  forage: PlantProgress;
  sparkUnlocked: boolean;
  emberUnlocked: boolean;
  flameUnlocked: boolean;
  fullForageCompleted: boolean;
}

const DEFAULT_PLANT: PlantProgress = {
  perfectCompletions: 0,
  currentStreak: 0,
  missedQuestions: [],
};

const DEFAULT_PROGRESS: ModuleProgress = {
  plants: {},
  forage: { perfectCompletions: 0, currentStreak: 0, missedQuestions: [] },
  sparkUnlocked: true,
  emberUnlocked: false,
  flameUnlocked: false,
  fullForageCompleted: false,
};

export async function getModuleProgress(moduleId: string): Promise<ModuleProgress> {
  try {
    const data = await AsyncStorage.getItem(`progress_${moduleId}`);
    if (!data) return { ...DEFAULT_PROGRESS, plants: {} };
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      plants: parsed.plants || {},
    };
  } catch {
    return { ...DEFAULT_PROGRESS, plants: {} };
  }
}

export async function savePlantResult(
  moduleId: string,
  plantId: string,
  perfect: boolean
): Promise<ModuleProgress> {
  try {
    const progress = await getModuleProgress(moduleId);
    const plant = progress.plants[plantId] || { ...DEFAULT_PLANT };

    if (perfect) {
      plant.perfectCompletions += 1;
      plant.currentStreak += 1;
    } else {
      plant.currentStreak = 0;
    }

    progress.plants[plantId] = plant;

    const allPlantIds = ['oxalis_acetosella', 'galium_aparine', 'glechoma_hederacea', 'stellaria_media', 'urtica_dioica'];
    const allPerfect = allPlantIds.every(id =>
      (progress.plants[id]?.perfectCompletions ?? 0) >= 2
    );

    if (allPerfect || progress.fullForageCompleted) {
      progress.emberUnlocked = true;
    }

    await AsyncStorage.setItem(`progress_${moduleId}`, JSON.stringify(progress));
    return progress;
  } catch (error) {
    console.error('Error saving plant result:', error);
    return DEFAULT_PROGRESS;
  }
}

export async function saveFullForageResult(
  moduleId: string,
  perfect: boolean
): Promise<void> {
  try {
    const progress = await getModuleProgress(moduleId);
    if (perfect) {
      progress.forage.perfectCompletions += 1;
      progress.forage.currentStreak += 1;
      progress.fullForageCompleted = true;
      progress.emberUnlocked = true;
    } else {
      progress.forage.currentStreak = 0;
    }
    await AsyncStorage.setItem(`progress_${moduleId}`, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving forage result:', error);
  }
}

export interface SessionProgress {
  completedPlantIds: string[];
  currentScore: number;
  currentBonusScore: number;
  savedAt: string;
}

export async function saveSessionProgress(
  moduleId: string,
  completedPlantIds: string[],
  currentScore: number,
  currentBonusScore: number
): Promise<void> {
  try {
    const session: SessionProgress = {
      completedPlantIds,
      currentScore,
      currentBonusScore,
      savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(`session_${moduleId}`, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export async function getSessionProgress(moduleId: string): Promise<SessionProgress | null> {
  try {
    const data = await AsyncStorage.getItem(`session_${moduleId}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function clearSessionProgress(moduleId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(`session_${moduleId}`);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

export async function saveMissedQuestions(
  moduleId: string,
  plantId: string,
  missed: { id: string; question: string }[]
): Promise<void> {
  try {
    const progress = await getModuleProgress(moduleId);
    const plant = progress.plants[plantId] || { ...DEFAULT_PLANT };

    // Reset lastMissed on all existing questions
    plant.missedQuestions = (plant.missedQuestions || []).map(q => ({
      ...q,
      lastMissed: false
    }));

    // Update or add missed questions
    missed.forEach(({ id, question }) => {
      const existing = plant.missedQuestions.find(q => q.questionId === id);
      if (existing) {
        existing.missedCount += 1;
        existing.lastMissed = true;
      } else {
        plant.missedQuestions.push({
          questionId: id,
          question,
          missedCount: 1,
          lastMissed: true
        });
      }
    });

    progress.plants[plantId] = plant;
    await AsyncStorage.setItem(`progress_${moduleId}`, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving missed questions:', error);
  }
}