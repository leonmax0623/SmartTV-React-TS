import * as React from 'react';
// import {connect} from 'react-redux';
import {Route, RouteProps, RouteComponentProps, Redirect} from 'react-router-dom';
import {withTracker} from 'react-meteor-data-with-tracker';

import routerUrls from '../constants/routerUrls';

// import css from './AppLayoutRoute.pcss';

interface IAppLayoutRouteProps extends RouteProps {
	component: React.ComponentType<RouteComponentProps>;
}

interface IEditorLayoutRouteDataProps {
	loggedIn: boolean;
	loading: boolean;
}

const EditorLayoutRoute: React.FunctionComponent<IAppLayoutRouteProps &
	IEditorLayoutRouteDataProps> = ({
	component: Component, // tslint:disable-line:naming-convention
	loggedIn,
	loading,
	...rest
}) => (
	<Route
		{...rest}
		// tslint:disable-next-line:jsx-no-lambda
		render={(matchProps) => {
			if (!loggedIn) {
				return <Redirect to={routerUrls.authLogin} />;
			}

			return <Component {...matchProps} />;
		}}
	/>
);

export default withTracker<IEditorLayoutRouteDataProps, IAppLayoutRouteProps>(() => {
	const user = Meteor.user();

	return {
		loggedIn: user !== null,
		loading: user === undefined,
	};
})(EditorLayoutRoute);
