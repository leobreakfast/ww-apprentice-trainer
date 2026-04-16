import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import introData from '../../content/foraging/intro.json';
import oxalisData from '../../content/foraging/plants/oxalis-acetosella.json';

function shuffleArray(array: string[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

const ALL_QUESTIONS: any[] = [
  ...introData.questions.map(q => ({ ...q, options: shuffleArray(q.options), section: 'intro' })),
  { type: 'plant_narrative', plant: oxalisData, section: 'narrative' },
  ...oxalisData.questions.filter(q => !q.bonus).map(q => ({ ...q, options: shuffleArray(q.options), section: 'plant', plant: oxalisData })),
  { type: 'bonus_narrative', plant: oxalisData, section: 'bonus_narrative' },
  ...oxalisData.questions.filter(q => q.bonus).map(q => ({ ...q, options: shuffleArray(q.options), section: 'bonus', plant: oxalisData })),
];

export default function QuestionScreen() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [bonusScore, setBonusScore] = useState(0);

  const item = ALL_QUESTIONS[current];

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
    }
  }

  function handleNext() {
    if (current + 1 < ALL_QUESTIONS.length) {
      setCurrent(current + 1);
      setSelected(null);
      setMultiSelected([]);
      setSubmitted(false);
    } else {
      const totalQuestions = ALL_QUESTIONS.filter(q => q.type !== 'plant_narrative' && q.type !== 'bonus_narrative' && !q.bonus).length;
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

  if (item.type === 'bonus_narrative') {
    return (
      <View style={styles.container}>
        <Text style={styles.scene}>⭐</Text>
        <Text style={styles.narrative}>
          The customers are full of questions today. One of them turns to you and asks something unexpected...
        </Text>
        <TouchableOpacity style={styles.next} onPress={handleNext}>
          <Text style={styles.nextText}>Bonus Round</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isImageQuestion = item.type === 'image_identification';

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {item.section === 'intro' ? 'Introduction' : item.section === 'bonus' ? `⭐ ${item.plant?.common_name}` : item.plant?.common_name}
      </Text>

      {isImageQuestion && (
        <Image
          source={require('../../assets/images/plants/oxalis-acetosella_01.jpg')}
          style={styles.plantImage}
          resizeMode="cover"
        />
      )}

      <Text style={styles.question}>{item.question}</Text>
{item.type === 'multi_select' && (
  <Text style={styles.questionType}>Select all that apply</Text>
)}
{item.type !== 'multi_select' && item.type !== 'image_identification' && item.type !== 'plant_narrative' && item.type !== 'bonus_narrative' && (
  <Text style={styles.questionType}>Select one answer</Text>
)}

      {item.options.map((option: string) => {
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

  {item.type === 'multi_select' && !submitted && multiSelected.length > 0 && (
    <TouchableOpacity style={styles.next} onPress={handleSubmitMulti}>
      <Text style={styles.nextText}>Submit</Text>
    </TouchableOpacity>
  )}

  {item.type === 'multi_select' && submitted && (
    <TouchableOpacity style={styles.next} onPress={handleNext}>
      <Text style={styles.nextText}>
        {current + 1 < ALL_QUESTIONS.length ? 'Next' : 'See Results'}
      </Text>
    </TouchableOpacity>
  )}

  {item.type !== 'multi_select' && selected && (
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
  questionType: {
  fontSize: 13,
  color: '#4a7c59',
  marginBottom: 20,
  fontStyle: 'italic',
},
});