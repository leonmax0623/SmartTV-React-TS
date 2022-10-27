declare const Migrations: {
	add: (migration: {up: () => void, down?: () => void, name?: string, version: number}) => void,
	migrateTo: (command: number | string) => void,
	getVersion: () => number,
	unlock: () => void,
};
