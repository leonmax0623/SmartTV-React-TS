import * as React from 'react';
import {Route, RouteProps, RouteComponentProps, Redirect} from 'react-router-dom';
import {withTracker} from 'react-meteor-data-with-tracker';
import {CircularProgress, Grid} from '@material-ui/core';

import routerUrls from '../constants/routerUrls';
import UserHeader from '../components/common/UserHeader';
import AdminHeader from '../components/common/AdminHeader';
import css from './AppLayoutRoute.pcss';
import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {Group} from 'shared/collections/Groups';
import {sharedConsts} from 'shared/constants/sharedConsts';
import {checkAdmin} from 'shared/utils/user';
import TheFooter from 'client/components/TheFooter';

interface IAppLayoutRouteProps extends RouteProps {
	isAdmin?: boolean;
	component: React.ComponentType<RouteComponentProps>;
}

interface IAppLayoutRouteDataProps {
	defaultGroupId?: string;
	loggedIn: boolean;
	loading: boolean;
	userIsAdmin: boolean;
	contentWrapperMod: string;
	header?: React.ReactChild;
}

const AppLayoutRoute: React.FunctionComponent<IAppLayoutRouteProps & IAppLayoutRouteDataProps> = ({
	component: Component, // tslint:disable-line:naming-convention
	loggedIn,
	loading,
	userIsAdmin,
	contentWrapperMod,
	defaultGroupId,
	header,
	...rest
}) => (
	<Route
		{...rest}
		// tslint:disable-next-line:jsx-no-lambda
		render={(matchProps) => {
			const {
				location: {pathname},
			} = matchProps;

			if (!loggedIn) {
				return <Redirect to={routerUrls.authLogin} />;
			}

			if (pathname === routerUrls.home) {
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

			if (loggedIn && rest.isAdmin && !loading && !userIsAdmin) {
				return <Redirect to={routerUrls.restricted} />;
			}

			return (
				<>
					{header ? header : rest.isAdmin ? <AdminHeader /> : <UserHeader />}

					<div
						className={
							contentWrapperMod === 'white'
								? `${css.appLayoutContentWrapper} ${css.appLayoutContentWrapperWhite}`
								: css.appLayoutContentWrapper
						}
					>
						<Component {...matchProps} {...rest} />
					</div>
					<TheFooter />
				</>
			);
		}}
	/>
);

export default withTracker<IAppLayoutRouteDataProps, IAppLayoutRouteProps>(() => {
	const user = Meteor.user();
	const groupSub = Meteor.subscribe(publishNames.group.groups);
	const group = Group.findOne({name: sharedConsts.user.slideShowGroupDefault}) || Group.findOne();

	return {
		defaultGroupId: group?._id,
		loggedIn: user !== null,
		userIsAdmin: checkAdmin(user),
		loading: !groupSub.ready() || user === undefined,
	};
})(AppLayoutRoute);
