import {createAction, createAsyncAction} from 'typesafe-actions';
import {Dispatch} from 'redux';
import {Meteor} from 'meteor/meteor';

import {methodNames} from 'shared/constants/methodNames';
import {
	ISlideshowParams,
	IUpdateSlideElementParams,
	IUpdateSlideParams,
	IUpdateSlideshowParams,
	IUpdateSlideshowStyles,
} from 'shared/models/SlideshowMethodParams';
import {SlideElementTypeEnum, ISlideElement, SlideElement} from 'shared/collections/SlideElements';
import {RootState} from 'client/store/root-reducer';
import {ISlideshow, ISlideshowStyles} from 'shared/collections/Slideshows';
import {ISlide, Slide} from 'shared/collections/Slides';
import {replaceAction} from 'client/actions/slideshowActionHistory';

export const setSlideshowId = createAction(
	'slideShowEditor/setSlideshowId',
	(resolve) => (slideshowId: string) => resolve(slideshowId),
);

export const selectSlide = createAction(
	'slideShowEditor/selectSlide',
	(resolve) => (slideId?: string, oldSlideId?: string, isSaveToHistory?: boolean) =>
		resolve({slideId, oldSlideId, isNotSaveToHistory: !isSaveToHistory}),
);

export const selectSlideHistory = createAction(
	'slideShowEditor/selectSlideHistory',
	(resolve) => (slideId?: string) => resolve({slideId}),
);

export const selectSlideElement = createAction(
	'slideShowEditor/selectSlideElement',
	(resolve) => (element: ISlideElement) => resolve(element),
);

export const deselectSlideElement = createAction('slideShowEditor/deselectSlideElement');

export const toggleEditorStylesPanel = createAction(
	'slideShowEditor/toggleEditorStylesPanel',
	(resolve) => (isOpen: boolean) => resolve(isOpen),
);

export const toggleEditorSettingsPanel = createAction(
	'slideShowEditor/toggleEditorSettingsPanel',
	(resolve) => (isOpen: boolean) => resolve(isOpen),
);

export const toggleEditorSocialPanel = createAction(
	'slideShowEditor/toggleEditorSocialPanel',
	(resolve) => (isOpen: boolean) => resolve(isOpen),
);

export const toggleEditorGridPanel = createAction(
	'slideShowEditor/toggleEditorGridPanel',
	(resolve) => (isOpen: boolean) => resolve(isOpen),
);

export const changeEditorTransparentElements = createAction(
	'slideShowEditor/changeEditorTransparentElements',
	(resolve) => (opacity: number) => resolve(opacity),
);

export const toggleEditorStickyElementEdges = createAction(
	'slideShowEditor/toggleEditorStickyElementEdges',
	(resolve) => (isEnabled: boolean) => resolve(isEnabled),
);

export const toggleEditorElementGuidelines = createAction(
	'slideShowEditor/toggleEditorElementGuidelines',
	(resolve) => (isEnabled: boolean) => resolve(isEnabled),
);

export const toggleEditorElementOutlines = createAction(
	'slideShowEditor/toggleEditorElementOutlines',
	(resolve) => (isEnabled: boolean) => resolve(isEnabled),
);

export const toggleRichTextEditor = createAction(
	'slideShowEditor/toggleRichTextEditor',
	(resolve) => (isEnabled: boolean) => resolve(isEnabled),
);

export const selectElementInEditMode = createAction(
	'slideShowEditor/selectElementInEditMode',
	(resolve) => (element?: ISlideElement) => resolve(element),
);

export const createSlideshowActions = createAsyncAction(
	'slideshowEditor/createSlideshow:request',
	'slideshowEditor/createSlideshow:success',
	'slideshowEditor/createSlideshow:failure',
)<void, void, void>();

export const createSlideshow = (groupId: string) => (dispatch: Dispatch) => {
	dispatch(createSlideshowActions.request());

	return Meteor.callAsync(methodNames.slideshow.create, groupId)
		.then((response) => {
			dispatch(createSlideshowActions.success());
			return response;
		})
		.catch((error) => {
			dispatch(createSlideshowActions.failure());
			throw error;
		});
};

export const updateSlideshowParamsActions = createAsyncAction(
	'slideshowEditor/updateSlideshowParams:request',
	'slideshowEditor/updateSlideshowParams:success',
	'slideshowEditor/updateSlideshowParams:failure',
)<ISlideshowParams, IUpdateSlideshowParamsSuccess, void>();

interface IUpdateSlideshowParamsSuccess {
	slideshow: ISlideshow;
	slideshowParams: IUpdateSlideshowParams;
}

export const updateSlideshowParams = (slideshow: ISlideshow, slideshowParams: ISlideshowParams) => (
	dispatch: Dispatch,
) => {
	dispatch(updateSlideshowParamsActions.request(slideshowParams));

	return Meteor.callAsync(methodNames.slideshow.updateSettings, slideshow._id, slideshowParams)
		.then((response) => {
			dispatch(updateSlideshowParamsActions.success({slideshow, slideshowParams}));
			return response;
		})
		.catch((error) => {
			dispatch(updateSlideshowParamsActions.failure());
			throw error;
		});
};

export const updateSlideshowParamsHistoryActions = createAsyncAction(
	'slideshowEditor/updateSlideshowParamsHistory:request',
	'slideshowEditor/updateSlideshowParamsHistory:success',
	'slideshowEditor/updateSlideshowParamsHistory:failure',
)<void, void, void>();

export const updateSlideshowParamsHistory = (
	slideshowId: string,
	slideshowParams: IUpdateSlideshowParams,
) => (dispatch: Dispatch) => {
	dispatch(updateSlideshowParamsHistoryActions.request());

	return Meteor.callAsync(methodNames.slideshow.updateSettings, slideshowId, slideshowParams)
		.then((response) => {
			dispatch(updateSlideshowParamsHistoryActions.success());
			return response;
		})
		.catch((error) => {
			dispatch(updateSlideshowParamsHistoryActions.failure());
			throw error;
		});
};

export const updateSlideshowStylesActions = createAsyncAction(
	'slideshowEditor/updateSlideshowStyles:request',
	'slideshowEditor/updateSlideshowStyles:success',
	'slideshowEditor/updateSlideshowStyles:failure',
)<ISlideshowStyles, IUpdateSlideshowStylesSuccess, void>();

interface IUpdateSlideshowStylesSuccess {
	slideshow: ISlideshow;
	slideshowStyles: IUpdateSlideshowStyles;
	applyForAllSlides?: boolean;
}

export const updateSlideshowStyles = (
	slideshow: ISlideshow,
	slideshowStyles: ISlideshowStyles,
	applyForAllSlides: boolean,
) => (dispatch: Dispatch) => {
	dispatch(updateSlideshowStylesActions.request(slideshowStyles));

	return Meteor.callAsync(
		methodNames.slideshow.updateStyles,
		slideshow._id,
		slideshowStyles,
		applyForAllSlides,
	)
		.then((response) => {
			dispatch(
				updateSlideshowStylesActions.success({
					slideshow,
					slideshowStyles,
					applyForAllSlides,
				}),
			);
			return response;
		})
		.catch((error) => {
			dispatch(updateSlideshowStylesActions.failure());
			throw error;
		});
};

export const updateSlideshowStylesHistoryActions = createAsyncAction(
	'slideshowEditor/updateSlideshowStylesHistory:request',
	'slideshowEditor/updateSlideshowStylesHistory:success',
	'slideshowEditor/updateSlideshowStylesHistory:failure',
)<IUpdateSlideElementParams, void, void>();

export const updateSlideshowStylesHistory = (
	slideshowId: string,
	slideshowParams: IUpdateSlideElementParams,
	applyForAllSlides?: boolean,
) => (dispatch: Dispatch) => {
	dispatch(updateSlideshowStylesHistoryActions.request(slideshowParams));

	return Meteor.callAsync(
		methodNames.slideshow.updateStyles,
		slideshowId,
		slideshowParams,
		applyForAllSlides,
	)
		.then((response) => {
			dispatch(updateSlideshowStylesHistoryActions.success());
			return response;
		})
		.catch((error) => {
			dispatch(updateSlideshowStylesHistoryActions.failure());
			throw error;
		});
};

export const updateElementStylesActions = createAsyncAction(
	'slideshowEditor/updateElementStyles:request',
	'slideshowEditor/updateElementStyles:success',
	'slideshowEditor/updateElementStyles:failure',
)<IUpdateSlideElementParams, IUpdateElementStylesSuccess, void>();

interface IUpdateElementStylesSuccess {
	element: ISlideElement;
	elementStyles: IUpdateSlideElementParams;
	applyForAllSlides?: boolean;
}

export const updateElementStyles = (
	element: ISlideElement,
	elementStyles: IUpdateSlideElementParams,
	applyForAllSlides?: boolean,
) => (dispatch: Dispatch) => {
	dispatch(updateElementStylesActions.request(elementStyles));

	return Meteor.callAsync(
		methodNames.slideshow.updateElementStyles,
		element._id,
		elementStyles,
		applyForAllSlides,
	)
		.then((response) => {
			dispatch(
				updateElementStylesActions.success({
					element,
					elementStyles,
					applyForAllSlides,
				}),
			);
			return response;
		})
		.catch((error) => {
			dispatch(updateElementStylesActions.failure());
			throw error;
		});
};

export const updateElementStylesHistoryActions = createAsyncAction(
	'slideshowEditor/updateElementStylesHistory:request',
	'slideshowEditor/updateElementStylesHistory:success',
	'slideshowEditor/updateElementStylesHistory:failure',
)<void, void, void>();

export const updateElementStylesHistory = (
	elementId: string,
	elementStyles: IUpdateSlideElementParams,
	applyForAllSlides?: boolean,
) => (dispatch: Dispatch) => {
	dispatch(updateElementStylesHistoryActions.request());

	return Meteor.callAsync(
		methodNames.slideshow.updateElementStyles,
		elementId,
		elementStyles,
		applyForAllSlides,
	)
		.then((response) => {
			dispatch(updateElementStylesHistoryActions.success());
			return response;
		})
		.catch((error) => {
			dispatch(updateElementStylesHistoryActions.failure());
			throw error;
		});
};

const addElementToSlideRequest = (slideId: string, elementType: SlideElementTypeEnum) => {
	return Meteor.callAsync<ISlideElement>(methodNames.slideshow.addElement, slideId, elementType);
};

export const addElementToSlideActions = createAsyncAction(
	'slideshowEditor/addElementToSlide:request',
	'slideshowEditor/addElementToSlide:success',
	'slideshowEditor/addElementToSlide:failure',
)<SlideElementTypeEnum, ISlideElement, void>();

export const addElementToSlide = (slideId: string, elementType: SlideElementTypeEnum) => (
	dispatch: Dispatch,
) => {
	dispatch(addElementToSlideActions.request(elementType));

	return addElementToSlideRequest(slideId, elementType)
		.then((newElement) => {
			dispatch(addElementToSlideActions.success(newElement));

			return newElement._id;
		})
		.catch((error) => {
			dispatch(addElementToSlideActions.failure());

			throw error;
		});
};

export const addElementToSlideHistoryActions = createAsyncAction(
	'slideshowEditor/addElementToSlideHistory:request',
	'slideshowEditor/addElementToSlideHistory:success',
	'slideshowEditor/addElementToSlideHistory:failure',
)<SlideElementTypeEnum, string, void>();

export const addElementToSlideHistory = (
	slideId: string,
	elementData: IUpdateSlideElementParams,
) => (dispatch: Dispatch, getState: any) => {
	const state: RootState = getState();
	const {actions} = state.slideshowActionHistory;

	if (!elementData.type) {
		return;
	}

	dispatch(addElementToSlideHistoryActions.request(elementData.type));

	return addElementToSlideRequest(slideId, elementData.type)
		.then((newElement) => {
			updateSlideElementById(newElement._id, elementData).then(() => {
				const newActions = actions.map((item) => {
					if (item.elementData && item.elementData._id === elementData._id) {
						item.elementData._id = newElement._id;
					}

					if (
						item.slideshowStylesData &&
						item.slideshowStylesData._id === elementData._id
					) {
						item.slideshowStylesData._id = newElement._id;
					}

					return item;
				});

				dispatch(replaceAction(newActions) as any);

				dispatch(updateElementStylesHistory(newElement._id, elementData) as any);

				dispatch(addElementToSlideHistoryActions.success(newElement._id));
			});

			return newElement._id;
		})
		.catch((error) => {
			dispatch(addElementToSlideHistoryActions.failure());
			throw error;
		});
};

export const addSlideActions = createAsyncAction(
	'slideshowEditor/addSlide:request',
	'slideshowEditor/addSlide:success',
	'slideshowEditor/addSlide:failure',
)<string, IAddSlideActionSuccess, void>();

interface IAddSlideActionSuccess {
	slideId: string;
	idOfPreviouslySelectedSlide?: string;
}

export const addSlide = (slideMockup?: string) => (dispatch: Dispatch, getState: any) => {
	const state: RootState = getState();
	const {slideshowId, selectedSlideId: idOfPreviouslySelectedSlide} = state.slideShowEditor;

	return Meteor.callAsync<ISlide>(methodNames.slideshow.createNewSlide, slideshowId, slideMockup)
		.then((newSlide) => {
			dispatch(addSlideActions.success({idOfPreviouslySelectedSlide, slideId: newSlide._id}));

			return newSlide;
		})
		.catch((error) => {
			dispatch(addSlideActions.failure());

			throw error;
		});
};

export const addSlideHistoryActions = createAsyncAction(
	'slideshowEditor/addSlideHistory:request',
	'slideshowEditor/addSlideHistory:success',
	'slideshowEditor/addSlideHistory:failure',
)<string, string, void>();

export const addSlideHistory = (
	slideshowId: string,
	slideData: IUpdateSlideParams,
	slideElements?: IUpdateSlideElementParams[],
	slideMockup?: string,
) => (dispatch: Dispatch, getState: any) => {
	const state: RootState = getState();
	const {actions} = state.slideshowActionHistory;

	return Meteor.callAsync<ISlide>(methodNames.slideshow.createNewSlide, slideshowId, slideMockup)
		.then((newSlide) => {
			dispatch(
				updateSlideStylesHistory(newSlide._id, {
					...(slideData.styles as IUpdateSlideshowStyles),
				}) as any,
			);
			dispatch(reorderSlideHistory(newSlide._id, slideData.position || 0) as any);

			if (slideElements) {
				slideElements.forEach((element: ISlideElement) => {
					dispatch(addElementToSlideHistory(newSlide._id, element) as any);
				});
			}

			let newActions = actions.map((item) => {
				if (!item.slideData) {
					return item;
				}

				if (item.slideData._id === slideData._id) {
					item.slideData._id = newSlide._id;

					if (item.slideElements) {
						item.slideElements = item.slideElements.map((element) => ({
							...element,
							slideId: newSlide._id,
						}));
					}
				}

				return item;
			});
			newActions = actions.map((item) => {
				if (!item.elementData) {
					return item;
				}

				if (item.elementData.slideId === slideData._id) {
					item.elementData.slideId = newSlide._id;
				}

				return item;
			});

			dispatch(replaceAction(newActions) as any);

			dispatch(addSlideHistoryActions.success(newSlide._id));

			return newSlide;
		})
		.catch((error) => {
			dispatch(addSlideHistoryActions.failure());
			throw error;
		});
};

export const dublicateSlideActions = createAsyncAction(
	'slideshowEditor/dublicateSlideActions:request',
	'slideshowEditor/dublicateSlideActions:success',
	'slideshowEditor/dublicateSlideActions:failure',
)<string, string, void>();

export const dublicateSlide = (slideId: string) => (dispatch: Dispatch, getState: any) => {
	const state: RootState = getState();
	const {slideshowId} = state.slideShowEditor;

	return Meteor.callAsync<string>(methodNames.slideshow.dublicateSlide, slideshowId, slideId)
		.then((newSlideId) => {
			dispatch(dublicateSlideActions.success(newSlideId));
			return newSlideId;
		})
		.catch((error) => {
			dispatch(dublicateSlideActions.failure());
			throw error;
		});
};

export const deleteSlideActions = createAsyncAction(
	'slideshowEditor/deleteSlide:request',
	'slideshowEditor/deleteSlide:success',
	'slideshowEditor/deleteSlide:failure',
)<string, IDeleteSlideSuccess, void>();

interface IDeleteSlideSuccess {
	slideData: IUpdateSlideParams;
	selectedSlideId?: string;
	slideElements: IUpdateSlideElementParams[];
}

export const deleteSlide = (slide: ISlide) => (dispatch: Dispatch, getState: any) => {
	const state: RootState = getState();
	const {slideshowId} = state.slideShowEditor;

	const slideElements = SlideElement.find({slideId: slide._id}).fetch();
	const prevSlide = Slide.findOne({slideshowId, position: slide.position - 1});
	const nextSlide = Slide.findOne({slideshowId, position: slide.position + 1});

	Meteor.callAsync<string>(methodNames.slideshow.deleteSlide, slideshowId, slide._id)
		.then(() => {
			dispatch(
				deleteSlideActions.success({
					slideElements,
					slideData: slide,
					selectedSlideId: prevSlide?._id || nextSlide?._id,
				}),
			);
		})
		.catch((error) => {
			dispatch(deleteSlideActions.failure());
			throw error;
		});
};

export const deleteSlideHistoryActions = createAsyncAction(
	'slideshowEditor/deleteSlideHistory:request',
	'slideshowEditor/deleteSlideHistory:success',
	'slideshowEditor/deleteSlideHistory:failure',
)<string, IDeleteSlideHistoryActionsSuccess, void>();

interface IDeleteSlideHistoryActionsSuccess {
	slideId: string;
	idOfPreviouslySelectedSlide?: string;
}

export const deleteSlideHistory = (slideId: string, idOfPreviouslySelectedSlide?: string) => (
	dispatch: Dispatch,
	getState: any,
) => {
	const state: RootState = getState();
	const {slideshowId} = state.slideShowEditor;

	Meteor.callAsync<string>(methodNames.slideshow.deleteSlide, slideshowId, slideId)
		.then(() => {
			dispatch(deleteSlideHistoryActions.success({slideId, idOfPreviouslySelectedSlide}));
		})
		.catch((error) => {
			dispatch(deleteSlideHistoryActions.failure());
			throw error;
		});
};

export const updateSlideStylesActions = createAsyncAction(
	'slideshowEditor/updateSlideStyles:request',
	'slideshowEditor/updateSlideStyles:success',
	'slideshowEditor/updateSlideStyles:failure',
)<string, IUpdateSlideStylesSuccess, void>();

interface IUpdateSlideStylesSuccess {
	slide: ISlide;
	slideData: IUpdateSlideParams;
}

export const updateSlideStyles = (slide: ISlide, slideData: IUpdateSlideParams) => (
	dispatch: Dispatch,
) => {
	dispatch(updateSlideStylesActions.request(slide._id));

	return Meteor.callAsync(methodNames.slideshow.updateSlideStyles, slide._id, slideData)
		.then(() => {
			dispatch(updateSlideStylesActions.success({slide, slideData}));
			return slide._id;
		})
		.catch((error) => {
			dispatch(updateSlideStylesActions.failure());
			throw error;
		});
};

export const updateSlideStylesHistoryActions = createAsyncAction(
	'slideshowEditor/updateSlideStylesHistory:request',
	'slideshowEditor/updateSlideStylesHistory:success',
	'slideshowEditor/updateSlideStylesHistory:failure',
)<string, string, void>();

export const updateSlideStylesHistory = (slideId: string, slideData: IUpdateSlideshowStyles) => (
	dispatch: Dispatch,
) => {
	dispatch(updateSlideStylesHistoryActions.request(slideId));

	return Meteor.callAsync(methodNames.slideshow.updateSlideStyles, slideId, slideData)
		.then(() => {
			dispatch(updateSlideStylesHistoryActions.success(slideId));
			return slideId;
		})
		.catch((error) => {
			dispatch(updateSlideStylesHistoryActions.failure());
			throw error;
		});
};

export const reorderSlideActions = createAsyncAction(
	'slideshowEditor/reorderSlide:request',
	'slideshowEditor/reorderSlide:success',
	'slideshowEditor/reorderSlide:failure',
)<string, IReorderSlideSuccess, void>();

interface IReorderSlideSuccess {
	slideId: string;
	slidePosition: number;
}

export const reorderSlide = (slide: ISlide, newPosition: number) => (
	dispatch: Dispatch,
	getState: any,
) => {
	const state: RootState = getState();
	const {slideshowId} = state.slideShowEditor;

	dispatch(reorderSlideActions.request(slideshowId));

	return Meteor.callAsync(
		methodNames.slideshow.reorderSlides,
		slideshowId,
		slide._id,
		newPosition,
	)
		.then(() => {
			dispatch(
				reorderSlideActions.success({slideId: slide._id, slidePosition: slide.position}),
			);
			return slide._id;
		})
		.catch((error) => {
			dispatch(reorderSlideActions.failure());
			throw error;
		});
};

export const reorderSlideHistoryActions = createAsyncAction(
	'slideshowEditor/reorderSlideHistory:request',
	'slideshowEditor/reorderSlideHistory:success',
	'slideshowEditor/reorderSlideHistory:failure',
)<void, void, void>();

export const reorderSlideHistory = (slideId: string, newPosition: number) => (
	dispatch: Dispatch,
	getState: any,
) => {
	const state: RootState = getState();
	const {slideshowId} = state.slideShowEditor;

	dispatch(reorderSlideHistoryActions.request());

	return Meteor.callAsync(methodNames.slideshow.reorderSlides, slideshowId, slideId, newPosition)
		.then(() => {
			dispatch(reorderSlideHistoryActions.success());
			return slideId;
		})
		.catch((error) => {
			dispatch(reorderSlideHistoryActions.failure());
			throw error;
		});
};

const updateSlideElementById = (elementId: string, elementData: IUpdateSlideElementParams) => {
	return Meteor.callAsync<string>(methodNames.slideshow.updateElement, elementId, elementData);
};

export const updateSlideElementActions = createAsyncAction(
	'slideshowEditor/updateSlideElement:request',
	'slideshowEditor/updateSlideElement:success',
	'slideshowEditor/updateSlideElement:failure',
)<string, IUpdateSlideElementSuccess, void>();

interface IUpdateSlideElementSuccess {
	element: ISlideElement;
	elementData: IUpdateSlideElementParams;
}

export const updateSlideElement = (
	element: ISlideElement,
	elementData: IUpdateSlideElementParams,
) => (dispatch: Dispatch) => {
	dispatch(updateSlideElementActions.request(element._id));
	updateSlideElementById(element._id, elementData)
		.then((newElementId: string) => {
			dispatch(updateSlideElementActions.success({element, elementData}));
			return newElementId;
		})
		.catch((error: Error) => {
			dispatch(updateSlideElementActions.failure());
			throw error;
		});
};

export const updateSlideElementHistoryActions = createAsyncAction(
	'slideshowEditor/updateSlideElementHistory:request',
	'slideshowEditor/updateSlideElementHistory:success',
	'slideshowEditor/updateSlideElementHistory:failure',
)<string, string, void>();

export const updateSlideElementHistory = (
	elementId: string,
	elementData: IUpdateSlideElementParams,
) => (dispatch: Dispatch) => {
	dispatch(updateSlideElementHistoryActions.request(elementId));

	updateSlideElementById(elementId, elementData)
		.then((newElementId: string) => {
			dispatch(updateSlideElementHistoryActions.success(newElementId));
			return newElementId;
		})
		.catch((error: Error) => {
			dispatch(updateSlideElementHistoryActions.failure());
			throw error;
		});
};

export const duplicateSlideElementActions = createAsyncAction(
	'slideshowEditor/duplicateSlideElement:request',
	'slideshowEditor/duplicateSlideElement:success',
	'slideshowEditor/duplicateSlideElement:failure',
)<void, string, void>();

export const duplicateSlideElement = (
	slideElement: IUpdateSlideElementParams,
	slideId?: string,
) => (dispatch: Dispatch, getState: any) => {
	const state: RootState = getState();
	const {slideshowId} = state.slideShowEditor;

	dispatch(duplicateSlideElementActions.request());

	return Meteor.callAsync<string>(
		methodNames.slideshow.duplicateElement,
		slideshowId,
		slideElement._id,
		slideId,
	)
		.then((elementId) => {
			dispatch(duplicateSlideElementActions.success(elementId));
		})
		.catch((error) => {
			dispatch(duplicateSlideElementActions.failure());
			throw error;
		});
};

const deleteSlideElementById = (elementId: string, state: RootState) => {
	const {slideshowId} = state.slideShowEditor;

	return Meteor.callAsync<void>(methodNames.slideshow.deleteElement, slideshowId, elementId);
};

export const deleteSlideElementActions = createAsyncAction(
	'slideshowEditor/deleteSlideElement:request',
	'slideshowEditor/deleteSlideElement:success',
	'slideshowEditor/deleteSlideElement:failure',
)<string, ISlideElement, void>();

export const deleteSlideElement = (slideElement: ISlideElement) => (
	dispatch: Dispatch,
	getState: any,
) => {
	const state: RootState = getState();

	dispatch(deleteSlideElementActions.request(slideElement._id));
	dispatch(deselectSlideElement());

	return deleteSlideElementById(slideElement._id, state)
		.then(() => {
			dispatch(deleteSlideElementActions.success(slideElement));
		})
		.catch((error) => {
			dispatch(deleteSlideElementActions.failure());
			throw error;
		});
};

export const deleteSlideElementHistoryActions = createAsyncAction(
	'slideshowEditor/deleteSlideElementHistory:request',
	'slideshowEditor/deleteSlideElementHistory:success',
	'slideshowEditor/deleteSlideElementHistory:failure',
)<void, void, void>();

export const deleteSlideElementHistory = (slideElementId: string) => (
	dispatch: Dispatch,
	getState: any,
) => {
	const state: RootState = getState();

	dispatch(deleteSlideElementHistoryActions.request());

	return deleteSlideElementById(slideElementId, state)
		.then(() => {
			dispatch(deleteSlideElementHistoryActions.success());
		})
		.catch((error) => {
			dispatch(deleteSlideElementHistoryActions.failure());
			throw error;
		});
};

export const setElementCopiedSlideElement = createAction(
	'slideShowEditor/setElementCopiedSlideElement',
	(resolve) => (slideElement: ISlideElement) => resolve(slideElement),
);
