export default (bytes: number): string => {
	const units = ['b', 'kb', 'mb', 'gb'];

	let size = bytes;
	let unitInd = 1;
	let res = `${size}${units[0]}`;

	while (size > 999 && unitInd < 3) {
		size /= 1000;
		res = `${Math.round(size * 10) / 10}${units[unitInd]}`;
		unitInd += 1;
	}

	return res;
};
