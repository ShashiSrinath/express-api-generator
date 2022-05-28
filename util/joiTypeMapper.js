const modelMap = {
  string: 'string()',
  number: 'number()',
};

const mapJoiType = (type) => {
  if (modelMap[type]) {
    return modelMap[type];
  }

  throw new Error(`Invalid Joi model mapping type: ${type}`);
};

module.exports = mapJoiType;
