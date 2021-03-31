import path from 'path';
import defaultAttributes from '../src/defaultAttributes';

import { readSvgDirectory, resetFile, appendFile, toPascalCase } from '../../../scripts/helpers';

const TARGET_DIR = path.join(__dirname, '../dist');
const ICONS_DIR = path.resolve(__dirname, '../../../icons');
const TYPES_FILE_NAME = 'lucide.d.ts';

// Generates header of d.ts file include some types and functions
const typeDefinitions = `\
export interface SVGProps extends Partial<SVGElement> ${JSON.stringify(defaultAttributes, null, 2)}

export type IconNode = readonly [tag: string, object:SVGProps, children?:IconNode];
export type IconNodeList = { [iconName:string]: IconNode }
export type CustomAttrs = { [attr:string]: any }

export function createElement(icon: IconNode): SVGSVGElement;

export interface Options {
  icons?: IconNodeList,
  nameAttr?: string,
  attrs?: CustomAttrs
}

export function createIcons(options: Options): void;

export declare const icons: IconNodeList;

// Generated icons
`;

resetFile(TYPES_FILE_NAME, TARGET_DIR);
appendFile(typeDefinitions, TYPES_FILE_NAME, TARGET_DIR);

const svgFiles = readSvgDirectory(ICONS_DIR);

svgFiles.forEach(svgFile => {
  const nameSvg = path.basename(svgFile, '.svg');
  const namePascal = toPascalCase(nameSvg);

  appendFile(`export declare const ${namePascal}: IconNode;\n`, TYPES_FILE_NAME, TARGET_DIR);
});

console.log(`Generated ${TYPES_FILE_NAME} file with`, svgFiles.length, 'icons');
