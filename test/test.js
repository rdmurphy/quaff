// native
const { test: it } = require('uvu');
const assert = require('assert').strict;
const fs = require('fs').promises;
const path = require('path');

// packages
const archieml = require('archieml');
const dsv = require('d3-dsv');
const yaml = require('js-yaml');

// internal
const quaff = require('..');

const readJson = async (filepath) =>
	JSON.parse(await fs.readFile(filepath, 'utf8'));
const readYaml = async (filepath) =>
	yaml.safeLoad(await fs.readFile(filepath, 'utf8'));
const readCsv = async (filepath) =>
	dsv.csvParse(await fs.readFile(filepath, 'utf8'));
const readTsv = async (filepath) =>
	dsv.tsvParse(await fs.readFile(filepath, 'utf8'));
const readArchieML = async (filepath) =>
	archieml.load(await fs.readFile(filepath, 'utf8'));

it('should normalize a trailing extra slash', async () => {
	assert.deepStrictEqual(await quaff('./test/source/basic_json/'), {
		corgis: await readJson('./test/source/basic_json/corgis.json'),
	});
});

it('should return object generated from json', async () => {
	assert.deepStrictEqual(await quaff('./test/source/basic_json'), {
		corgis: await readJson('./test/source/basic_json/corgis.json'),
	});
});

it('should return object generated from yaml', async () => {
	assert.deepStrictEqual(await quaff('./test/source/basic_yaml'), {
		corgis: await readYaml('./test/source/basic_yaml/corgis.yaml'),
	});
});

it('should return object generated from yml', async () => {
	assert.deepStrictEqual(await quaff('./test/source/basic_yml'), {
		corgis: await readYaml('./test/source/basic_yml/corgis.yml'),
	});
});

it('should return object generated from csv', async () => {
	assert.deepStrictEqual(await quaff('./test/source/basic_csv'), {
		corgis: await readCsv('./test/source/basic_csv/corgis.csv'),
	});
});

it('should return object generated from tsv', async () => {
	assert.deepStrictEqual(await quaff('./test/source/basic_tsv'), {
		corgis: await readTsv('./test/source/basic_tsv/corgis.tsv'),
	});
});

it('should ignore files that do not match filters', async () => {
	assert.deepStrictEqual(await quaff('./test/source/non_match_file'), {
		corgis: await readYaml('./test/source/non_match_file/corgis.yaml'),
	});
});

it('should return object representing data one subdirectory deep', async () => {
	assert.deepStrictEqual(await quaff('./test/source/single_depth'), {
		corgis: await readJson('./test/source/single_depth/corgis.json'),
		others: {
			malamutes: await readJson(
				'./test/source/single_depth/others/malamutes.json',
			),
			corgis: await readCsv('./test/source/basic_csv/corgis.csv'),
		},
	});
});

it('should return object representing data two subdirectories deep', async () => {
	assert.deepStrictEqual(await quaff('./test/source/double_depth'), {
		corgis: await readJson('./test/source/double_depth/corgis.json'),
		others: {
			malamutes: await readJson(
				'./test/source/double_depth/others/malamutes.json',
			),
			outcasts: {
				cats: await readCsv(
					'./test/source/double_depth/others/outcasts/cats.csv',
				),
			},
		},
	});
});

it('should throw an error when attempting to load empty JSON', async () => {
	await assert.rejects(quaff('./test/source/basic_json_empty'), {
		name: 'JSONError',
		message: /^Unexpected end of JSON input/,
	});
});

it('should throw an error when attempting to load bad JSON', async () => {
	await assert.rejects(quaff('./test/source/basic_json_error'), {
		name: 'JSONError',
		message: /^Unexpected token "}"/,
	});
});

it('should throw an error when attempting to load bad YAML', async () => {
	await assert.rejects(quaff('./test/source/basic_yaml_error'), {
		name: 'YAMLException',
		message: /^end of the stream or a document separator is expected/,
	});
});

it('should return what is exported from a JavaScript file (no function)', async () => {
	assert.deepStrictEqual(await quaff('./test/source/basic_js'), {
		corgis: require('./source/basic_js/corgis.js'),
	});
});

it('should return what is exported from a JavaScript file (sync function)', async () => {
	assert.deepStrictEqual(await quaff('./test/source/sync_js'), {
		corgis: require('./source/sync_js/corgis.js')(),
	});
});

it('should return what is exported from a JavaScript file (async function)', async () => {
	assert.deepStrictEqual(await quaff('./test/source/async_js'), {
		corgis: await require('./source/async_js/corgis.js')(),
	});
});

it('should return object generated from aml', async () => {
	assert.deepStrictEqual(await quaff('./test/source/basic_aml'), {
		corgis: await readArchieML('./test/source/basic_aml/corgis.aml'),
	});

	assert.deepStrictEqual(await quaff('./test/source/advanced_aml'), {
		text: await readArchieML('./test/source/advanced_aml/text.aml'),
	});
});

it('should throw an error if a file key is reused', async () => {
	await assert.rejects(quaff('./test/source/duplicate_keys'), {
		name: 'Error',
		message: /^More than one file attempted/,
	});
});

it('should have a non-enumerable value under __file__', async () => {
	const data = await quaff('./test/source/basic_json/');
	const expected = await readJson('./test/source/basic_json/corgis.json');

	assert.deepStrictEqual(data, {
		corgis: expected,
	});

	assert.strictEqual(
		data.corgis.__file__,
		path.resolve(__dirname, '../test/source/basic_json/corgis.json'),
	);
});

it.run();
