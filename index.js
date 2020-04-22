const fs = require('fs');
const { PNG } = require('pngjs/browser');

const getLastContentRow = (buffer) => {
  const png = new PNG();
  png.parse(buffer, (err, img) => {
    const { width, height, data } = img;
    let lastContentRow = -1;

    const heightWithoutFooter = Math.floor(height - (height * 0.08));

    for (let row = 0; row < heightWithoutFooter; row++) {
      // Array of data has the following format: [r1, g1, b1, a1, r2, g2, b2, a2, ...]
      const columnInWidth = width * 4;
      const initialColumn = row * columnInWidth;

      let hasOtherThanWhite = false;

      for (let col = initialColumn; col < initialColumn + columnInWidth; col++) {
        const r = data[col++];
        const g = data[col++];
        const b = data[col++]; // ++ so that it skips a

        if (r !== 255 || g !== 255 || b !== 255) {
          hasOtherThanWhite = true;
          break;
        }
      }

      if (hasOtherThanWhite) {
        lastContentRow = row;
      }
    }

    console.log(`${lastContentRow} which is %${100.0 * lastContentRow / heightWithoutFooter} of the page`);
  });
};

fs.readFile('with_blank.png', (err, buffer, ) => {
  getLastContentRow(buffer);
});

fs.readFile('no_blank.png', (err, buffer, ) => {
  getLastContentRow(buffer);
});

