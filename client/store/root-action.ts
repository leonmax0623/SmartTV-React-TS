import {SlideShowEditorAction} from '../reducers/slideShowEditor';
import {SlideshowActionHistoryAction} from '../reducers/slideshowActionHistory';

export type RootAction =
	SlideShowEditorAction | SlideshowActionHistoryAction;
