import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'react-meteor-data-with-tracker';
import {css as cssEmotion} from 'emotion';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import {RouteComponentProps} from 'react-router';
import classNames from 'classnames';

import appConsts from 'client/constants/appConsts';
import {AppSets, IAppsetsFeed} from 'shared/collections/AppSets';
import css from './AppSetsPreview.pcss';

interface IAppSetPreviewProps {
	loading: boolean;
	appsets: IAppsetsFeed;
}

const AppSetPreview: React.FC<IAppSetPreviewProps> = (props) => {
	const {appsets, loading} = props;
	if (loading) return <CircularProgress />;
	const {style} = appsets;

	const styles = {
		body: cssEmotion`
		${style && style.backgroundColor ? `background-color: ${style.backgroundColor};` : ''}

		${style && style.color ? `color: ${style.color};` : ''}
			
		${
			style && style.image
				? `background: url('${appConsts.uploadUrl}/${style.image}') center center ${style.repeat};`
				: ''
		}
			
		${style && style.image && style.scale ? `background-size: ${style.scale}%;` : ''}
		`,

		img: cssEmotion`
			${style && style.focusColor ? `border: 2px solid ${style.focusColor};` : ''}
		`,
	};

	document.getElementsByTagName('body')[0].classList.add(styles.body);

	return (
		<Grid
			container
			className={css.container}
			justify="center"
			alignItems="center"
			direction="column"
		>
			<Grid item>
				<Typography variant="h3" className={css.title}>
					{appsets.title}
				</Typography>
			</Grid>

			<Grid item>
				<Typography variant="h4" className={css.welcome}>
					{appsets.welcome}
				</Typography>
			</Grid>

			<Grid item>
				<Typography variant="h4" className={css.instructions}>
					Выберите экран и нажмите ОК
				</Typography>
			</Grid>

			<Grid container className={css.items} justify="center">
				{appsets.apps &&
					appsets.apps.map((app) => (
						<Grid item key={app.appId} className={css.item}>
							<div className={css.imageContainer}>
								<img
									src={`${appConsts.uploadUrl}/${app.previewImage}`}
									className={classNames(css.img, `${styles.img}`)}
									alt=""
								/>
							</div>

							<div className={css.title}>{app.title}</div>
						</Grid>
					))}
			</Grid>
		</Grid>
	);
};

export default withTracker((props: RouteComponentProps) => {
	const {id: numId} = props.match.params as {id: string};
	const sub = Meteor.subscribe('appsets');
	const loading = !sub.ready();

	return {
		loading,
		appsets: AppSets.findOne({numId}),
	};
})(AppSetPreview);
