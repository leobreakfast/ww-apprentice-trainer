const fs = require('fs');
const path = require('path');

const plantsDir = path.join(__dirname, '../content/foraging/plants');

// Define distractors for each plant
const distractors = {
  'oxalis-acetosella': [
    { label: 'White Clover', image: 'trifolium-repens_01.jpg' },
    { label: 'Ground Ivy', image: 'glechoma-hederacea_01.jpg' },
    { label: 'Chickweed', image: 'stellaria-media_01.jpg' }
  ],
  'galium-aparine': [
    { label: 'Ground Ivy', image: 'glechoma-hederacea_01.jpg' },
    { label: 'Chickweed', image: 'stellaria-media_01.jpg' },
    { label: 'Wood Sorrel', image: 'oxalis-acetosella_01.jpg' }
  ],
  'glechoma-hederacea': [
    { label: 'Cleavers', image: 'galium-aparine_01.jpg' },
    { label: 'Wood Sorrel', image: 'oxalis-acetosella_01.jpg' },
    { label: 'Stinging Nettle', image: 'urtica-dioica_01.jpg' }
  ],
  'stellaria-media': [
    { label: 'Wood Sorrel', image: 'oxalis-acetosella_01.jpg' },
    { label: 'Ground Ivy', image: 'glechoma-hederacea_01.jpg' },
    { label: 'Cleavers', image: 'galium-aparine_01.jpg' }
  ],
  'urtica-dioica': [
    { label: 'Cleavers', image: 'galium-aparine_01.jpg' },
    { label: 'Chickweed', image: 'stellaria-media_01.jpg' },
    { label: 'Ground Ivy', image: 'glechoma-hederacea_01.jpg' }
  ],
  'plantago-major': [
    { label: 'Dock', image: 'rumex-obtusifolius_01.jpg' },
    { label: 'Ribwort Plantain', image: 'plantago-lanceolata_01.jpg' },
    { label: 'Burdock', image: 'arctium-lappa_01.jpg' }
  ],
};

const files = fs.readdirSync(plantsDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const plantKey = file.replace('.json', '');
  const filePath = path.join(plantsDir, file);
  const content = fs.readFileSync(filePath, 'utf8').trim();

  if (!content) {
    console.log(`⚠️  Skipping empty file: ${plantKey}`);
    return;
  }

  const plantDistractors = distractors[plantKey];
  if (!plantDistractors) {
    console.log(`⚠️  No distractors defined for ${plantKey} — skipping`);
    return;
  }

  const data = JSON.parse(content);

  // Only add if not already there
  if (!data.carousel_distractors) {
    data.carousel_distractors = plantDistractors;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✓ Added distractors to ${plantKey}`);
  } else {
    console.log(`⚠️  ${plantKey} already has distractors — skipping`);
  }
});

console.log('Done!');