<p align="center">
  <img src="https://i.imgur.com/yC80ftQ.png" width="150" height="217" alt="quaff">
  <br>
  <a href="https://www.npmjs.org/package/quaff"><img src="https://img.shields.io/npm/v/quaff.svg?style=flat" alt="npm"></a>
  <a href="https://travis-ci.org/rdmurphy/quaff"><img src="https://travis-ci.org/rdmurphy/quaff.svg?branch=master" alt="travis"></a>
  <a href="https://coveralls.io/github/rdmurphy/quaff?branch=master"><img src="https://coveralls.io/repos/rdmurphy/quaff/badge.svg?branch=master&service=github" alt="coveralls"></a>
  <a href="https://david-dm.org/rdmurphy/quaff"><img src="https://david-dm.org/rdmurphy/quaff/status.svg" alt="dependencies"></a>
  <a href="https://packagephobia.now.sh/result?p=quaff"><img src="https://packagephobia.now.sh/badge?p=quaff" alt="install size"></a>
</p>

# quaff

A data pipeline helper written in node that works similar to [Middleman](https://middlemanapp.com/)'s [Data Files](https://middlemanapp.com/advanced/data_files/) collector.

Point the library at a folder filled with JSON, YAML, CSV and/or TSV files and get a JavaScript object back that reflects the folder's structure. Great for pulling data in to templates!

Under the hood it uses JavaScript's built in [JSON support](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON), [`js-yaml`](https://github.com/nodeca/js-yaml) and [`d3-dsv`](https://github.com/d3/d3-dsv) to read files.

## Installation

```sh
npm install quaff --save-dev
```

Requires `node>=6`.

## Usage

Assume a folder with this structure.

```
data/
  mammals/
    cats.json
    dogs.json
    bears.csv
  birds/
    parrots.yml
```

After `require()`'ing `quaff`:

```js
var quaff = require('quaff');
var data = quaff('./data/');

console.log(data);
```

And the results...

```json
{
  "mammals": {
    "cats": ["Marty", "Sammy"],
    "dogs": ["Snazzy", "Cally"],
    "bears": [
      {
        "name": "Steve",
        "type": "Polar bear"
      },
      {
        "name": "Angelica",
        "type": "Sun bear"
      }
    ]
  },
  "birds": {
    "parrots": {
      "alive": ["Buzz"],
      "dead": ["Moose"]
    }
  }
}
```

## License

By [Ryan Murphy](https://twitter.com/rdmurphy).

Available under the MIT license.
