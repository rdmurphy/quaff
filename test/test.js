// native
const assert = require('assert');
const fs = require('fs');

// packages
const dsv = require('d3-dsv');
const yaml = require('js-yaml');

// internal
const quaff = require('..');

it('should normalize a trailing extra slash', function() {
  assert.deepEqual(quaff('./test/source/basic_json/'), {
    corgis: JSON.parse(
      fs.readFileSync('./test/source/basic_json/corgis.json', 'utf8')
    ),
  });
});

it('should return object generated from json', function() {
  assert.deepEqual(quaff('./test/source/basic_json'), {
    corgis: JSON.parse(
      fs.readFileSync('./test/source/basic_json/corgis.json', 'utf8')
    ),
  });
});

it('should return object generated from yaml', function() {
  assert.deepEqual(quaff('./test/source/basic_yaml'), {
    corgis: yaml.safeLoad(
      fs.readFileSync('./test/source/basic_yaml/corgis.yaml', 'utf8')
    ),
  });
});

it('should return object generated from yml', function() {
  assert.deepEqual(quaff('./test/source/basic_yml'), {
    corgis: yaml.safeLoad(
      fs.readFileSync('./test/source/basic_yml/corgis.yml', 'utf8')
    ),
  });
});

it('should return object generated from csv', function() {
  assert.deepEqual(quaff('./test/source/basic_csv'), {
    corgis: dsv.csvParse(
      fs.readFileSync('./test/source/basic_csv/corgis.csv', 'utf8')
    ),
  });
});

it('should return object generated from tsv', function() {
  assert.deepEqual(quaff('./test/source/basic_tsv'), {
    corgis: dsv.tsvParse(
      fs.readFileSync('./test/source/basic_tsv/corgis.tsv', 'utf8')
    ),
  });
});

it('should ignore files that do not match filters', function() {
  assert.deepEqual(quaff('./test/source/non_match_file'), {
    corgis: yaml.safeLoad(
      fs.readFileSync('./test/source/non_match_file/corgis.yaml', 'utf8')
    ),
  });
});

it('should return object representing data one subdirectory deep', function() {
  assert.deepEqual(quaff('./test/source/single_depth'), {
    corgis: JSON.parse(
      fs.readFileSync('./test/source/single_depth/corgis.json', 'utf8')
    ),
    others: {
      malamutes: JSON.parse(
        fs.readFileSync(
          './test/source/single_depth/others/malamutes.json',
          'utf8'
        )
      ),
      corgis: dsv.csvParse(
        fs.readFileSync('./test/source/basic_csv/corgis.csv', 'utf8')
      ),
    },
  });
});

it('should return object representing data two subdirectories deep', function() {
  assert.deepEqual(quaff('./test/source/double_depth'), {
    corgis: JSON.parse(
      fs.readFileSync('./test/source/double_depth/corgis.json', 'utf8')
    ),
    others: {
      malamutes: JSON.parse(
        fs.readFileSync(
          './test/source/double_depth/others/malamutes.json',
          'utf8'
        )
      ),
      outcasts: {
        cats: dsv.csvParse(
          fs.readFileSync(
            './test/source/double_depth/others/outcasts/cats.csv',
            'utf8'
          )
        ),
      },
    },
  });
});

it('should throw an error when attempting to load empty JSON', function() {
  const tester = function() {
    quaff('./test/source/basic_json_empty');
  };

  assert.throws(tester, /JSONError/);
});

it('should throw an error when attempting to load bad JSON', function() {
  const tester = function() {
    quaff('./test/source/basic_json_error');
  };

  assert.throws(tester, /JSONError/);
});
