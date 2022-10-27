import * as React from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {Redirect, Route, RouteComponentProps, RouteProps} from 'react-router-dom';

import routerUrls from '../constants/routerUrls';
import UserHeader from '../components/common/UserHeader';
import css from './AuthLayoutRoute.pcss';
import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {Group} from 'shared/collections/Groups';
import {sharedConsts} from 'shared/constants/sharedConsts';
import {Grid, CircularProgress} from '@material-ui/core';
import TheFooter from 'client/components/TheFooter';

interface IAuthLayoutRouteProps extends RouteProps {
	component: React.ComponentType<RouteComponentProps>;
}

interface IAuthLayoutRouteDataProps {
	loggedIn: boolean;
	loading: boolean;
	defaultGroupId?: string;
}

const AuthLayoutRoute: React.FunctionComponent<IAuthLayoutRouteProps &
	IAuthLayoutRouteDataProps> = ({
	component: Component, // tslint:disable-line:naming-convention
	loggedIn,
	loading,
	defaultGroupId,
	...rest
}) => (
	<Route
		{...rest}
		// tslint:disable-next-line:jsx-no-lambda
		render={(matchProps) => {
			if (loggedIn) {
				if (!defaultGroupId) {
					return (
						<Grid container justify={'center'}>
							<Grid item>
								<CircularProgress />
							</Grid>
						</Grid>
					);
				}

				return (
					<Redirect
						to={`${routerUrls.userSlideshowGroup.replace(':groupId', defaultGroupId)}`}
					/>
				);
			}

			return (
				<div className="auth-layout">
					<UserHeader />

					<div className={css.authLayoutContentWrapper}>
						<Component {...matchProps} />
					</div>

					<TheFooter />
				</div>
			);
		}}
	/>
);

export default withTracker(() => {
	const user = Meteor.user();
	const groupSub = Meteor.subscribe(publishNames.group.groups);
	const group = Group.findOne({name: sharedConsts.user.slideShowGroupDefault}) || Group.findOne();

	return {
		defaultGroupId: group?._id,
		loggedIn: user !== null,
		loading: user === undefined || !groupSub.ready(),
	};
})(AuthLayoutRoute);
