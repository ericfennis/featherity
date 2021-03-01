import fs from 'fs';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import getArgumentOptions from 'minimist';

import renderIconsObject from './render/renderIconsObject';
import renderIconNodes from './render/renderIconNodes';
import generateIconFiles from './build/generateIconFiles';
import generateExportsFile from './build/generateExportsFile';
import { readSvgDirectory } from './helpers';
import generatePathFiles from './build/generatePathFiles';

/* eslint-disable import/no-dynamic-require */

const cliArguments = getArgumentOptions(process.argv.slice(2));

const ICONS_DIR = path.resolve(__dirname, '../icons');
const OUTPUT_DIR = path.resolve(__dirname, cliArguments.output || '../build');
const SRC_DIR = path.resolve(__dirname, '../src');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

const svgFiles = readSvgDirectory(ICONS_DIR);

const icons = renderIconsObject(svgFiles, ICONS_DIR);

const { iconNodes, iconPaths } = renderIconNodes(icons, cliArguments);

const defaultIconFileTemplate = ({ componentName, iconName, children }) => {
  const pathImports = children
    .map(({ uniqueKey }) => `import _${uniqueKey} from '../paths/${uniqueKey}'`)
    .join('\n');
  const uniqueKeys = children.map(({ uniqueKey }) => `_${uniqueKey}`).join(', ');
  return `
    ${pathImports}

    const ${componentName} = {
      name: '${iconName}',
      children: [${uniqueKeys}]
    };

    export default ${componentName};
  `;
};

const iconFileTemplate = cliArguments.templateSrc
  ? require(cliArguments.templateSrc).default
  : defaultIconFileTemplate;

// Generates iconsNodes files for each icon
generateIconFiles(iconNodes, OUTPUT_DIR, iconFileTemplate);

// eslint-disable-next-line prettier/prettier
generatePathFiles(iconPaths, OUTPUT_DIR, (iconPathKey, [ element, children ]) => {
  const SVGElementVariable = element.toUpperCase();
  return `
    import {${SVGElementVariable}} from '../svgElements';

    const _${iconPathKey} = [${SVGElementVariable}, ${JSON.stringify(children)}];

    export default _${iconPathKey};
    `;
});

// Generates entry files for the compiler filled with icons exports
generateExportsFile(
  path.join(SRC_DIR, 'icons/index.js'),
  path.join(OUTPUT_DIR, 'icons'),
  iconNodes,
);
