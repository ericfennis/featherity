/* eslint-disable import/no-extraneous-dependencies */
import Svgo from 'svgo';
import cheerio from 'cheerio';
import { format } from 'prettier';
import { parseDOM } from 'htmlparser2';

import DEFAULT_ATTRS from './default-attrs.json';

/**
 * Optimize SVG with `svgo`.
 * @param {string} svg - An SVG string.
 * @returns {Promise<string>}
 */
function optimize(svg, path, options) {
  const svgo = new Svgo({
    plugins: [
      { convertShapeToPath: false },
      { mergePaths: false },
      { removeAttrs: { attrs: '(fill|stroke.*)' } },
      { removeTitle: true },
    ],
    ...options,
  });

  return svgo.optimize(svg);
}

/**
 * Set default attibutes on SVG.
 * @param {string} svg - An SVG string.
 * @returns {string}
 */
function setAttrs(svg) {
  const $ = cheerio.load(svg, {
    decodeEntities: false,
    xmlMode: true,
    xml: true,
  });

  Object.keys(DEFAULT_ATTRS).forEach(key => $('svg').attr(key, DEFAULT_ATTRS[key]));

  return $.html();
}

/**
 * Process SVG string.
 * @param {string} svg - An SVG string.
 * @param {Promise<string>}
 */
function processSvg(svg, path, options = {}) {
  return (
    optimize(svg, path, options)
      .then(setAttrs)
      // .then(svg => svg.replace(/;/g, ''))
      .catch(console.error)
  );
  // remove semicolon inserted by prettier
  // because prettier thinks it's formatting JSX not HTML
}

export default processSvg;
