import * as React from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

export const renderRoot = (Root: React.ComponentType<{}>, appLabel: string) => {
	if (process.env.BRANCH === 'release') {
		Bugsnag.start({
			apiKey: '934bf1fa89d9bd75996c1847ca25b4df',
			plugins: [new BugsnagPluginReact()],
		});
		const ErrorBoundary = Bugsnag.getPlugin('react')?.createErrorBoundary(React);

		return (
			<ErrorBoundary>
				<Root />
			</ErrorBoundary>
		);
	}

	return <Root />;
};
