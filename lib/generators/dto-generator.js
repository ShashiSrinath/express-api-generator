const stringUtil = require('../../util/stringUtil');
const { pascalCase, snakeCase } = require('change-case');
const mapJoiType = require('../../util/joiTypeMapper');

const generateCreateItemReqDto = (meta) => {
  const name = meta.name;
  const dataModal = meta.data;

  let dtoFile = '';
  dtoFile += stringUtil.writeLine(`import Joi, { ValidationError } from 'joi';`);
  dtoFile += stringUtil.newLine();
  dtoFile += stringUtil.writeLine(`export interface Create${pascalCase(name)}ReqDto {`);

  Object.entries(dataModal).forEach(([k, v]) => {
    dtoFile += stringUtil.writeLine(`  ${k}: ${v};`);
  });

  dtoFile += stringUtil.writeLine(`}`);
  dtoFile += stringUtil.newLine();
  dtoFile += stringUtil.writeLine(`const schema = Joi.object({`);

  Object.entries(dataModal).forEach(([k, v]) => {
    dtoFile += stringUtil.writeLine(`  ${k}: Joi.${mapJoiType(v)},`);
  });

  dtoFile += stringUtil.writeLine(`}).required();`);
  dtoFile += stringUtil.newLine();
  dtoFile += stringUtil.writeLine(`export const validate = (`);
  dtoFile += stringUtil.writeLine(`  data: unknown`);
  dtoFile += stringUtil.writeLine(`): {`);
  dtoFile += stringUtil.writeLine(`  error?: ValidationError;`);
  dtoFile += stringUtil.writeLine(`  value: Create${pascalCase(name)}ReqDto;`);
  dtoFile += stringUtil.writeLine(`} => {`);
  dtoFile += stringUtil.writeLine(`  return schema.validate(data, {`);
  dtoFile += stringUtil.writeLine(`    abortEarly: false,`);
  dtoFile += stringUtil.writeLine(`    stripUnknown: true,`);
  dtoFile += stringUtil.writeLine(`  });`);
  dtoFile += stringUtil.writeLine(`};`);
  dtoFile += stringUtil.newLine();
  dtoFile += stringUtil.writeLine(`export default {`);
  dtoFile += stringUtil.writeLine(`  validate,`);
  dtoFile += stringUtil.writeLine(`};`);

  return dtoFile;
};
const generateCreateItemResDto = (meta) => {
  const name = meta.name;

  let dtoFile = '';
  dtoFile += stringUtil.writeLine(`import { I${pascalCase(name)}Model } from '../${name}.model';`);
  dtoFile += stringUtil.newLine();
  dtoFile += stringUtil.writeLine(`export type Create${pascalCase(name)}ResDto = I${pascalCase(name)}Model;`);

  return dtoFile;
};
const generateGetOneItemReqDto = (meta) => {
  const name = meta.name;

  return `import Joi, { ValidationError } from 'joi';

export interface GetOne${pascalCase(name)}ReqDto {
    id: string;
}

const schema = Joi.object({
    id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .message('Not a valid ID')
        .required(),
}).required();

export const validate = (
    data: unknown
): {
    error?: ValidationError;
    value: GetOne${pascalCase(name)}ReqDto;
} => {
    return schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });
};

export default {
    validate,
};
`;
};
const generateGetOneItemResDto = (meta) => {
  const name = meta.name;
  return `import { I${pascalCase(name)}Model } from '../${name}.model';

export type GetOne${pascalCase(name)}ResDto = I${pascalCase(name)}Model;
`;
};
const generateGetItemListReqDto = (meta) => {
  const name = meta.name;
  const dataModal = meta.data;

  let dtoFile = `import Joi, { ValidationError } from 'joi';
import { I${pascalCase(name)} } from '../${name}.model';

export interface Get${pascalCase(name)}ListReqDto {
    pagination: {
        page: number;
        perPage: number;
    };
    sort: {
        [field in keyof I${pascalCase(name)}]: ['asc', 'desc'];
    };
    filter: {
        [field in keyof I${pascalCase(name)}]: I${pascalCase(name)}[field];
    };
}

const schema = Joi.object({
    pagination: Joi.object({
        page: Joi.number().min(1).default(1),
        perPage: Joi.number().min(1).max(Number.MAX_SAFE_INTEGER).default(10),
    }).default({ page: 1, perPage: 10 }),
    sort: Joi.object().pattern(
`;
  dtoFile += `        Joi.string().valid('_id'`;

  Object.keys(dataModal).forEach((key) => (dtoFile += `, '${key}'`));
  dtoFile += `),
`;

  dtoFile += `        Joi.string().valid('asc', 'desc', 'ASC', 'DESC')
    ),
    filter: {
        name: Joi.any(),
        index: Joi.any(),
        pendingBalance: Joi.any(),
    },
}).required();

export const validate = (
    data: any
): {
    error?: ValidationError;
    value: Get${pascalCase(name)}ListReqDto;
} => {
    // transform data
    let transformedData;
    try {
        transformedData = {
            pagination: data.pagination
                ? JSON.parse(data.pagination)
                : undefined,
            sort: data.sort ? JSON.parse(data.sort) : undefined,
            filter: data.filter ? JSON.parse(data.filter) : undefined,
        };
    } catch (e) {
        return {
            error: new ValidationError(\`Invalid query\`, 'req.query', 'data'),
            value: null,
        };
    }

    return schema.validate(transformedData, {
        abortEarly: false,
        stripUnknown: true,
    });
};

export default {
    validate,
};
`;

  return dtoFile;
};
const generateGetItemListResDto = (meta) => {
  const name = meta.name;
  return `import { I${pascalCase(name)}Model } from '../${name}.model';

export type Get${pascalCase(name)}ListResDto = { total: number; data: I${pascalCase(name)}Model[] };
`;
};
const generateUpdateItemReqDto = (meta) => {
  const name = meta.name;
  const dataModal = meta.data;

  let dtoFile = `import Joi, { ValidationError } from 'joi';

export interface Update${pascalCase(name)}ReqDto {\n`;

  Object.entries(dataModal).forEach(([k, v]) => {
    dtoFile += `  ${k}: ${v};\n`;
  });

  dtoFile += `}

const schema = Joi.object({
    id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .message('Not a valid ID')
        .required(),\n`;

  Object.entries(dataModal).forEach(([k, v]) => {
    dtoFile += `  ${k}: Joi.${mapJoiType(v)},\n`;
  });

  dtoFile += `}).required();

export const validate = (
    data: unknown
): {
    error?: ValidationError;
    value: UpdateTableReqDto;
} => {
    return schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });
};

export default {
    validate,
};
`;

  return dtoFile;
};
const generateUpdateItemResDto = (meta) => {
  const name = meta.name;

  return `import { I${pascalCase(name)}Model } from '../${name}.model';

export type Update${pascalCase(name)}ResDto = I${pascalCase(name)}Model;
`;
};
const generateDeleteOneItemReqDto = (meta) => {
  const name = meta.name;

  return `import Joi, { ValidationError } from 'joi';

export interface DeleteOne${pascalCase(name)}ReqDto {
    id: string;
}

const schema = Joi.object({
    id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .message('Not a valid ID')
        .required(),
}).required();

export const validate = (
    data: unknown
): {
    error?: ValidationError;
    value: DeleteOne${pascalCase(name)}ReqDto;
} => {
    return schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });
};

export default {
    validate,
};
`;
};
const generateDeleteOneItemResDto = (meta) => {
  const name = meta.name;

  return `import { I${pascalCase(name)}Model } from '../${name}.model';

export type DeleteOne${pascalCase(name)}ResDto = I${pascalCase(name)}Model;
`;
};

const generate = async (meta) => {
  // generate file list
  const dtoFileList = [
    {
      filename: `create-${meta.name}-req.dto.ts`,
      content: generateCreateItemReqDto(meta),
    },
    {
      filename: `create-${meta.name}-res.dto.ts`,
      content: generateCreateItemResDto(meta),
    },
    {
      filename: `get-one-${meta.name}-req.dto.ts`,
      content: generateGetOneItemReqDto(meta),
    },
    {
      filename: `get-one-${meta.name}-res.dto.ts`,
      content: generateGetOneItemResDto(meta),
    },
    {
      filename: `get-${meta.name}-list-req.dto.ts`,
      content: generateGetItemListReqDto(meta),
    },
    {
      filename: `get-${meta.name}-list-res.dto.ts`,
      content: generateGetItemListResDto(meta),
    },
    {
      filename: `update-${meta.name}-req.dto.ts`,
      content: generateUpdateItemReqDto(meta),
    },
    {
      filename: `update-${meta.name}-res.dto.ts`,
      content: generateUpdateItemResDto(meta),
    },
    {
      filename: `delete-one-${meta.name}-req.dto.ts`,
      content: generateDeleteOneItemReqDto(meta),
    },
    {
      filename: `delete-one-${meta.name}-res.dto.ts`,
      content: generateDeleteOneItemResDto(meta),
    },
  ];

  return dtoFileList;
};

module.exports = generate;
