/**
 *
 * @param {Array <String> | String} titles - текст для склонений
 * @param {Number} n - число
 * @param {Object} [options] - настройки
 * @param {Boolean} [options.showNumber = false] - показать число рядом с текстом
 * @param {String} [options.delimiter = '|'] - разделитель для текста
 */
export default function pluralize(
	titles: string,
	n: number,
	{showNumber = false, delimiter = '|'} = {},
) {
	let _titles: string | string[] = titles;
	if (typeof _titles === 'string') {
		_titles = _titles.split(delimiter);
	}

	return `${!showNumber ? '' : n + ' '}${
		_titles[
			n % 10 == 1 && n % 100 != 11
				? 0
				: n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
				? 1
				: 2
		]
	}`;
}
