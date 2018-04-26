'use strict';

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const yaml = require('js-yaml');
const dsv = require('d3-dsv');


function normalizePath (dir) {
  let cleanDir = path.normalize(dir);

  if (cleanDir.slice(-path.sep.length) !== path.sep) {
    cleanDir = cleanDir + path.sep;
  }

  return cleanDir;
}

module.exports = function (rawDataDir) {
  const dataDir = normalizePath(rawDataDir);
  const depth = dataDir.split(path.sep).length - 1;
  const files = glob.sync(dataDir + '**/*.{json,yaml,yml,csv,tsv}');

  const payload = {};

  files.forEach(function (file) {
    try {
      const extension = path.extname(file);
      const basename = path.basename(file, extension);
      const dir = path.normalize(path.dirname(file));
      const fileContents = fs.readFileSync(file, 'utf8');

      let data;

      if (extension === '.json') {
        data = JSON.parse(fileContents);
      } else if (extension === '.yaml' || extension === '.yml') {
        data = yaml.safeLoad(fileContents);
      } else if (extension === '.csv') {
        data = dsv.csv.parse(fileContents);
      } else {
        data = dsv.tsv.parse(fileContents);
      }

      let obj = payload;

      const dirs = dir.split(path.sep);
      dirs.splice(0, depth); // dump the root dataDir

      dirs.forEach(function (dir) {
        if (!obj.hasOwnProperty(dir)) {
          obj[dir] = {};
        }
        obj = obj[dir];
      });

      obj[basename] = data;
    } catch (error) {
      throw new Error(`${error.message}. Error in ${file}.`)
    }
  });

  return payload;
};
