/* eslint-disable import/no-extraneous-dependencies */
import { parseDOM } from 'htmlparser2';
import DEFAULT_ATTRS from './default-attrs.json';
import { toCamelCase, hash } from '../helpers';

const camelizeAttrs = attrs =>
  Object.keys(attrs).reduce((newAttrs, attr) => {
    const attrKey = toCamelCase(attr);

    newAttrs[attrKey] = attrs[attr];
    return newAttrs;
  }, {});

export default (iconsObject, options) => {
  const iconNodes = {};
  const iconPaths = {};

  Object.keys(iconsObject).forEach(icon => {
    const svgString = iconsObject[icon];
    const dom = parseDOM(svgString);

    const children = dom.map(element => {
      const child = [element.name, { ...element.attribs }];

      const uniqueKey = hash(JSON.stringify(child));

      if (options.renderUniqueKey) {
        element.attribs.key = uniqueKey;
      }

      if (iconPaths[uniqueKey] && JSON.stringify(iconPaths[uniqueKey]) !== JSON.stringify(child)) {
        throw new Error(`Hash conflict, key ${uniqueKey} already been taken`);
      }

      iconPaths[uniqueKey] = child;

      return {
        uniqueKey,
        child,
      };
    });

    iconNodes[icon] = children;
  });

  return { iconNodes, iconPaths };
};
