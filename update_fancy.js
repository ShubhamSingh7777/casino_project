
const fs = require('fs');
const path = 'i:\\\\allfronts\\\\allpanelexch999\\\\src\\\\pages\\\\odds\\\\components\\\\fancy.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /return allFancies\.filter\(\(fancy: any\) => \{/;
const replacement = \eturn allFancies.filter((fancy: any) => {
        if (!fancy?.active) return false;
        let updatedFancy: any = {};
        if (fancyUpdate[fancy.marketId]) {
          updatedFancy = fancyUpdate[fancy.marketId];
        }
        if (updatedFancy.LayPrice1 === undefined) return false;\;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(path, content);
    console.log('fancy.tsx updated successfully');
} else {
    console.log('regex not found');
}

