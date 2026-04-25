import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { BackHandler } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { saveSessionProgress, clearSessionProgress, savePlantResult, saveFullForageResult, saveMissedQuestions, getModuleProgress } from '../../utils/progress';
import plantImages from '../../content/plantImages';
import introData from '../../content/foraging/intro.json';
import * as PlantFiles from '../../content/foraging/plants/index';
import ImageCarousel from '../../components/ImageCarousel';



function shuffleArray(array: string[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function shufflePlants(plants: any[]) {
  return [...plants].sort(() => Math.random() - 0.5);
}

const PLANTS = Object.values(PlantFiles);

function buildPlantQuestions(plant: any) {
  return [
    { type: 'plant_narrative', plant, section: 'narrative' },
    ...plant.questions.filter((q: any) => !q.bonus).map((q: any) => ({
      ...q,
      options: shuffleArray(q.options),
      section: 'plant',
      plant
    })),
    { type: 'bonus_narrative', plant, section: 'bonus_narrative' },
    ...plant.questions.filter((q: any) => q.bonus).map((q: any) => ({
      ...q,
      options: shuffleArray(q.options),
      section: 'bonus',
      plant
    })),
  ];
}

const BONUS_TEXT = 'The customers are full of questions today. One of them turns to you and asks something unexpected...';

function useTypewriter(text: string, speed: number = 8, charsPerTick: number = 2) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        i = Math.min(i + charsPerTick, text.length);
        setDisplayed(text.slice(0, i));
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  return displayed;
}

export default function QuestionScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();
  const continueSession = params.continueSession === 'true';
  const mode = (params.mode as string) || 'forage';
  const plantId = (params.plantId as string) || '';
  const savedCompletedIds: string[] = continueSession
    ? JSON.parse(params.completedPlantIds as string)
    : [];
  const savedScore = continueSession ? Number(params.savedScore) : 0;
  const savedBonusScore = continueSession ? Number(params.savedBonusScore) : 0;

  const ALL_QUESTIONS = useMemo(() => {
    if (mode === 'intro') {
      return introData.questions.map((q: any) => ({
        ...q,
        options: shuffleArray(q.options),
        section: 'intro'
      }));
    }

    if (mode === 'plant') {
      const plant = PLANTS.find((p: any) => p.id === plantId);
      if (!plant) return [];
      return buildPlantQuestions(plant);
    }

    const remaining = continueSession
      ? shufflePlants(PLANTS.filter((p: any) => !savedCompletedIds.includes(p.id)))
      : shufflePlants(PLANTS);

    return continueSession
      ? remaining.flatMap((plant: any) => buildPlantQuestions(plant))
      : [
          ...introData.questions.map((q: any) => ({
            ...q,
            options: shuffleArray(q.options),
            section: 'intro'
          })),
          ...remaining.flatMap((plant: any) => buildPlantQuestions(plant)),
        ];
  }, []);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(savedScore);
  const [bonusScore, setBonusScore] = useState(savedBonusScore);
  const [completedPlants, setCompletedPlants] = useState<string[]>(savedCompletedIds);
  const [missedQuestions, setMissedQuestions] = useState<{ id: string; question: string }[]>([]);
  const [lastMissed, setLastMissed] = useState<string[]>([]);

  const item = ALL_QUESTIONS[current];

  const narrativeText = useTypewriter(
  item?.type === 'plant_narrative' ? item.plant.narrative :
  item?.type === 'bonus_narrative' ? BONUS_TEXT :
  '',
  8,  // ms between ticks
  1   // characters per tick
);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    if (item?.type === 'plant_narrative') {
      getModuleProgress('foraging').then(progress => {
        const plant = progress.plants[item.plant.id];
        if (plant?.missedQuestions) {
          const lm = plant.missedQuestions
            .filter((q: any) => q.lastMissed)
            .map((q: any) => q.question);
          setLastMissed(lm);
        } else {
          setLastMissed([]);
        }
      });
    }
  }, [current]);

  function handleAnswer(option: string) {
    if (item.type === 'multi_select') {
      if (submitted) return;
      setMultiSelected(prev =>
        prev.includes(option)
          ? prev.filter(o => o !== option)
          : [...prev, option]
      );
    } else {
      if (selected) return;
      setSelected(option);
      if (option === item.correct) {
        if (item.bonus) setBonusScore(b => b + 1);
        else setScore(s => s + 1);
      } else {
        if (item.id && item.question) {
          setMissedQuestions(prev => {
            if (prev.find(q => q.id === item.id)) return prev;
            return [...prev, { id: item.id, question: item.question }];
          });
        }
      }
    }
  }

  function handleSubmitMulti() {
    if (submitted) return;
    setSubmitted(true);
    const correct = item.correct as string[];
    const allCorrectSelected = correct.every(c => multiSelected.includes(c));
    const noWrongSelected = multiSelected.every(s => correct.includes(s));
    if (allCorrectSelected && noWrongSelected) {
      if (item.bonus) setBonusScore(b => b + 1);
      else setScore(s => s + 1);
    } else {
      if (item.id && item.question) {
        setMissedQuestions(prev => {
          if (prev.find(q => q.id === item.id)) return prev;
          return [...prev, { id: item.id, question: item.question }];
        });
      }
    }
  }

  function handleNext() {
    const nextIndex = current + 1;

    if (nextIndex >= ALL_QUESTIONS.length) {
      const totalQuestions = ALL_QUESTIONS.filter(q =>
        q.type !== 'plant_narrative' && q.type !== 'bonus_narrative' && !q.bonus
      ).length;
      const totalBonus = ALL_QUESTIONS.filter(q => q.bonus).length;
      const perfect = score === totalQuestions;

      if (mode === 'plant') {
        savePlantResult('foraging', plantId, perfect);
        if (missedQuestions.length > 0) {
          saveMissedQuestions('foraging', plantId, missedQuestions);
        }
      } else if (mode === 'intro') {
        savePlantResult('foraging', 'foraging_intro', perfect);
      } else {
        clearSessionProgress('foraging');
        saveFullForageResult('foraging', perfect);
      }

      router.push({
        pathname: '/screens/results',
        params: {
          score,
          bonusScore,
          total: totalQuestions,
          totalBonus,
          mode,
          plantId,
          missedQuestions: JSON.stringify(missedQuestions)
        }
      });
      return;
    }

    const nextItem = ALL_QUESTIONS[nextIndex];

    if (item.section === 'bonus' && nextItem.type === 'plant_narrative') {
      const newCompleted = [...completedPlants, item.plant.id];
      setCompletedPlants(newCompleted);
      saveSessionProgress('foraging', newCompleted, score, bonusScore);
    }

    setCurrent(nextIndex);
    setSelected(null);
    setMultiSelected([]);
    setSubmitted(false);
  }

  if (item.type === 'plant_narrative') {
    return (
      <ImageBackground
        source={require('../../assets/images/backgrounds/background-field_01.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.narrativeContent}>
          <Text style={styles.scene}>🌿</Text>
          <Text style={styles.narrative}>{narrativeText}</Text>

          {lastMissed.length > 0 && (
            <View style={styles.lastMissedBox}>
              <Text style={styles.lastMissedTitle}>Last time you struggled with:</Text>
              {lastMissed.map((q, i) => (
                <Text key={i} style={styles.lastMissedItem}>· {q}</Text>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.next} onPress={handleNext}>
            <Text style={styles.nextText}>Continue</Text>
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
      </ImageBackground>
    );
  }

  if (item.type === 'bonus_narrative') {
    return (
      <View style={styles.container}>
        <View style={styles.narrativeContent}>
          <Text style={styles.scene}>⭐</Text>
          <Text style={styles.narrative}>{narrativeText}</Text>
          <TouchableOpacity style={styles.next} onPress={handleNext}>
            <Text style={styles.nextText}>Bonus Round</Text>
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

  const isImageQuestion = item.type === 'image_identification';
  const isCarouselQuestion = item.type === 'image_carousel';

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {item.section === 'intro'
          ? 'Introduction'
          : item.section === 'bonus'
          ? '⭐ Bonus Question'
          : 'Foraging Walk'}
      </Text>

      {isImageQuestion && (
        <Image
          source={plantImages[item.plant?.images[0]]}
          style={styles.plantImage}
          resizeMode="cover"
        />
      )}

      {isCarouselQuestion && (
        <ImageCarousel
          question={item.question}
          options={item.options}
          correct={item.correct}
          onAnswer={(label, correct) => {
            if (selected) return;
            setSelected(label);
            if (correct) {
              setScore(s => s + 1);
            } else {
              if (item.id && item.question) {
                setMissedQuestions(prev => {
                  if (prev.find(q => q.id === item.id)) return prev;
                  return [...prev, { id: item.id, question: item.question }];
                });
              }
            }
          }}
        />
      )}

      {!isCarouselQuestion && (
        <Text style={styles.question}>{item.question}</Text>
      )}

      {!isCarouselQuestion && item.type === 'multi_select' && (
        <Text style={styles.questionType}>Select all that apply</Text>
      )}
      {!isCarouselQuestion && item.type !== 'multi_select' &&
        item.type !== 'image_identification' &&
        item.type !== 'plant_narrative' &&
        item.type !== 'bonus_narrative' && (
          <Text style={styles.questionType}>Select one answer</Text>
        )}

      {!isCarouselQuestion && item.options.map((option: string) => {
        let style = styles.option;
        if (item.type === 'multi_select') {
          if (submitted) {
            const correct = item.correct as string[];
            if (correct.includes(option) && multiSelected.includes(option)) style = styles.optionCorrect;
            else if (!correct.includes(option) && multiSelected.includes(option)) style = styles.optionWrong;
            else if (correct.includes(option) && !multiSelected.includes(option)) style = styles.optionMissed;
          } else if (multiSelected.includes(option)) {
            style = styles.optionSelected;
          }
        } else {
          if (selected) {
            if (option === item.correct) style = styles.optionCorrect;
            else if (option === selected) style = styles.optionWrong;
          }
        }
        return (
          <TouchableOpacity
            key={option}
            style={style}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        );
      })}

      {!isCarouselQuestion && item.type === 'multi_select' && !submitted && multiSelected.length > 0 && (
        <TouchableOpacity style={styles.next} onPress={handleSubmitMulti}>
          <Text style={styles.nextText}>Submit</Text>
        </TouchableOpacity>
      )}

      {!isCarouselQuestion && item.type === 'multi_select' && submitted && item.remember && (
        <View style={styles.rememberBox}>
          <Text style={styles.rememberText}>💡 {item.remember}</Text>
        </View>
      )}

      {!isCarouselQuestion && item.type === 'multi_select' && submitted && (
        <TouchableOpacity style={styles.next} onPress={handleNext}>
          <Text style={styles.nextText}>
            {current + 1 < ALL_QUESTIONS.length ? 'Next' : 'See Results'}
          </Text>
        </TouchableOpacity>
      )}

      {!isCarouselQuestion && item.type !== 'multi_select' && selected && item.remember && (
        <View style={styles.rememberBox}>
          <Text style={styles.rememberText}>💡 {item.remember}</Text>
        </View>
      )}

      {!isCarouselQuestion && item.type !== 'multi_select' && selected && (
        <TouchableOpacity style={styles.next} onPress={handleNext}>
          <Text style={styles.nextText}>
            {current + 1 < ALL_QUESTIONS.length ? 'Next' : 'See Results'}
          </Text>
        </TouchableOpacity>
      )}

      {isCarouselQuestion && selected && (
        <TouchableOpacity style={styles.next} onPress={handleNext}>
          <Text style={styles.nextText}>
            {current + 1 < ALL_QUESTIONS.length ? 'Next' : 'See Results'}
          </Text>
        </TouchableOpacity>
      )}

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
    padding: 24,
    paddingTop: 60,
  },
  narrativeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scene: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 32,
  },
  narrative: {
  fontSize: 18,
  color: '#000000',
  textAlign: 'center',
  lineHeight: 20,
  marginBottom: 24,
  fontFamily: 'PressStart2P_400Regular',
},
  progress: {
    fontSize: 14,
    color: '#8a9a6e',
    marginBottom: 12,
  },
  plantImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c8a96e',
    marginBottom: 24,
    lineHeight: 28,
  },
  questionType: {
    fontSize: 13,
    color: '#4a7c59',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  option: {
    backgroundColor: '#2a2a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#3a3a2a',
  },
  optionCorrect: {
    backgroundColor: '#1a3a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4a7c59',
  },
  optionWrong: {
    backgroundColor: '#3a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#7c4a4a',
  },
  optionSelected: {
    backgroundColor: '#1a2a3a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4a6a9c',
  },
  optionMissed: {
    backgroundColor: '#2a1a3a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#9c4a7c',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
  },
  next: {
    backgroundColor: '#4a7c59',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  nextText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exitButton: {
    paddingVertical: 14,
    paddingBottom: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#2a2a1a',
  },
  exitText: {
    color: '#8a9a6e',
    fontSize: 16,
  },
  rememberBox: {
    backgroundColor: '#1a2a1a',
    borderLeftWidth: 3,
    borderLeftColor: '#c8a96e',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  rememberText: {
    color: '#c8a96e',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  lastMissedBox: {
    backgroundColor: '#2a1a1a',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#7c4a4a',
  },
  lastMissedTitle: {
    fontSize: 13,
    color: '#c87a7a',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lastMissedItem: {
    fontSize: 13,
    color: '#ffffff',
    lineHeight: 20,
    marginBottom: 2,
  },
});