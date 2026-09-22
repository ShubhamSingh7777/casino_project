const fs = require('fs');
const path = 'I:/allpanelexch999/exchangeapi/src/models/UserBetStake.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace Interface
content = content.replace('  value10: number\n}', '  value10: number\n  casinoName1: string\n  casinoValue1: number\n  casinoName2: string\n  casinoValue2: number\n  casinoName3: string\n  casinoValue3: number\n  casinoName4: string\n  casinoValue4: number\n  casinoName5: string\n  casinoValue5: number\n  casinoName6: string\n  casinoValue6: number\n}');

// Replace defaultStack
const newDefault = "const defaultStack: any = {\n  name1: '1k',\n  value1: 1000,\n  name2: '2k',\n  value2: 2000,\n  name3: '5k',\n  value3: 5000,\n  name4: '10k',\n  value4: 10000,\n  name5: '20k',\n  value5: 20000,\n  name6: '25k',\n  value6: 25000,\n  name7: '50k',\n  value7: 50000,\n  name8: '75k',\n  value8: 75000,\n  name9: '90k',\n  value9: 90000,\n  name10: '95k',\n  value10: 95000,\n  casinoName1: '25',\n  casinoValue1: 25,\n  casinoName2: '50',\n  casinoValue2: 50,\n  casinoName3: '100',\n  casinoValue3: 100,\n  casinoName4: '200',\n  casinoValue4: 200,\n  casinoName5: '500',\n  casinoValue5: 500,\n  casinoName6: '1000',\n  casinoValue6: 1000,\n}";
content = content.replace(/const defaultStack: any = \{[\s\S]*?\}/, newDefault);

// Replace Schema
content = content.replace('    value10: Number,\n  },', '    value10: Number,\n    casinoName1: String,\n    casinoValue1: Number,\n    casinoName2: String,\n    casinoValue2: Number,\n    casinoName3: String,\n    casinoValue3: Number,\n    casinoName4: String,\n    casinoValue4: Number,\n    casinoName5: String,\n    casinoValue5: Number,\n    casinoName6: String,\n    casinoValue6: Number,\n  },');

fs.writeFileSync(path, content);
console.log('Modified UserBetStake.ts');
