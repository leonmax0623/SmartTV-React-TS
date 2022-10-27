import '@babel/polyfill/dist/polyfill';
import 'raf/polyfill';
import 'url-search-params-polyfill';
import '../meteor-client.js';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import moment from 'moment';
import 'moment/locale/ru';

import SlideshowApp from './SlideshowApp';
import {renderRoot} from 'client/utils/bugsnag';

moment.locale('ru');

Meteor.startup(() => {
	render(renderRoot(SlideshowApp, 'slideshow'), document.getElementById('root')!);
});
