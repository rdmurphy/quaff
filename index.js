'use strict';

var fs = require('fs');
var glob = require('glob');
var path = require('path');
var yaml = require('js-yaml');


function normalizePath(dir) {
  var cleanDir = path.normalize(dir);

  if (cleanDir.slice(-path.sep.length) !== path.sep) {
    return cleanDir + path.sep;
  }

  return cleanDir;
}

module.exports = function(rawDataDir) {
  var dataDir = normalizePath(rawDataDir);
  var depth = dataDir.split(path.sep).length - 1;
  var files = glob.sync(dataDir + '**/*.{json,yaml,yml}');

  var payload = {};

  files.forEach(function(file) {
    var props = path.parse(file);
    var extension = props.ext;
    var basename = props.name;
    var dir = path.normalize(props.dir);

    var data;

    if (extension === '.json') {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } else if (extension === '.yaml' || extension === '.yml') {
      data = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
    } else {
      return;
    }

    var obj = payload;

    var dirs = dir.split(path.sep);
    dirs.splice(0, depth); // dump the root dataDir

    dirs.forEach(function(dir) {
      if (!obj.hasOwnProperty(dir)) {
        obj[dir] = {};
      }
      obj = obj[dir];
    });

    obj[basename] = data;
  });

  return payload;
};
