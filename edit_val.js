const fs = require('fs');
const path = 'I:/allpanelexch999/exchangeapi/src/validations/userStake.validation.ts';
let content = fs.readFileSync(path, 'utf8');

const newValidation = [
  "  check('casinoName1', 'CasinoName1 is requied').not().isEmpty(),",
  "  check('casinoValue1', 'CasinoValue1 is requied').not().isEmpty(),",
  "  check('casinoName2', 'CasinoName2 is requied').not().isEmpty(),",
  "  check('casinoValue2', 'CasinoValue2 is requied').not().isEmpty(),",
  "  check('casinoName3', 'CasinoName3 is requied').not().isEmpty(),",
  "  check('casinoValue3', 'CasinoValue3 is requied').not().isEmpty(),",
  "  check('casinoName4', 'CasinoName4 is requied').not().isEmpty(),",
  "  check('casinoValue4', 'CasinoValue4 is requied').not().isEmpty(),",
  "  check('casinoName5', 'CasinoName5 is requied').not().isEmpty(),",
  "  check('casinoValue5', 'CasinoValue5 is requied').not().isEmpty(),",
  "  check('casinoName6', 'CasinoName6 is requied').not().isEmpty(),",
  "  check('casinoValue6', 'CasinoValue6 is requied').not().isEmpty(),",
  "]"
].join('\n');

content = content.replace("check('value10', 'Value10 is requied').not().isEmpty(),\n]", "check('value10', 'Value10 is requied').not().isEmpty(),\n" + newValidation);

fs.writeFileSync(path, content);
console.log('Modified userStake.validation.ts');
