import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import introData from '../../content/foraging/intro.json';
import oxalisData from '../../content/foraging/plants/oxalis-acetosella.json';

const ALL_QUESTIONS = [
  ...introData.questions.map(q => ({ ...q, section: 'intro' })),
  { type: 'plant_narrative', plant: oxalisData, section: 'narrative' },
  ...oxalisData.questions.map(q => ({ ...q, section: 'plant', plant: oxalisData })),
];

export default function QuestionScreen() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [bonusScore, setBonusScore] = useState(0);

  const item = ALL_QUESTIONS[current];

  function handleAnswer(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === item.correct) {
      if (item.bonus) setBonusScore(b => b + 1);
      else setScore(s => s + 1);
    }
  }

  function handleNext() {
    if (current + 1 < ALL_QUESTIONS.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      const totalQuestions = ALL_QUESTIONS.filter(q => q.type !== 'plant_narrative' && !q.bonus).length;
      const totalBonus = ALL_QUESTIONS.filter(q => q.bonus).length;
      router.push({
        pathname: '/screens/results',
        params: { score, bonusScore, total: totalQuestions, totalBonus }
      });
    }
  }

  if (item.type === 'plant_narrative') {
    return (
      <View style={styles.container}>
        <Text style={styles.scene}>🌿</Text>
        <Text style={styles.narrative}>{item.plant.narrative}</Text>
        <TouchableOpacity style={styles.next} onPress={handleNext}>
          <Text style={styles.nextText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isImageQuestion = item.type === 'image_identification';

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {item.section === 'intro' ? 'Introduction' : item.plant?.common_name}
      </Text>

      {isImageQuestion && (
        <Image
          source={require('../../assets/images/plants/oxalis-acetosella_01.jpg')}
          style={styles.plantImage}
          resizeMode="cover"
        />
      )}

      <Text style={styles.question}>{item.question}</Text>

      {item.options.map((option) => {
        let style = styles.option;
        if (selected) {
          if (option === item.correct) style = styles.optionCorrect;
          else if (option === selected) style = styles.optionWrong;
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

      {selected && (
        <TouchableOpacity style={styles.next} onPress={handleNext}>
          <Text style={styles.nextText}>
            {current + 1 < ALL_QUESTIONS.length ? 'Next' : 'See Results'}
          </Text>
        </TouchableOpacity>
      )}
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
  scene: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 32,
  },
  narrative: {
    fontSize: 18,
    color: '#c8a96e',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 48,
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
});