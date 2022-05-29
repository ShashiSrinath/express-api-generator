# typescript-express-api-generator

this is a file generator utility that can be used with my express typescript starter repo
https://github.com/ShashiSrinath/node-express-typescript-starter

this will generate a full crud code for the given feature based on the provided meta_file.json

### sample meta_file.json
```angular2html
[
  {
    "name": "restaurant-table",
    "data": {
      "name": "string",
      "index": "number",
      "pendingBalance": "number"
    }
  },
  {
   "name": "restaurant-item",
    "data": {
      "name": "string",
      "price": "number",
      "qty": "number"
    }
  }
]
```

### How to use
- navigate to the directory you want the files to be generated
- create a meta_file.json file
- run the below command

```
npx typescript-express-api-generator features meta_file.json
```
or
```
npm i -g typescript-express-api-generator
```
```
txa-generator features meta_file.json
```

### Data type support
- string
- number

___more will be added soon___
