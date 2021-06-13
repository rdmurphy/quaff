/**
 * @param filePath the input file path
 * @returns {Promise<unknown>}
 */
export declare function loadFile(filePath: string): Promise<unknown>;
/**
 * We know this will return a string-keyed Object, but that's about it.
 */
export declare type LoadReturnValue = Record<string, unknown>;
/**
 * @param dirPath the input directory
 * @returns {Promise<LoadReturnValue>}
 */
export declare function load(dirPath: string): Promise<LoadReturnValue>;
