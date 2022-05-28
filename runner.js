const fs = require('fs/promises');
const mongooseModelGenerator = require('./lib/generators/models/mongoose-model-generator');
const dtoGenerator = require('./lib/generators/dto-generator');
const serviceGenerator = require('./lib/generators/service-generator');
const routerGenerator = require('./lib/generators/router-generator');

const singleRunner = async (meta) => {
  // generate files
  const dbModalFile = mongooseModelGenerator(meta);
  const dtoFileList = await dtoGenerator(meta);
  const serviceFile = serviceGenerator(meta);
  const routerFile = routerGenerator(meta);

  // writing files
  const rootDir = meta.name;
  await fs.mkdir(rootDir);

  fs.writeFile(`${rootDir}/${meta.name}.model.ts`, dbModalFile).then();
  fs.writeFile(`${rootDir}/${meta.name}.service.ts`, serviceFile).then();
  fs.writeFile(`${rootDir}/${meta.name}.router.ts`, routerFile).then();

  //writing dto files
  await fs.mkdir(`${rootDir}/dto`);
  for (const file of dtoFileList) {
    await fs.writeFile(`${rootDir}/dto/${file.filename}`, file.content);
  }
};

const runFromFile = async (metaFile) => {
  const metaJsonString = await fs.readFile(metaFile, { encoding: 'utf-8' });
  const metaData = JSON.parse(metaJsonString);

  if (!Array.isArray(metaData)) {
    throw new Error('Invalid file format');
  }

  console.log('running generator for meta file: ' + metaJsonString);
  for (const meta of metaData) {
    console.log('generating ', meta);
    await singleRunner(meta);
  }
};

module.exports = { runFromFile, singleRunner };
