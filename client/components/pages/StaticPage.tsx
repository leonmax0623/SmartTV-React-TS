import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import css from './StaticPage.pcss';
import routerUrls from 'client/constants/routerUrls';

interface IStaticPage {
	title: React.ReactNode;
}

const StaticPage: React.FunctionComponent<IStaticPage> = ({title, children}) => (
	<Grid container direction="row" justify="center" alignItems="center" className={css.page}>
		<Grid item>
			<Paper className={css.paper}>
				<Typography variant="h5" gutterBottom align="center">
					{title}
				</Typography>

				{children}
			</Paper>

			<div className={css.links}>
				<a className={css.link} href={routerUrls.authLogin}>
					Вход
				</a>
				&nbsp; &middot; &nbsp;
				<a className={css.link} href={routerUrls.authRegistration}>
					Регистрация
				</a>
			</div>
		</Grid>
	</Grid>
);

export default StaticPage;
