console.log('Script starting...');
const fs = require('fs');
const path = require('path');

const plantsDir = path.join(__dirname, '../content/foraging/plants');

// Define the carousel options for each plant
const carouselOptions = {
  'oxalis-acetosella': {
    question: 'Which of these plants is Wood Sorrel?',
    correct: 'Wood Sorrel',
    options: [
      { label: 'Wood Sorrel', image: 'oxalis-acetosella_01.jpg' },
      { label: 'White Clover', image: 'trifolium-repens_01.jpg' },
      { label: 'Ground Ivy', image: 'glechoma-hederacea_01.jpg' },
      { label: 'Chickweed', image: 'stellaria-media_01.jpg' },
    ]
  },
  'galium-aparine': {
    question: 'Which of these plants is Cleavers?',
    correct: 'Cleavers',
    options: [
      { label: 'Cleavers', image: 'galium-aparine_01.jpg' },
      { label: 'Ground Ivy', image: 'glechoma-hederacea_01.jpg' },
      { label: 'Chickweed', image: 'stellaria-media_01.jpg' },
      { label: 'Wood Sorrel', image: 'oxalis-acetosella_01.jpg' },
    ]
  },
  'glechoma-hederacea': {
    question: 'Which of these plants is Ground Ivy?',
    correct: 'Ground Ivy',
    options: [
      { label: 'Ground Ivy', image: 'glechoma-hederacea_01.jpg' },
      { label: 'Cleavers', image: 'galium-aparine_01.jpg' },
      { label: 'Wood Sorrel', image: 'oxalis-acetosella_01.jpg' },
      { label: 'Stinging Nettle', image: 'urtica-dioica_01.jpg' },
    ]
  },
  'stellaria-media': {
    question: 'Which of these plants is Chickweed?',
    correct: 'Chickweed',
    options: [
      { label: 'Chickweed', image: 'stellaria-media_01.jpg' },
      { label: 'Wood Sorrel', image: 'oxalis-acetosella_01.jpg' },
      { label: 'Ground Ivy', image: 'glechoma-hederacea_01.jpg' },
      { label: 'Cleavers', image: 'galium-aparine_01.jpg' },
    ]
  },
  'urtica-dioica': {
    question: 'Which of these plants is Stinging Nettle?',
    correct: 'Stinging Nettle',
    options: [
      { label: 'Stinging Nettle', image: 'urtica-dioica_01.jpg' },
      { label: 'Cleavers', image: 'galium-aparine_01.jpg' },
      { label: 'Chickweed', image: 'stellaria-media_01.jpg' },
      { label: 'Ground Ivy', image: 'glechoma-hederacea_01.jpg' },
    ]
  },
};

// Loop through each plant file
const files = fs.readdirSync(plantsDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const plantKey = file.replace('.json', '');
  const carousel = carouselOptions[plantKey];

  if (!carousel) {
    console.log(`⚠️  No carousel config for ${plantKey} — skipping`);
    return;
  }

  const filePath = path.join(plantsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Replace q_01 with image_carousel type
  data.questions[0] = {
    id: 'q_01',
    type: 'image_carousel',
    question: carousel.question,
    options: carousel.options,
    correct: carousel.correct,
    bonus: false
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ Updated ${plantKey}`);
});

console.log('Done!');