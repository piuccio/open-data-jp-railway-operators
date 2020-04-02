const fs = require('fs');
const util = require('util');
const {getCompanyDetails} = require('./wikipedia.js');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function start() {
  const table = await readFile('./input/operators-table.json');
  const list = JSON.parse(table);

  const operatorsList = {};
  for (const data of list) {
    const operatorName = data['N02_004'];
    const railwayName = data['N02_003'];
    let operator = operatorsList[operatorName];
    if (!operator) {
      const details = await getCompanyDetails(operatorName);
      operator = {
        name: {
          ja: operatorName,
          en: details.englishName,
        },
        railways: [],
      };
    }
    if (!operator.railways.find((_) => _.ja === railwayName)) {
      operator.railways.push({ja: railwayName});
    }

    operatorsList[operatorName] = operator;
  }

  await writeFile('operators.json', JSON.stringify(Object.values(operatorsList), null, 2));
}

if (module === require.main) {
  start()
    .then(() => console.log('DONE'))
    .catch(console.error);
}
