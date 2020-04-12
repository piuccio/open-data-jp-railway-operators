const csv = require('csv-parse');
const fs = require('fs');

async function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath).pipe(csv({ columns: true }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    }));
  });
}

let prefecturesMapping = new Map();

exports.setupPrefecturesData = async function() {
  const data = await readCsv('./input/stations.csv');
  data.forEach((row) => {
    const operatorName = row['N02_004'];
    const railwayName = row['N02_003'];
    const prefecture = row['N03_001'];
    const key = `${operatorName}|${railwayName}`;
    if (!prefecturesMapping.has(key)) {
      prefecturesMapping.set(key, new Set());
    }
    prefecturesMapping.get(key).add(prefecture);
  });
}
exports.getRailwayPrefectures = function (operatorName, railwayName) {
  const key = `${operatorName}|${railwayName}`;
  if (!prefecturesMapping.has(key)) {
    throw new Error(`Missing prefecture mapping for ${key}`);
  }
  return [...prefecturesMapping.get(key)];
};
