const { pascalCase, camelCase } = require('change-case');

const generate = (meta) => {
  const name = meta.name;

  let dtoFile = `import { Create${pascalCase(name)}ReqDto } from './dto/create-${name}-req.dto';
import { I${pascalCase(name)}, ${pascalCase(name)}Model } from './${name}.model';
import configLogger from '../../utils/logger';
import { HttpError } from '../../lib/http-error';
import { Create${pascalCase(name)}ResDto } from './dto/create-${name}-res.dto';
import { GetOne${pascalCase(name)}ReqDto } from './dto/get-one-${name}-req.dto';
import { Get${pascalCase(name)}ListReqDto } from './dto/get-${name}-list-req.dto';
import { Update${pascalCase(name)}ReqDto } from './dto/update-${name}-req.dto';
import { GetOne${pascalCase(name)}ResDto } from './dto/get-one-${name}-res.dto';
import { Get${pascalCase(name)}ListResDto } from './dto/get-${name}-list-res.dto';
import { Update${pascalCase(name)}ResDto } from './dto/update-${name}-res.dto';
import { DeleteOne${pascalCase(name)}ReqDto } from './dto/delete-one-${name}-req.dto';
import { DeleteOne${pascalCase(name)}ResDto } from './dto/delete-one-${name}-res.dto';

const logger = configLogger('${name}.service');

`;
  dtoFile += `const create${pascalCase(name)} = async (
  data: Create${pascalCase(name)}ReqDto
): Promise<Create${pascalCase(name)}ResDto> => {
  logger.info(\`Creating new ${name} with the payload: \${JSON.stringify(data)}\`);

  const created${pascalCase(name)} = await ${pascalCase(name)}Model.create(data);
  logger.info(\`${pascalCase(name)} created: \${JSON.stringify(created${pascalCase(name)})}\`);

  return created${pascalCase(name)};
};

`;

  dtoFile += `const getOne${pascalCase(name)} = async ({
  id,
}: GetOne${pascalCase(name)}ReqDto): Promise<GetOne${pascalCase(name)}ResDto> => {
  logger.info(\`Finding ${name} by id: \${id}\`);
  const ${camelCase(name)} = await ${pascalCase(name)}Model.findById(id);

  if (!${camelCase(name)}) {
    logger.warn(\`${pascalCase(name)} not found by id: \${id}\`);
    throw new HttpError(404, \`${pascalCase(name)} not found by id: \${id}\`, 'NotFound');
  }

  logger.info(\`Found ${name}: \${JSON.stringify(${camelCase(name)})}\`);
  return ${camelCase(name)};
};

const get${pascalCase(name)}List = async (
  query: Get${pascalCase(name)}ListReqDto
): Promise<Get${pascalCase(name)}ListResDto> => {
  logger.info(\`Fetching ${name} list by query: \${JSON.stringify(query)}\`);
  const total${pascalCase(name)}s = await ${pascalCase(name)}Model.count(query.filter);
  const ${camelCase(name)}s = await ${pascalCase(name)}Model.find(query.filter)
    .sort(query.sort)
    .skip(query.pagination.perPage * (query.pagination.page - 1))
    .limit(query.pagination.perPage);
  logger.info(\`\${${camelCase(name)}s.length} records found\`);
  return { total: total${pascalCase(name)}s, data: ${camelCase(name)}s };
};

const update${pascalCase(name)} = async (
  payload: Update${pascalCase(name)}ReqDto
): Promise<Update${pascalCase(name)}ResDto> => {
  const { id, ...updateData } = payload;
  logger.info(\`Updating ${name}: \${id} with data: \${JSON.stringify(updateData)}\`);

  // updating the ${name}
  const ${camelCase(name)} = await ${pascalCase(name)}Model.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  logger.info(\`${pascalCase(name)} updated: \${JSON.stringify(${camelCase(name)})}\`);

  return ${camelCase(name)};
};

const deleteOne${pascalCase(name)} = async ({
  id,
}: DeleteOne${pascalCase(name)}ReqDto): Promise<DeleteOne${pascalCase(name)}ResDto> => {
  logger.info(\`Deleting ${name} by id: \${id}\`);
  const ${camelCase(name)} = await ${pascalCase(name)}Model.findByIdAndRemove(id);

  if (!${camelCase(name)}) {
    logger.warn(\`${pascalCase(name)} not found by id: \${id}\`);
    throw new HttpError(404, \`${pascalCase(name)} not found by id: \${id}\`, 'NotFound');
  }

  logger.info(\`${pascalCase(name)} Deleted: \${JSON.stringify(${camelCase(name)})}\`);
  return ${camelCase(name)};
};

export default {
  create${pascalCase(name)},
  getOne${pascalCase(name)},
  get${pascalCase(name)}List,
  update${pascalCase(name)},
  deleteOne${pascalCase(name)},
};

`;

  return dtoFile;
};

module.exports = generate;
