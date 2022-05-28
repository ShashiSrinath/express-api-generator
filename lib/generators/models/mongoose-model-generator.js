const stringUtil = require('../../../util/stringUtil');
const { pascalCase, snakeCase } = require('change-case');
const mapMongooseType = require('../../../util/mongooseModelMapper');

const generate = (meta) => {
  const name = meta.name;
  const dataModal = meta.data;

  let dbModalFile = '';
  dbModalFile += stringUtil.writeLine(`import { Document, Model, model, Schema } from 'mongoose';`);
  dbModalFile += stringUtil.newLine();
  dbModalFile += stringUtil.writeLine(`export interface I${pascalCase(name)} {`);

  Object.entries(dataModal).forEach(([k, v]) => {
    dbModalFile += stringUtil.writeLine(`  ${k}: ${v};`);
  });

  dbModalFile += stringUtil.writeLine(`}`);
  dbModalFile += stringUtil.newLine();
  dbModalFile += `export type I${pascalCase(name)}Model = Document & I${pascalCase(name)};\n`;
  dbModalFile += stringUtil.newLine();
  dbModalFile += stringUtil.writeLine(`export const ${pascalCase(name)}Model: Model<I${pascalCase(name)}> = model(`);
  dbModalFile += stringUtil.writeLine(`  '${snakeCase(name)}',`);
  dbModalFile += stringUtil.writeLine(`  new Schema(`);
  dbModalFile += stringUtil.writeLine(`    {`);

  Object.entries(dataModal).forEach(([k, v]) => {
    dbModalFile += stringUtil.writeLine(`      ${k}: {`);
    dbModalFile += stringUtil.writeLine(`        type: ${mapMongooseType(v)},`);
    dbModalFile += stringUtil.writeLine(`      },`);
  });

  dbModalFile += stringUtil.writeLine(`    },`);
  dbModalFile += stringUtil.writeLine(`    { timestamps: true }`);
  dbModalFile += stringUtil.writeLine(`  )`);
  dbModalFile += stringUtil.writeLine(`);`);

  return dbModalFile;
};

module.exports = generate;
