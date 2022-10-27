import '@babel/polyfill/dist/polyfill';
import '../meteor-client.js';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import moment from 'moment';
import 'moment/locale/ru';

import 'shared/methods/slideshow';
import {renderRoot} from 'client/utils/bugsnag';
import Editor from './EditorApp';

moment.locale('ru');

Meteor.startup(() => {
	render(renderRoot(Editor, 'editor'), document.getElementById('root')!);
});
