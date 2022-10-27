import * as React from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Routes from '../Routes';

export default class Root extends React.PureComponent {
	render() {
		return <Routes />;
	}
}
