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
	const cwd = path.normalize(rawPath);

	const payload = {};

	await totalist(cwd, async (_, file) => {
		const { name, dir, ext } = path.parse(file);

		let data;

		if (ext === '.js') {
			// js path
			data = require(file);

			if (typeof data === 'function') {
				data = await data();
			}
		} else {
			const fileContents = await fs.readFile(file, 'utf8');

			switch (ext) {
				// json path
				case '.json':
					data = parseJson(fileContents, file);
					break;
				// yaml paths
				case '.yaml':
				case '.yml':
					data = yaml.safeLoad(fileContents);
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

		if (data) {
			// remove the leading path, split into a list, and filter out empty strings
			const dirs = path.relative(cwd, dir).split(path.sep).filter(Boolean);

			// add the filename to the path part list
			dirs.push(name);

			dset(payload, dirs, data);
		}
	});

	return payload;
};
