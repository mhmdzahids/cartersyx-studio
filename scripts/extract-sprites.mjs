import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const imgPath = '/Users/macbookair/Downloads/Gemini_Generated_Image_lsymsblsymsblsym.jpeg';
const { data, info } = await sharp(imgPath).raw().toBuffer({ resolveWithObject: true });
const w = info.width;
const h = info.height;

const characters = ['capybara', 'axolotl', 'platypus', 'pangolin', 'kiwi'];
const actions = ['idle', 'run1', 'run2', 'jump'];

const rowBounds = [
  [100, 390],
  [390, 650],
  [660, 940],
  [950, 1225],
  [1230, 1515]
];

const colBounds = [
  [600, 1050],
  [1100, 1620],
  [1650, 2200],
  [2250, 2720]
];

const bgR = 125, bgG = 143, bgB = 157;

function isBg(r, g, b) {
  const dist = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);
  return dist < 42;
}

for (let rIdx = 0; rIdx < 5; rIdx++) {
  const charName = characters[rIdx];
  const [yMin, yMax] = rowBounds[rIdx];
  const charDir = path.resolve('public/sprites', charName);
  fs.mkdirSync(charDir, { recursive: true });

  for (let cIdx = 0; cIdx < 4; cIdx++) {
    const actName = actions[cIdx];
    const [xMin, xMax] = colBounds[cIdx];

    // Find tight bounding box of non-bg pixels
    let minX = xMax, maxX = xMin, minY = yMax, maxY = yMin;
    for (let y = yMin; y < yMax; y++) {
      for (let x = xMin; x < xMax; x++) {
        const idx = (y * w + x) * 3;
        if (!isBg(data[idx], data[idx+1], data[idx+2])) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const cropW = maxX - minX + 1;
    const cropH = maxY - minY + 1;
    const outBuf = Buffer.alloc(cropW * cropH * 4);

    for (let y = 0; y < cropH; y++) {
      for (let x = 0; x < cropW; x++) {
        const srcX = minX + x;
        const srcY = minY + y;
        const srcIdx = (srcY * w + srcX) * 3;
        const outIdx = (y * cropW + x) * 4;

        const r = data[srcIdx];
        const g = data[srcIdx+1];
        const b = data[srcIdx+2];

        if (isBg(r, g, b)) {
          outBuf[outIdx] = 0;
          outBuf[outIdx+1] = 0;
          outBuf[outIdx+2] = 0;
          outBuf[outIdx+3] = 0;
        } else {
          outBuf[outIdx] = r;
          outBuf[outIdx+1] = g;
          outBuf[outIdx+2] = b;
          outBuf[outIdx+3] = 255;
        }
      }
    }

    const outFile = path.join(charDir, `${actName}.png`);
    await sharp(outBuf, { raw: { width: cropW, height: cropH, channels: 4 } })
      .png()
      .toFile(outFile);
    console.log(`Saved ${outFile} (${cropW}x${cropH})`);
  }
}
console.log('ALL 20 SPRITES EXTRACTED SUCCESSFULLY!');
