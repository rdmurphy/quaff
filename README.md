![](http://i.imgur.com/yC80ftQ.png)

# quaff [![Build Status](https://travis-ci.org/rdmurphy/quaff.svg?branch=master)](https://travis-ci.org/rdmurphy/quaff)

A data pipeline helper written in node that works similar to [Middleman](https://middlemanapp.com/)'s [Data Files](https://middlemanapp.com/advanced/data_files/) collector.

Point the library at a folder filled with JSON and/or YAML files and get a JavaScript object back that reflects the folder's structure. Great for pulling data in to templates!

Under the hood it uses JavaScript's built in [JSON support](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) and [`js-yaml`](https://github.com/nodeca/js-yaml) to read files.

## Installation

```sh
npm install quaff --save-dev
```

Requires the latest `iojs` or `node>=0.12.0`.

## Usage

Assume a folder with this structure.

```
data/
  mammals/
    cats.json
    dogs.json
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
    "cats": [
      "Marty",
      "Sammy"
    ],
    "dogs": [
      "Snazzy",
      "Cally"
    ]
  },
  "birds": {
    "parrots": {
      "alive": [
        "Buzz"
      ],
      "dead": [
        "Moose"
      ]
    }
  }
}
```

## License

By [Ryan Murphy](https://twitter.com/rdmurphy).

Available under the MIT license.
