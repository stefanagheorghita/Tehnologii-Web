const fs = require('fs');
const path = require('path');

function replaceImageUrls(htmlContent, callback) {
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    const imageUrlMatches = htmlContent.matchAll(imageRegex);
    const imageUrls = Array.from(imageUrlMatches, (match) => match[1]);
    const imageDataPromises = imageUrls.map((imageUrl) => {
      const imagePath = path.join(__dirname, '..','..', 'frontend', imageUrl);
      return new Promise((resolve, reject) => {
        fs.readFile(imagePath, (err, imageData) => {
          if (err) {
            console.error(err);
            console.log('sadfg');
            reject(err);
          } else {
            const mimeType = path.extname(imageUrl).replace('.', '');
            const base64Content = Buffer.from(imageData).toString('base64');
            const encodedImageUrl = `data:image/${mimeType};base64,${base64Content}`;
            htmlContent = htmlContent.replace(imageUrl, encodedImageUrl);
            resolve();
          }
        });
      });
     });
    // const cssImageRegex = /url\((['"]?)(.*?)\1\)/g;
    // cssContents.forEach((cssContent, index) => {
    //   const cssImageUrlMatches = cssContent.matchAll(cssImageRegex);
    //   const cssImageUrls = Array.from(cssImageUrlMatches, (match) => match[2]);
  
    //   cssImageUrls.forEach((imageUrl) => {
    //     const imagePath = path.join(__dirname, '..', 'frontend', imageUrl);
  
    //     fs.readFile(imagePath, (err, imageData) => {
    //       if (!err) {
    //         const mimeType = path.extname(imageUrl).replace('.', '');
    //         const base64Content = Buffer.from(imageData).toString('base64');
    //         const encodedImageUrl = `url(data:image/${mimeType};base64,${base64Content})`;
    //         cssContents[index] = cssContents[index].replace(`url(${imageUrl})`, encodedImageUrl);
    //       }
    //     });
    //   });
    // });
  
    Promise.all(imageDataPromises)
      .then(() => {
        callback(null, htmlContent);
      })
      .catch((err) => {
        callback(err);
      });
 

}
function injectCSS(html) {
  const regex = /<link\s+rel="stylesheet"\s+href="([^"]+)"\s*\/?>/g;
  const modifiedHTML = html.replace(regex, '');
  return modifiedHTML;
}

module.exports = {
  replaceImageUrls,
  injectCSS
};
