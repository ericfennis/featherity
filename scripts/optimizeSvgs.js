import { promises as fs } from 'fs';
import path from 'path';
import processSvg from './render/processSvg';
import { readSvgDirectory } from './helpers';

const ICONS_DIR = path.resolve(__dirname, '../icons');

console.log(`Optimizing SVGs...`);

const svgFiles = readSvgDirectory(ICONS_DIR);

svgFiles.forEach(async svgFile => {
  const svg = await fs.readFile(path.join(ICONS_DIR, svgFile));
  const content = await processSvg(svg, path.join(ICONS_DIR, svgFile));
  console.log(content);
  // processSvg(svg).then(content => {
  //   console.log(content);
  // });
  //   fs.writeFileSync(path.join(ICONS_DIR, svgFile), content);
});
