/* eslint-disable import/no-extraneous-dependencies */
import outlineStroke from 'svg-outline-stroke';
import { parse, stringify } from 'svgson';
import { promises as fs, existsSync, mkdirSync } from 'fs';
import path from 'path';
// import transpileToPaths from './render/transpileToPaths';
import { readSvgDirectory } from './helpers';

const ICONS_DIR = path.resolve(__dirname, '../icons');
const OUTPUT_DIR = path.resolve(__dirname, '../converted');

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR);
}

const svgFiles = readSvgDirectory(ICONS_DIR);

function transformForward(node) {
  if (node.name === 'svg') {
    return {
      ...node,
      attributes: {
        ...node.attributes,
        width: 480,
        height: 480,
      },
    };
  }
  return node;
}

function transformBackwards(node) {
  if (node.name === 'svg') {
    return {
      ...node,
      attributes: {
        ...node.attributes,
        width: 24,
        height: 24,
      },
    };
  }
  return node;
}

svgFiles.forEach(async file => {
  const icon = await fs.readFile(`${ICONS_DIR}/${file}`);
  const scaled = await parse(icon.toString(), {
    transformNode: transformForward,
  });
  const outlined = await outlineStroke(stringify(scaled));
  const outlinedWithoutAttrs = await parse(outlined, {
    transformNode: transformBackwards,
  });
  await fs.writeFile(`${OUTPUT_DIR}/${file}`, stringify(outlinedWithoutAttrs));
});
