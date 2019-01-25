// internal
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

// packages
const dset = require('dset');
const dsv = require('d3-dsv');
const glob = require('tiny-glob');
const parseJson = require('parse-json');
const yaml = require('js-yaml');

module.exports = async function quaff(rawPath) {
  const cwd = path.normalize(rawPath);

  const files = await glob('**/*.{js,json,yaml,yml,csv,tsv}', {
    absolute: true,
    cwd,
  });

  const payload = {};

  await Promise.all(
    files.map(async function(file) {
      const { name, dir, ext } = path.parse(file);

      let data;

      if (ext === '.js') {
        // js path
        data = require(file);

        if (typeof data === 'function') {
          data = await data();
        }
      } else {
        const fileContents = await readFile(file, 'utf8');

        if (ext === '.json') {
          // json path
          data = parseJson(fileContents, file);
        } else if (ext === '.yaml' || ext === '.yml') {
          // yaml path
          data = yaml.safeLoad(fileContents);
        } else if (ext === '.csv') {
          // csv path
          data = dsv.csvParse(fileContents);
        } else {
          // tsv path
          data = dsv.tsvParse(fileContents);
        }
      }

      // remove the leading path, split into a list, and filter out empty strings
      const dirs = path
        .relative(cwd, dir)
        .split(path.sep)
        .filter(Boolean);

      // add the filename to the path part list
      dirs.push(name);

      dset(payload, dirs, data);
    })
  );

  return payload;
};
