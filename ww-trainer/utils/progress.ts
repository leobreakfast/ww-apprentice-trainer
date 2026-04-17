import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ModuleProgress {
  spark: {
    completed: boolean;
    completionCount: number;
    lastScore: number;
    lastBonusScore: number;
    lastPlayed: string | null;
  };
  ember: {
    completed: boolean;
    completionCount: number;
    lastScore: number;
    lastBonusScore: number;
    lastPlayed: string | null;
  };
  flame: {
    completed: boolean;
    completionCount: number;
    lastScore: number;
    lastBonusScore: number;
    lastPlayed: string | null;
  };
}

const DEFAULT_LEVEL = {
  completed: false,
  completionCount: 0,
  lastScore: 0,
  lastBonusScore: 0,
  lastPlayed: null,
};

const DEFAULT_PROGRESS: ModuleProgress = {
  spark: { ...DEFAULT_LEVEL },
  ember: { ...DEFAULT_LEVEL },
  flame: { ...DEFAULT_LEVEL },
};

export async function getModuleProgress(moduleId: string): Promise<ModuleProgress> {
  try {
    const data = await AsyncStorage.getItem(`progress_${moduleId}`);
    return data ? JSON.parse(data) : DEFAULT_PROGRESS;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export async function saveModuleProgress(
  moduleId: string,
  level: 'spark' | 'ember' | 'flame',
  score: number,
  bonusScore: number,
  total: number
): Promise<void> {
  try {
    const progress = await getModuleProgress(moduleId);
    const passed = score === total;
    progress[level] = {
      completed: passed || progress[level].completed,
      completionCount: passed ? progress[level].completionCount + 1 : progress[level].completionCount,
      lastScore: score,
      lastBonusScore: bonusScore,
      lastPlayed: new Date().toISOString(),
    };
    await AsyncStorage.setItem(`progress_${moduleId}`, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
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