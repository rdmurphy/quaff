'use strict';

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const yaml = require('js-yaml');


function normalizePath (dir) {
  const cleanDir = path.normalize(dir);

  if (cleanDir.slice(-path.sep.length) !== path.sep) {
    return cleanDir + path.sep;
  }

  return cleanDir;
}

module.exports = function (rawDataDir) {
  const dataDir = normalizePath(rawDataDir);
  const depth = dataDir.split(path.sep).length - 1;
  const files = glob.sync(dataDir + '**/*.{json,yaml,yml}');

  const payload = {};

  files.forEach(function (file) {
    const extension = path.extname(file);
    const basename = path.basename(file, extension);
    const dir = path.normalize(path.dirname(file));

    let data;

    if (extension === '.json') {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } else if (extension === '.yaml' || extension === '.yml') {
      data = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
    } else {
      return;
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
  });

  return payload;
};
