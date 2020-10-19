declare function quaff(
	rawPath: string,
	onEach: ({ absolute: string, object: any, relative: string }) => unknown,
): Promise<unknown>;

export = quaff;
