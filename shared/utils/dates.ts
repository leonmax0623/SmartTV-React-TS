import formatDate from 'date-fns/format';
import ru from 'date-fns/locale/ru';

export const format = (date: Date | number, format: string, options?: any) =>
	formatDate(date, format, {locale: ru, ...options});
