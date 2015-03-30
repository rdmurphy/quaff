/* global it */

'use strict';

var assert = require('assert');
var datasip = require('../.');
var fs = require('fs');
var yaml = require('js-yaml');

it('should return object generated from json', function() {
  assert.deepEqual(datasip('./test/source/basic_json'), {
    corgis: JSON.parse(fs.readFileSync('./test/source/basic_json/corgis.json', 'utf8'))
  });
});

it('should return object generated from yaml', function() {
  assert.deepEqual(datasip('./test/source/basic_yaml'), {
    corgis: yaml.safeLoad(fs.readFileSync('./test/source/basic_yaml/corgis.yaml', 'utf8'))
  });
});

it('should return object generated from yml', function() {
  assert.deepEqual(datasip('./test/source/basic_yml'), {
    corgis: yaml.safeLoad(fs.readFileSync('./test/source/basic_yml/corgis.yml', 'utf8'))
  });
});

it('should ignore files that do not match filters', function() {
  assert.deepEqual(datasip('./test/source/non_match_file'), {
    corgis: yaml.safeLoad(fs.readFileSync('./test/source/non_match_file/corgis.yaml', 'utf8'))
  });
});

it('should return object representing data one subdirectory deep', function() {
  assert.deepEqual(datasip('./test/source/single_depth'), {
    corgis: JSON.parse(fs.readFileSync('./test/source/single_depth/corgis.json', 'utf8')),
    others: {
      malamutes: JSON.parse(fs.readFileSync('./test/source/single_depth/others/malamutes.json', 'utf8'))
    }
  });
});

it('should return object representing data two subdirectories deep', function() {
  assert.deepEqual(datasip('./test/source/double_depth'), {
    corgis: JSON.parse(fs.readFileSync('./test/source/double_depth/corgis.json', 'utf8')),
    others: {
      malamutes: JSON.parse(fs.readFileSync('./test/source/double_depth/others/malamutes.json', 'utf8')),
      outcasts: {
        cats: JSON.parse(fs.readFileSync('./test/source/double_depth/others/outcasts/cats.json', 'utf8'))
      }
    }
  });
});
