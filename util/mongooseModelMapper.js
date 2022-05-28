const modelMap = {
  string: 'String',
  number: 'Number',
};

const mapMongooseType = (type) => {
  if (modelMap[type]) {
    return modelMap[type];
  }

  throw new Error(`Invalid mongoose model mapping type: ${type}`);
};

module.exports = mapMongooseType;
