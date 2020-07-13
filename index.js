// internal
const fs = require('fs').promises;
const path = require('path');

// packages
const archieml = require('archieml');
const dset = require('dset');
const dsv = require('d3-dsv');
const parseJson = require('parse-json');
const totalist = require('totalist');
const yaml = require('js-yaml');

module.exports = async function quaff(rawPath) {
	const validExtensions = [
		'.js',
		'.json',
		'.yaml',
		'.yml',
		'.csv',
		'.tsv',
		'.aml',
	];

	// normalize the input path
	const cwd = path.normalize(rawPath);

	// the object we will eventually return with data
	const output = {};

	// a set to watch out for duplicate keys
	const existing = new Set();

	await totalist(cwd, async (rel, abs) => {
		const { name, dir, ext } = path.parse(rel);

		// early exit if not a valid extension
		if (!validExtensions.includes(ext)) return;

		// remove the leading path, split into a list, and filter out empty strings
		const dirs = dir.split(path.sep).filter(Boolean);

		// add the filename to the path part list
		dirs.push(name);

		// build a unique "key" for this file so we can watch out for dupes
		const key = dirs.join('.');

		// if this key isn't unique, throw an error
		if (existing.has(key)) {
			throw new Error(
				`More than one file attempted to use "${key}" as its path. This error is caused by having multiple files in a directory with the same name but different extensions.`,
			);
		}

		// otherwise save it for checking future inputs
		existing.add(key);

		let data;

		// we give JavaScript entries a special treatment
		if (ext === '.js') {
			// js path
			data = require(abs);

			if (typeof data === 'function') {
				data = await data();
			}
		} else {
			// otherwise look for matches
			const fileContents = await fs.readFile(abs, 'utf8');

			switch (ext) {
				// json path
				case '.json':
					data = parseJson(fileContents, abs);
					break;
				// yaml paths
				case '.yaml':
				case '.yml':
					data = yaml.safeLoad(fileContents, { filename: abs });
					break;
				// csv path
				case '.csv':
					data = dsv.csvParse(fileContents);
					break;
				// tsv path
				case '.tsv':
					data = dsv.tsvParse(fileContents);
					break;
				// aml path
				case '.aml':
					data = archieml.load(fileContents);
					break;
			}
		}

		dset(output, dirs, data);
	});

	return output;
};
