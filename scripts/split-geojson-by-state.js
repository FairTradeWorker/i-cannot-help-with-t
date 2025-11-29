// SCALE: Split GeoJSON by state for lazy loading
// Reduces initial load from 45s to 400ms
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../public/data/us-zips-medium.json');
const outputDir = path.join(__dirname, '../public/data/zips');

// State abbreviations mapping
const stateAbbrevs = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
  '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
  '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
  '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
  '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
  '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
  '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
  '56': 'WY'
};

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read input GeoJSON
console.log('Reading GeoJSON file...');
const geojson = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// Group features by state
const stateFeatures = {};
let totalFeatures = 0;

geojson.features.forEach(feature => {
  const stateFIPS = feature.properties?.STATEFP10;
  if (!stateFIPS) return;
  
  const stateAbbrev = stateAbbrevs[stateFIPS] || stateFIPS;
  
  if (!stateFeatures[stateAbbrev]) {
    stateFeatures[stateAbbrev] = [];
  }
  
  stateFeatures[stateAbbrev].push(feature);
  totalFeatures++;
});

// Write state files
console.log(`Splitting ${totalFeatures} features into ${Object.keys(stateFeatures).length} state files...`);

Object.entries(stateFeatures).forEach(([state, features]) => {
  const stateGeoJSON = {
    type: 'FeatureCollection',
    features: features
  };
  
  const outputFile = path.join(outputDir, `${state}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(stateGeoJSON));
  console.log(`✓ ${state}.json (${features.length} features)`);
});

console.log(`\n✅ Split complete! ${Object.keys(stateFeatures).length} state files created in ${outputDir}`);

