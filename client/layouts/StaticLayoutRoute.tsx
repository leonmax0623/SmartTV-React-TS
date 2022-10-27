import * as React from 'react';
import {Route, RouteComponentProps, RouteProps} from 'react-router-dom';

import UserHeader from '../components/common/UserHeader';
import css from './StaticLayoutRoute.pcss';
import TheFooter from 'client/components/TheFooter';

interface IStaticLayoutRouteProps extends RouteProps {
	component: React.ComponentType<RouteComponentProps>;
}

const StaticLayoutRoute: React.FunctionComponent<IStaticLayoutRouteProps> = ({
	component: Component, // tslint:disable-line:naming-convention
	...rest
}) => (
	<Route
		{...rest}
		// tslint:disable-next-line:jsx-no-lambda
		render={(matchProps) => {
			return (
				<div className="auth-layout">
					<UserHeader />

					<div className={css.staticLayoutContentWrapper}>
						<Component {...matchProps} />
					</div>

					<TheFooter />
				</div>
			);
		}}
	/>
);

export default StaticLayoutRoute;
