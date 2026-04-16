import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import introData from '../../content/foraging/intro.json';

export default function QuestionScreen() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const questions = introData.questions;
  const question = questions[current];

  function handleAnswer(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === question.correct) {
      setScore(score + 1);
    }
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      router.push({
        pathname: '/screens/results',
        params: { score, total: questions.length }
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>Question {current + 1} of {questions.length}</Text>
      <Text style={styles.question}>{question.question}</Text>

      {question.options.map((option) => {
        let style = styles.option;
        if (selected) {
          if (option === question.correct) style = styles.optionCorrect;
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
            {current + 1 < questions.length ? 'Next Question' : 'See Results'}
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
  progress: {
    fontSize: 14,
    color: '#8a9a6e',
    marginBottom: 16,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c8a96e',
    marginBottom: 32,
    lineHeight: 30,
  },
  option: {
    backgroundColor: '#2a2a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3a2a',
  },
  optionCorrect: {
    backgroundColor: '#1a3a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4a7c59',
  },
  optionWrong: {
    backgroundColor: '#3a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
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