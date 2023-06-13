const path = require('path');
const fs = require('fs');
function includeCss(content, filePath) {
    const directory = path.dirname(filePath);
    const regex = /<link\s+rel="stylesheet"\s+href="([^"]+)"\s*\/?>/g;
    let modifiedContent = content;
    let match;
  
    while ((match = regex.exec(content)) !== null) {
      const cssPath = path.join(directory, match[1]);
  
      // Exclude Font Awesome CSS file
      if (match[1].includes('font-awesome')) {
        continue;
      }
  
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      modifiedContent = modifiedContent.replace(match[0], `<style>${cssContent}</style>`);
    }
  
    return modifiedContent;
  }
  

  module.exports = {
   includeCss
  };