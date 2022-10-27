import {routerMiddleware} from 'connected-react-router';
import {applyMiddleware, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';

import reducers from './root-reducer';
import history from './history';

const getMiddleware = () => {
	const commonMiddleware = [routerMiddleware(history), thunk];

	if (process.env.NODE_ENV === 'production') {
		return applyMiddleware(...commonMiddleware);
	}

	// Add additional middleware for dev
	return applyMiddleware(...commonMiddleware, createLogger({collapsed: true}));
};

export const store = createStore(reducers, getMiddleware());
