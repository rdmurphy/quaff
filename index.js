// internal
const fs = require('fs');
const path = require('path');

// packages
const dset = require('dset');
const dsv = require('d3-dsv');
const glob = require('tiny-glob/sync');
const parseJson = require('parse-json');
const yaml = require('js-yaml');

module.exports = function quaff(rawPath) {
  const cwd = path.normalize(rawPath);
  const files = glob('**/*.{json,yaml,yml,csv,tsv}', { absolute: true, cwd });

  const payload = {};

  files.forEach(function(file) {
    const { name, dir, ext } = path.parse(file);
    const fileContents = fs.readFileSync(file, 'utf8');

    let data;

    if (ext === '.json') {
      data = parseJson(fileContents, file);
    } else if (ext === '.yaml' || ext === '.yml') {
      data = yaml.safeLoad(fileContents);
    } else if (ext === '.csv') {
      data = dsv.csvParse(fileContents);
    } else {
      data = dsv.tsvParse(fileContents);
    }

    // remove the leading path, split into a list, and filter out empty strings
    const dirs = path
      .relative(cwd, dir)
      .split(path.sep)
      .filter(Boolean);

    // add the filename to the path part list
    dirs.push(name);

    dset(payload, dirs, data);
  });

  return payload;
};
