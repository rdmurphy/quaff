/* global it */

'use strict';

const assert = require('assert');
const quaff = require('../.');
const fs = require('fs');
const yaml = require('js-yaml');
const dsv = require('d3-dsv');

it('should throw an error pointing to the invalid file', function() {
  try {
    quaff('./test/source/empty_file/');
  } catch (e) {
    assert.equal(e.message, 'Unexpected end of JSON input. Error in test/source/empty_file/empty.json.');
  }
});

it('should normalize a trailing extra slash', function() {
  assert.deepEqual(quaff('./test/source/basic_json/'), {
    corgis: JSON.parse(fs.readFileSync('./test/source/basic_json/corgis.json', 'utf8'))
  });
});

it('should return object generated from json', function() {
  assert.deepEqual(quaff('./test/source/basic_json'), {
    corgis: JSON.parse(fs.readFileSync('./test/source/basic_json/corgis.json', 'utf8'))
  });
});

it('should return object generated from yaml', function() {
  assert.deepEqual(quaff('./test/source/basic_yaml'), {
    corgis: yaml.safeLoad(fs.readFileSync('./test/source/basic_yaml/corgis.yaml', 'utf8'))
  });
});

it('should return object generated from yml', function() {
  assert.deepEqual(quaff('./test/source/basic_yml'), {
    corgis: yaml.safeLoad(fs.readFileSync('./test/source/basic_yml/corgis.yml', 'utf8'))
  });
});

it('should return object generated from csv', function() {
  assert.deepEqual(quaff('./test/source/basic_csv'), {
    corgis: dsv.csv.parse(fs.readFileSync('./test/source/basic_csv/corgis.csv', 'utf8'))
  });
});

it('should return object generated from tsv', function() {
  assert.deepEqual(quaff('./test/source/basic_tsv'), {
    corgis: dsv.tsv.parse(fs.readFileSync('./test/source/basic_tsv/corgis.tsv', 'utf8'))
  });
});

it('should ignore files that do not match filters', function() {
  assert.deepEqual(quaff('./test/source/non_match_file'), {
    corgis: yaml.safeLoad(fs.readFileSync('./test/source/non_match_file/corgis.yaml', 'utf8'))
  });
});

it('should return object representing data one subdirectory deep', function() {
  assert.deepEqual(quaff('./test/source/single_depth'), {
    corgis: JSON.parse(fs.readFileSync('./test/source/single_depth/corgis.json', 'utf8')),
    others: {
      malamutes: JSON.parse(fs.readFileSync('./test/source/single_depth/others/malamutes.json', 'utf8')),
      corgis: dsv.csv.parse(fs.readFileSync('./test/source/basic_csv/corgis.csv', 'utf8'))
    }
  });
});

it('should return object representing data two subdirectories deep', function() {
  assert.deepEqual(quaff('./test/source/double_depth'), {
    corgis: JSON.parse(fs.readFileSync('./test/source/double_depth/corgis.json', 'utf8')),
    others: {
      malamutes: JSON.parse(fs.readFileSync('./test/source/double_depth/others/malamutes.json', 'utf8')),
      outcasts: {
        cats: dsv.csv.parse(fs.readFileSync('./test/source/double_depth/others/outcasts/cats.csv', 'utf8'))
      }
    }
  });
});
