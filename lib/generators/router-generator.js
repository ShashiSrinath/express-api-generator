const { pascalCase, camelCase } = require('change-case');

const generate = (meta) => {
  const name = meta.name;

  return `import { Router } from 'express';
import { HttpValidationError } from '../../lib/http-validation-error';
import create${pascalCase(name)}ReqDto from './dto/create-${name}-req.dto';
import ${camelCase(name)}Service from './${camelCase(name)}.service';
import getOne${pascalCase(name)}ReqDto from './dto/get-one-${name}-req.dto';
import get${pascalCase(name)}ListReqDto from './dto/get-${name}-list-req.dto';
import update${pascalCase(name)}ReqDto from './dto/update-${name}-req.dto';
import deleteOne${pascalCase(name)}ReqDto from './dto/delete-one-${name}-req.dto';

const router = Router();

/** Create a new ${pascalCase(name)} **/
router.post('/', async (req, res, next) => {
    const { error, value } = create${pascalCase(name)}ReqDto.validate(req.body);

    if (error) {
        return next(new HttpValidationError(error));
    }

    const ${camelCase(name)} = await ${camelCase(name)}Service.create${pascalCase(name)}(value);
    try {
        return res
            .status(200)
            .json(${camelCase(name)});
    } catch (e) {
        next(e);
    }
});

/** Find a ${pascalCase(name)} by ID **/
router.get('/:id', async (req, res, next) => {
    const { error, value } = getOne${pascalCase(name)}ReqDto.validate({
        id: req.params.id,
    });

    if (error) {
        return next(new HttpValidationError(error));
    }
    try {
        const ${camelCase(name)} = await ${camelCase(name)}Service.getOne${pascalCase(name)}(value);
        return res
            .status(200)
            .json(${camelCase(name)});
    } catch (e) {
        next(e);
    }
});

/** Find ${pascalCase(name)}s by query **/
router.get('/', async (req, res, next) => {
    const { error, value } = get${pascalCase(name)}ListReqDto.validate(req.query);

    if (error) {
        return next(new HttpValidationError(error));
    }
    try {
        const output = await ${camelCase(name)}Service.get${pascalCase(name)}List(value);
        return res.status(200).json(output);
    } catch (e) {
        next(e);
    }
});

/** Update ${pascalCase(name)}s by id **/
router.patch('/:id', async (req, res, next) => {
    const { error, value } = update${pascalCase(name)}ReqDto.validate({
        id: req.params.id,
        ...req.body,
    });

    if (error) {
        return next(new HttpValidationError(error));
    }
    try {
        const ${camelCase(name)} = await ${camelCase(name)}Service.update${pascalCase(name)}(value);
        return res
            .status(200)
            .json(${camelCase(name)});
    } catch (e) {
        next(e);
    }
});

/** Delete a ${pascalCase(name)} by ID **/
router.delete('/:id', async (req, res, next) => {
    const { error, value } = deleteOne${pascalCase(name)}ReqDto.validate({
        id: req.params.id,
    });

    if (error) {
        return next(new HttpValidationError(error));
    }
    try {
        const ${camelCase(name)} = await ${camelCase(name)}Service.deleteOne${pascalCase(name)}(value);
        return res
            .status(200)
            .json(${camelCase(name)});
    } catch (e) {
        next(e);
    }
});

export default router;
`;
};

module.exports = generate;
