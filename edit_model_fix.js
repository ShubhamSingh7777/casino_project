const fs = require('fs');
const path = 'I:/allpanelexch999/exchangeapi/src/models/UserBetStake.ts';
let content = fs.readFileSync(path, 'utf8');

const interfaceReplacement = "value10: number\n  casinoName1: string\n  casinoValue1: number\n  casinoName2: string\n  casinoValue2: number\n  casinoName3: string\n  casinoValue3: number\n  casinoName4: string\n  casinoValue4: number\n  casinoName5: string\n  casinoValue5: number\n  casinoName6: string\n  casinoValue6: number\n}";
content = content.replace(/value10:\s*number\s*\}/, interfaceReplacement);

const schemaReplacement = "value10: Number,\n    casinoName1: String,\n    casinoValue1: Number,\n    casinoName2: String,\n    casinoValue2: Number,\n    casinoName3: String,\n    casinoValue3: Number,\n    casinoName4: String,\n    casinoValue4: Number,\n    casinoName5: String,\n    casinoValue5: Number,\n    casinoName6: String,\n    casinoValue6: Number,\n  }";
content = content.replace(/value10:\s*Number,\s*\}/, schemaReplacement);

fs.writeFileSync(path, content);
console.log('Successfully updated UserBetStake.ts');
