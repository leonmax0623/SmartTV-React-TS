import {createAsyncAction} from 'typesafe-actions';
import {Dispatch} from 'redux';
import {RootState} from 'client/store/root-reducer';
import {ISlideshowAction, SlideshowActionType} from 'client/reducers/slideshowActionHistory';
import {
	deleteSlideElementHistory,
	addElementToSlideHistory,
	updateSlideElementHistory,
	deleteSlideHistory,
	updateSlideStylesHistory,
	addSlideHistory,
	selectSlideHistory,
	updateSlideshowParamsHistory,
	updateSlideshowStylesHistory,
	updateElementStylesHistory,
	reorderSlideHistory,
} from 'client/actions/slideShowEditor';

export const undoLastActionActions = createAsyncAction(
	'slideshowActionHistory/undoLastAction:request',
	'slideshowActionHistory/undoLastAction:success',
	'slideshowActionHistory/undoLastAction:failure',
)<void, void, void>();

export const undoLastAction = () => (dispatch: Dispatch, getState: any) => {
	const state: RootState = getState();
	const {actions} = state.slideshowActionHistory;

	if (actions.length === 0) {
		return;
	}

	dispatch(undoLastActionActions.request());

	const action = actions[0];

	switch (action.type) {
		case SlideshowActionType.SELECT_SLIDE: {
			if (action && action.slideData && action.slideData._id) {
				dispatch(selectSlideHistory(action.slideData._id) as any);
			}

			break;
		}

		case SlideshowActionType.EDIT_SLIDESHOW_PARAMS: {
			if (action.slideshowParamsData && action.slideshowParamsData._id) {
				dispatch(
					updateSlideshowParamsHistory(
						action.slideshowParamsData._id,
						action.slideshowParamsData,
					) as any,
				);
			}

			break;
		}

		case SlideshowActionType.EDIT_SLIDESHOW_STYLES: {
			if (action.slideshowStylesData && action.slideshowStylesData._id) {
				dispatch(
					updateSlideshowStylesHistory(
						action.slideshowStylesData._id,
						action.slideshowStylesData,
						action.slideshowStylesData.applyForAllSlides,
					) as any,
				);
			}

			break;
		}

		case SlideshowActionType.EDIT_ELEMENT_STYLE: {
			if (action.slideshowStylesData && action.slideshowStylesData._id) {
				dispatch(
					updateElementStylesHistory(
						action.slideshowStylesData._id,
						action.slideshowStylesData,
						action.slideshowStylesData.applyForAllSlides,
					) as any,
				);
			}

			break;
		}

		case SlideshowActionType.ADD_SLIDE: {
			if (action.slideData && action.slideData._id && action.idOfPreviouslySelectedSlide) {
				dispatch(
					deleteSlideHistory(
						action.slideData._id,
						action.idOfPreviouslySelectedSlide,
					) as any,
				);
			}

			break;
		}

		case SlideshowActionType.DUBLICATE_SLIDE: {
			if (action.slideData && action.slideData._id) {
				dispatch(
					deleteSlideHistory(
						action.slideData._id,
						action.idOfPreviouslySelectedSlide,
					) as any,
				);
			}

			break;
		}

		case SlideshowActionType.REORDER_SLIDE: {
			if (action.slideData && action.slideData._id && action.slidePosition) {
				dispatch(reorderSlideHistory(action.slideData._id, action.slidePosition) as any);
			}

			break;
		}

		case SlideshowActionType.EDIT_SLIDE: {
			if (action.slideStyleData && action.slideStyleData._id) {
				dispatch(
					updateSlideStylesHistory(
						action.slideStyleData._id,
						action.slideStyleData,
					) as any,
				);
			}

			break;
		}

		case SlideshowActionType.DELETE_SLIDE: {
			if (action.slideData && action.slideData.slideshowId) {
				dispatch(
					addSlideHistory(
						action.slideData.slideshowId,
						action.slideData,
						action.slideElements,
					) as any,
				);
			}

			break;
		}

		case SlideshowActionType.ADD_ELEMENT: {
			if (action.elementData && action.elementData._id) {
				dispatch(deleteSlideElementHistory(action.elementData._id) as any);
			}

			break;
		}

		case SlideshowActionType.EDIT_ELEMENT: {
			if (action.elementData && action.elementData._id) {
				dispatch(
					updateSlideElementHistory(action.elementData._id, action.elementData) as any,
				);
			}

			break;
		}

		case SlideshowActionType.DELETE_ELEMENT: {
			if (action.elementData && action.elementData.slideId) {
				dispatch(
					addElementToSlideHistory(action.elementData.slideId, action.elementData) as any,
				);
			}

			break;
		}

		case SlideshowActionType.DUBLICATE_ELEMENT: {
			if (action.elementData && action.elementData._id) {
				dispatch(deleteSlideElementHistory(action.elementData._id) as any);
			}

			break;
		}

		default:
	}
};

export const replaceActionActions = createAsyncAction(
	'slideshowActionHistory/replaceAction:request',
	'slideshowActionHistory/replaceAction:success',
	'slideshowActionHistory/replaceAction:failure',
)<void, ISlideshowAction[], void>();

export const replaceAction = (actions: ISlideshowAction[]) => (dispatch: Dispatch) => {
	dispatch(replaceActionActions.success(actions));
};
