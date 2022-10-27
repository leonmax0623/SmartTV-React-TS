import {combineReducers} from 'redux';
import {StateType} from 'typesafe-actions';
import {connectRouter} from 'connected-react-router';

import slideShowEditor from '../reducers/slideShowEditor';
import slideshowActionHistory from '../reducers/slideshowActionHistory';
import history from './history';

const rootReducer = combineReducers({
	slideShowEditor,
	slideshowActionHistory,
	router: connectRouter(history),
});

export type RootState = StateType<typeof rootReducer>;

export default rootReducer;
