import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import Typography from '@material-ui/core/Typography/Typography';

import StaticPage from 'client/components/pages/StaticPage';

const ContactsPage: React.FC<RouteComponentProps> = () => (
	<StaticPage title="Контакты">
		<Typography gutterBottom variant="h6">
			ООО "КСеть"
		</Typography>
		<Typography gutterBottom>
			Адрес: Российская Федерация, 115573, Москва, ул. Мусы Джалиля, д. 8, корп. 4, оф. 612
		</Typography>
		<Typography>
			Телефон: <a href="tel:+7 969 112 77-88">+7 969 112 77-88</a>
		</Typography>
		<Typography gutterBottom>
			Дополнительный телефон: <a href="tel:+7 910 476 10-46">+7 910 476 10-46</a>
		</Typography>
		<Typography gutterBottom>
			E-mail: <a href="mailto:info@4prtv.ru">info@4prtv.ru</a>
		</Typography>
		<Typography gutterBottom variant="h6">
			Реквизиты организации
		</Typography>
		<Typography>Генеральный директор: Кузнецов Александр Юрьевич</Typography>
		<Typography>Адрес: 115573, Москва г, Мусы Джалиля ул, дом 8, корпус 4, офис 612</Typography>
		<Typography>ИНН: 7724818587</Typography>
		<Typography>КПП: 772401001</Typography>
		<Typography>ОГРН: 1127746004693</Typography>
		<Typography>ОКПО: 37307897</Typography>
		<Typography>ОКАТО: 45296565000</Typography>
		<Typography>ОКВЭД: 74.40</Typography>
		<Typography>Рег. № ПФР: 087603003731</Typography>
		<Typography>Расчетный счет: 40702810238250013522</Typography>
		<Typography>Банк: ОАО "СБЕРБАНК РОССИИ"</Typography>
		<Typography>БИК: 044525225</Typography>
		<Typography>Kорр. счет: 30101810400000000225</Typography>
	</StaticPage>
);

export default ContactsPage;
