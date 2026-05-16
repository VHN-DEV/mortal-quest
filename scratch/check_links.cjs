
const fs = require('fs');

const content = fs.readFileSync('c:/xampp/htdocs/mortal-quest/src/configs/item-data.js', 'utf8');

// Extract all keys from the ITEMS object
// This is a bit rough but should work for this file structure
const itemIds = new Set();
const keyRegex = /^\s*'(.*?)':\s*\{/gm;
let match;
while ((match = keyRegex.exec(content)) !== null) {
    itemIds.add(match[1]);
}

const brokenLinks = [];
const linkRegex = /\[\[(.*?)(?:\|(.*?))?\]\]/g;
const lines = content.split('\n');

lines.forEach((line, index) => {
    let linkMatch;
    while ((linkMatch = linkRegex.exec(line)) !== null) {
        const linkId = linkMatch[1];
        if (!itemIds.has(linkId)) {
            brokenLinks.push({
                line: index + 1,
                brokenId: linkId,
                fullMatch: linkMatch[0]
            });
        }
    }
});

if (brokenLinks.length > 0) {
    console.log("Broken Links Found:");
    brokenLinks.forEach(link => {
        console.log(`Line ${link.line}: Broken ID "${link.brokenId}" in ${link.fullMatch}`);
    });
} else {
    console.log("No broken links found!");
}
