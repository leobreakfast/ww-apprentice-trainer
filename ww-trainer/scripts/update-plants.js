const fs = require('fs');
const path = require('path');

const plantsDir = path.join(__dirname, '../content/foraging/plants');
const imagesDir = path.join(__dirname, '../assets/images/plants');
const indexFile = path.join(plantsDir, 'index.ts');
const imagesFile = path.join(__dirname, '../content/plantImages.ts');
const newPlantFile = path.join(__dirname, 'new-plant.json');

// ─── 0. IMPORT NEW PLANT IF EXISTS ────────────────────────────────
if (fs.existsSync(newPlantFile)) {
  const content = fs.readFileSync(newPlantFile, 'utf8').trim();
  if (content && content !== '{}') {
    const newPlant = JSON.parse(content);
    const fileName = newPlant.id.replace(/_/g, '-') + '.json';
    const destPath = path.join(plantsDir, fileName);
    fs.writeFileSync(destPath, JSON.stringify(newPlant, null, 2));
    console.log(`✓ Imported new plant: ${fileName}`);
    fs.writeFileSync(newPlantFile, '{}');
  }
}

// ─── 1. UPDATE CAROUSEL Q_01 IN EACH PLANT FILE ───────────────────
const allFiles = fs.readdirSync(plantsDir)
  .filter(f => f.endsWith('.json'))
  .sort();

allFiles.forEach(file => {
  const filePath = path.join(plantsDir, file);
  const content = fs.readFileSync(filePath, 'utf8').trim();

  if (!content) return;

  const data = JSON.parse(content);

  if (!data.carousel_distractors) {
    console.log(`⚠️  No carousel_distractors for ${file} — skipping q_01`);
    return;
  }

  const carouselLabel = data.carousel_correct_label || data.common_name;

  const carouselOptions = [
    { label: carouselLabel, image: data.images[0] },
    ...data.carousel_distractors
  ];

  data.questions[0] = {
    id: 'q_01',
    type: 'image_carousel',
    question: `Which of these plants is ${carouselLabel}?`,
    options: carouselOptions,
    correct: carouselLabel,
    bonus: false
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ Updated carousel for ${data.common_name}`);
});

// ─── 2. UPDATE INDEX.TS ───────────────────────────────────────────
const plantFiles = allFiles.filter(f => {
  const content = fs.readFileSync(path.join(plantsDir, f), 'utf8').trim();
  return content.length > 0;
});

const indexLines = plantFiles.map(file => {
  const key = file.replace('.json', '').replace(/-/g, '_');
  return `export { default as ${key} } from './${file.replace('.json', '')}';`;
});

fs.writeFileSync(indexFile, indexLines.join('\n') + '\n');
console.log(`✓ Updated index.ts with ${plantFiles.length} plants`);

// ─── 3. UPDATE PLANTIMAGES.TS ─────────────────────────────────────
const imageFiles = fs.readdirSync(imagesDir)
  .filter(f => f.match(/\.(jpg|jpeg|png)$/))
  .sort();

const imageLines = imageFiles.map(file => {
  return `  '${file}': require('../assets/images/plants/${file}'),`;
});

const imageContent = `const plantImages: { [key: string]: any } = {\n${imageLines.join('\n')}\n};\n\nexport default plantImages;\n`;

fs.writeFileSync(imagesFile, imageContent);
console.log(`✓ Updated plantImages.ts with ${imageFiles.length} images`);

// ─── 4. UPDATE PLANTS ARRAY IN FORAGING.TSX ───────────────────────
const foragingScreen = path.join(__dirname, '../app/screens/foraging.tsx');
let foragingContent = fs.readFileSync(foragingScreen, 'utf8');

const plantEntries = plantFiles
  .map(file => JSON.parse(fs.readFileSync(path.join(plantsDir, file), 'utf8')))
  .sort((a, b) => a.common_name.localeCompare(b.common_name))
  .map(data => `  { id: '${data.id}', name: '${data.common_name}', botanical: '${data.botanical_name}' },`);

const newPlantsArray = `const PLANTS = [\n${plantEntries.join('\n')}\n];`;

foragingContent = foragingContent.replace(
  /const PLANTS = \[[\s\S]*?\];/,
  newPlantsArray
);

fs.writeFileSync(foragingScreen, foragingContent);
console.log(`✓ Updated PLANTS array in foraging.tsx with ${plantFiles.length} plants`);

console.log('\nDone! All files updated.');