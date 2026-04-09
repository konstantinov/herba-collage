export const format = (date: Date, options = {}) => {
	let result = `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', { timeZone: '+06:00' })}`;

	if (options.noSec) {
		result = result.replace(/:\d{2}$/, '');
	}

	if (options.noTime) {
		result = result.split(' ')[0];
	}

	if (options.noYear) {
		result = result.replace(/\.\d{4}/, '');
	}

	return result;
};
