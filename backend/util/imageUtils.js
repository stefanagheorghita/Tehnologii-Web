const fs = require('fs');
const path = require('path');

function replaceImageUrls(htmlContent, callback) {
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    const imageUrlMatches = htmlContent.matchAll(imageRegex);
    const imageUrls = Array.from(imageUrlMatches, (match) => match[1]);
    const imageDataPromises = imageUrls.map((imageUrl) => {
        const imagePath = path.join(__dirname, '..', '..', 'frontend', imageUrl);
        return new Promise((resolve, reject) => {
            fs.readFile(imagePath, (err, imageData) => {
                if (err) {
                    const placeholderImageUrl = 'https://pro2-bar-s3-cdn-cf6.myportfolio.com/c728a553-9706-473c-adca-fa2ea3652db5/a124d74e-ff6c-4949-aa4f-ea4d43b71224_rw_600.jpg?h=69b24e904907dd396c0ce0af04d66f84';
                    htmlContent = htmlContent.replace(`src="${imageUrl}"`, `src="${placeholderImageUrl}"`);
                    
                    resolve();
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


/*function replaceImageUrls(htmlContent, animalBackgroundUrl, callback) {
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    const imageUrlMatches = htmlContent.matchAll(imageRegex);
    const imageUrls = Array.from(imageUrlMatches, (match) => match[1]);
    const imageDataPromises = imageUrls.map((imageUrl) => {
        const imagePath = path.join(__dirname, '..', '..', 'frontend', imageUrl);
        return new Promise((resolve, reject) => {
            fs.readFile(imagePath, (err, imageData) => {
                if (err) {
                    const placeholderImageUrl =
                        'https://pro2-bar-s3-cdn-cf6.myportfolio.com/c728a553-9706-473c-adca-fa2ea3652db5/a124d74e-ff6c-4949-aa4f-ea4d43b71224_rw_600.jpg?h=69b24e904907dd396c0ce0af04d66f84';
                    htmlContent = htmlContent.replace(`src="${imageUrl}"`, `src="${placeholderImageUrl}"`);

                    resolve();
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

    // Replace the animal background URL
    if (animalBackgroundUrl) {
        const backgroundRegex = /<img[^>]+src="([^">]+)" alt="animal background">/;
        htmlContent = htmlContent.replace(backgroundRegex, `<img src="${animalBackgroundUrl}" alt="animal background">`);
    }

    Promise.all(imageDataPromises)
        .then(() => {
            callback(null, htmlContent);
        })
        .catch((err) => {
            callback(err);
        });
}*/

/*function replaceImageUrls(htmlContent, animal, callback) {
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    const imageUrlMatches = htmlContent.matchAll(imageRegex);
    const imageUrls = Array.from(imageUrlMatches, (match) => match[1]);
    const imageDataPromises = imageUrls.map((imageUrl) => {
      const imagePath = path.join(__dirname, '..', '..', 'frontend', imageUrl);
      return new Promise((resolve, reject) => {
        fs.readFile(imagePath, (err, imageData) => {
          if (err) {
            const placeholderImageUrl = 'https://pro2-bar-s3-cdn-cf6.myportfolio.com/c728a553-9706-473c-adca-fa2ea3652db5/a124d74e-ff6c-4949-aa4f-ea4d43b71224_rw_600.jpg?h=69b24e904907dd396c0ce0af04d66f84';
            htmlContent = htmlContent.replace(`src="${imageUrl}"`, `src="${placeholderImageUrl}"`);
            resolve();
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
  
    Promise.all(imageDataPromises)
      .then(() => {
        // Replace the background image URL if available in the animal object
        if (animal && animal.background_image) {
          const backgroundRegex = /<img[^>]+src="([^">]+)" alt="animal background">/;
          htmlContent = htmlContent.replace(backgroundRegex, `<img src="${animal.background_image}" alt="animal background">`);
        }
        callback(null, htmlContent);
      })
      .catch((err) => {
        callback(err);
      });
  }*/




function injectCSS(html) {
    const regex = /<link\s+rel="stylesheet"\s+href="([^"]+)"\s*\/?>/g;
    const modifiedHTML = html.replace(regex, '');
    return modifiedHTML;
}

module.exports = {
    replaceImageUrls,
    injectCSS
};
