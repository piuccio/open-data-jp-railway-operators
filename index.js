const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function start() {
  const table = await readFile('./input/operators-table.json');
  const list = JSON.parse(table);


  const operatorsList = {};
  list.forEach((data) => {
    const operatorName = data['N02_004'];
    const railwayName = data['N02_003'];
    const operator = operatorsList[operatorName] || {railways: []};
    operator.name = {ja: operatorName};
    if (!operator.railways.find((_) => _.ja === railwayName)) {
      operator.railways.push({ja: railwayName});
    }

    operatorsList[operatorName] = operator;
  });

  await writeFile('operators.json', JSON.stringify(Object.values(operatorsList), null, 2));
}

if (module === require.main) {
  start()
    .then(() => console.log('DONE'))
    .catch(console.error);
}
