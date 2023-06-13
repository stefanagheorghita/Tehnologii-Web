const path = require('path');
const fs = require('fs');

function includeAssets(content, filePath) {
    const directory = path.dirname(filePath);
    const cssRegex = /<link\s+rel="stylesheet"\s+href="([^"]+)"\s*\/?>/g;
    const jsRegex = /<script\s+src="([^"]+)"\s*><\/script>/g;
    let modifiedContent = content;
    let match;

    while ((match = cssRegex.exec(content)) !== null) {
        const cssPath = path.join(directory, match[1]);

        if (match[1].includes('font-awesome')) {
            continue;
        }

        const cssContent = fs.readFileSync(cssPath, 'utf8');
        modifiedContent = modifiedContent.replace(match[0], `<style>${cssContent}</style>`);
    }

    while ((match = jsRegex.exec(content)) !== null) {
        const jsPath = path.join(directory, match[1]);
        const jsContent = fs.readFileSync(jsPath, 'utf8');
        modifiedContent = modifiedContent.replace(match[0], `<script>${jsContent}</script>`);
    }

    return modifiedContent;
}

module.exports = {
    includeAssets
};
