<p align="center">
  <img src="https://i.imgur.com/yC80ftQ.png" width="150" height="217" alt="quaff">
</p>
<h1 align="center">
  quaff
</h1>
<p align="center">
  <br><br>
  <a href="https://www.npmjs.org/package/quaff"><img src="https://img.shields.io/npm/v/quaff.svg?style=flat" alt="npm"></a>
  <a href="https://github.com/rdmurphy/quaff/actions?query=workflow%3ACI"><img src="https://img.shields.io/github/workflow/status/rdmurphy/quaff/CI/master" alt="travis"></a>
  <a href="https://coveralls.io/github/rdmurphy/quaff?branch=master"><img src="https://coveralls.io/repos/rdmurphy/quaff/badge.svg?branch=master&service=github" alt="coveralls"></a>
  <a href="https://packagephobia.now.sh/result?p=quaff"><img src="https://packagephobia.now.sh/badge?p=quaff" alt="install size"></a>
</p>

## Important!

`quaff` is now a [pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). It can no longer be `require()`'d from CommonJS. If this functionality is still needed please continue to use `quaff@^4`.

## Key features

- 🚚 A **data pipeline helper** written in Node.js that works similar to [Middleman](https://middlemanapp.com/)'s [Data Files](https://middlemanapp.com/advanced/data_files/) collector
- 📦 Point the library at a folder filled with JS, AML ([ArchieML](http://archieml.org)), JSON, YAML, CSV and/or TSV files and **get a JavaScript object back that reflects the folder's structure and content/exports**
- 🤓 Under the hood it uses [`parse-json`](https://github.com/sindresorhus/parse-json) (for better JSON error support), [`js-yaml`](https://github.com/nodeca/js-yaml) and [`d3-dsv`](https://github.com/d3/d3-dsv) to **read files efficiently**

## Installation

```sh
npm install quaff --save-dev
```

`quaff` requires **Node.js 12.20.0 or later**.

## Usage

Assume a folder with this structure.

```txt
data/
  mammals/
    cats.json
    dogs.json
    bears.csv
  birds/
    parrots.yml
    story.aml
```

After `import`'ing `quaff`:

```js
import { load } from 'quaff';

const data = await load('./data/');
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
		},
		"story": {
			"title": "All about birds",
			"prose": [
				{ "type": "text", "value": "Do you know how great birds are?" },
				{ "type": "text", "value": "Come with me on this journey." }
			]
		}
	}
}
```

As of `5.0.0` it's now possible to load a single file at a time, enabling more custom approaches in case `load` doesn't work exactly the way you'd like.

```js
import { loadFile } from 'quaff';

const data = await loadFile('./data/mammals/bears.csv');
console.log(data);
```

And the results...

```json
[
	{
		"name": "Steve",
		"type": "Polar bear"
	},
	{
		"name": "Angelica",
		"type": "Sun bear"
	}
]
```

## Advanced Usage with JavaScript files

One of the biggest features added in `quaff` 4.0 is the ability to load JavaScript files. But how exactly does that work?

JavaScript files that are consumed by `quaff` have to follow one simple rule - they must `export default` a function, an async function or value. All three of these are valid and return the same value:

```js
export default [
	{
		name: 'Pudge',
		instagram: 'https://instagram.com/pudgethecorgi/',
	},
];
```

```js
export default () => [
	{
		name: 'Pudge',
		instagram: 'https://instagram.com/pudgethecorgi/',
	},
];
```

```js
export default async () => [
	{
		name: 'Pudge',
		instagram: 'https://instagram.com/pudgethecorgi/',
	},
];
```

The final example above is the most interesting one - `async` functions also work! This means you can write code to hit API endpoints, or do other asynchronous work, and `quaff` will wait for those to resolve.

```js
import fetch from 'node-fetch';

export default async () => {
	const res = await fetch('https://my-cool-api/');
	const data = await res.json();

	// whatever the API returned will be added to the quaff object!
	return data;
};
```

Don't have a `Promise` to do async work with? Working with a callback interface? Just wrap it in one!

```js
import {apiHelper } from 'my-callback-api';

export default () => {
	return new Promise((resolve, reject) => {
		apiHelper('people', (err, data) => {
			if (err) return reject(err);

			// quaff will take it from here!
			resolve(data);
		});
	});
};
```

## License

By [Ryan Murphy](https://twitter.com/rdmurphy).

Available under the MIT license.
