import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import Typography from '@material-ui/core/Typography/Typography';

import StaticPage from 'client/components/pages/StaticPage';
import {Link} from '@material-ui/core';

const PrivacyPolicy: React.FunctionComponent<RouteComponentProps> = () => (
	<StaticPage title="Недостаточно прав для просмотра данной страницы">
		<Typography gutterBottom>
			К сожалению, у Вас не хватает прав для просмотра данной страницы. Если вы считаете что
			это ошибка, обратитесь <Link href="mailto:info@4prtv.ru">службу поддержки</Link>
		</Typography>
	</StaticPage>
);

export default PrivacyPolicy;
