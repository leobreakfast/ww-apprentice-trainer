import { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import plantImages from '../content/plantImages';

const { width } = Dimensions.get('window');

interface CarouselOption {
  label: string;
  image: string;
}

interface Props {
  question: string;
  options: CarouselOption[];
  correct: string;
  onAnswer: (label: string, correct: boolean) => void;
}

export default function ImageCarousel({ question, options, correct, onAnswer }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const current = options[currentIndex];

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / (width - 48));
    setCurrentIndex(index);
  }

  function handleSelect() {
    if (selected) return;
    const isCorrect = current.label === correct;
    setSelected(current.label);
    onAnswer(current.label, isCorrect);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.counter}>{currentIndex + 1} of {options.length}</Text>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEnabled={!selected}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option, index) => {
          const imageSource = plantImages[option.image];
          const isThis = selected === option.label;
          const isCorrectOption = option.label === correct;

          return (
            <View key={index} style={styles.slide}>
              {imageSource ? (
                <Image
                  source={imageSource}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>{option.label}</Text>
                  <Text style={styles.placeholderSub}>No image yet</Text>
                </View>
              )}

              {selected && isCorrectOption && (
                <View style={styles.overlayCorrect}>
                  <Text style={styles.overlayText}>✓ {option.label}</Text>
                </View>
              )}
              {selected && isThis && !isCorrectOption && (
                <View style={styles.overlayWrong}>
                  <Text style={styles.overlayText}>✗ {option.label}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.dots}>
        {options.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentIndex && styles.dotActive]}
          />
        ))}
      </View>

      

      {!selected && (
        <TouchableOpacity style={styles.selectButton} onPress={handleSelect}>
          <Text style={styles.selectText}>This one</Text>
        </TouchableOpacity>
      )}

      {selected && (
        <View style={styles.resultRow}>
          <Text style={styles.resultText}>
            {selected === correct
              ? `✓ Correct — that is ${correct}`
              : `✗ That was ${selected} — swipe to find the correct answer: ${correct}`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c8a96e',
    marginBottom: 8,
    lineHeight: 28,
  },
  counter: {
    fontSize: 13,
    color: '#8a9a6e',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  scrollView: {
    marginHorizontal: -24,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  slide: {
    width: width,
    height: 280,
    paddingHorizontal: 24,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a1a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3a3a2a',
  },
  placeholderText: {
    fontSize: 18,
    color: '#c8a96e',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeholderSub: {
    fontSize: 14,
    color: '#8a9a6e',
  },
  overlayCorrect: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(74, 124, 89, 0.9)',
  },
  overlayWrong: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(124, 74, 74, 0.9)',
  },
  overlayText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  swipeHint: {
    fontSize: 12,
    color: '#8a9a6e',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3a3a2a',
    marginHorizontal: 4,
  },
  
  dotActive: {
    backgroundColor: '#c8a96e',
  },
  selectButton: {
    backgroundColor: '#4a7c59',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  selectText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultRow: {
    backgroundColor: '#2a2a1a',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  resultText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
  },
});