import * as React from 'react';
// @ts-ignore
import {withTracker} from 'react-meteor-data-with-tracker';
import {Redirect, Route, RouteProps} from 'react-router-dom';
import queryString from 'query-string';
import {Meteor} from 'meteor/meteor';

import {methodNames} from 'shared/constants/methodNames';
import {appConfig} from 'client/constants/config';
import routerUrls from '../constants/routerUrls';

interface IOAuthLayoutRouteProps extends RouteProps {
	fail: boolean;
}

const AuthLayoutRoute: React.FunctionComponent<IOAuthLayoutRouteProps> = ({fail, ...rest}) => (
	<Route
		{...rest}
		// tslint:disable-next-line:jsx-no-lambda
		render={() => {
			if (!fail) {
				return null;
			}

			return <Redirect to={routerUrls.authLogin} />;
		}}
	/>
);

let isEntered: boolean;
const servicesAppId = {
	[routerUrls.oAuthGoogle]: appConfig.GOOGLE_CLIENT_ID,
	[routerUrls.oAuthVk]: appConfig.VK_APP_ID,
	[routerUrls.oAuthFacebook]: appConfig.FACEBOOK_APP_ID,
	[routerUrls.oAuthTwitter]: appConfig.TWITTER_CONSUMER_KEY,
};

export default withTracker(({location}: RouteProps) => {
	let fail = false;

	if (!isEntered) {
		const pathname = location && location.pathname;
		const search = location && location.search;
		const data = search && queryString.parse(search);

		if (pathname && data) {
			Meteor.call(
				methodNames.user.toggleService,
				data,
				servicesAppId[pathname],
				true,
				window.close,
			);
		} else {
			fail = true;
		}

		isEntered = true;
	}

	return {fail};
})(AuthLayoutRoute);
