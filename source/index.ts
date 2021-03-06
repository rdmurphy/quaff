// internal
import { promises as fs } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// packages
import archieml from 'archieml';
import { dset } from 'dset';
import { csvParse, tsvParse } from 'd3-dsv';
import parseJson from 'parse-json';
import { totalist } from 'totalist';
import yaml from 'js-yaml';

/**
 * quaff's valid extensions.
 */
const validExtensions = [
	'.js',
	'.cjs',
	'.mjs',
	'.json',
	'.yaml',
	'.yml',
	'.csv',
	'.tsv',
	'.aml',
];

/**
 * @param filePath the input file path
 * @returns {Promise<unknown>}
 */
export async function loadFile(filePath: string): Promise<unknown> {
	const ext = path.extname(filePath);

	// it can return absolutely anything
	let data: unknown;

	// we give JavaScript entries a special treatment
	if (ext === '.js' || ext === '.cjs' || ext === '.mjs') {
		// js path
		// @ts-ignore - dynamic imports *can* take URL objects, but TypeScript disagrees
		data = (await import(pathToFileURL(filePath))).default;

		if (typeof data === 'function') {
			data = await data();
		}
	} else {
		// otherwise look for matches
		const fileContents = await fs.readFile(filePath, 'utf8');

		switch (ext) {
			// json path
			case '.json':
				data = parseJson(fileContents, filePath);
				break;
			// yaml paths
			case '.yaml':
			case '.yml':
				data = yaml.load(fileContents, { filename: filePath });
				break;
			// csv path
			case '.csv':
				data = csvParse(fileContents);
				break;
			// tsv path
			case '.tsv':
				data = tsvParse(fileContents);
				break;
			// aml path
			case '.aml':
				data = archieml.load(fileContents);
				break;
			default:
				throw new Error(
					`Unable to parse ${filePath} - no valid processor found for ${ext} extension`,
				);
		}
	}

	return data;
}

/**
 * We know this will return a string-keyed Object, but that's about it.
 */
export type LoadReturnValue = Record<string, unknown>;

/**
 * @param dirPath the input directory
 * @returns {Promise<LoadReturnValue>}
 */
export async function load(dirPath: string): Promise<LoadReturnValue> {
	// normalize the input path
	const cwd = path.normalize(dirPath);

	// the object we will eventually return with data
	const output: LoadReturnValue = {};

	// a set to watch out for duplicate keys
	const existing = new Set();

	// loop through the files in the directory
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

		const data = await loadFile(abs);
		dset(output, dirs, data);
	});

	return output;
}
