import {ActionType, getType} from 'typesafe-actions';

import * as slideShowEditor from '../actions/slideShowEditor';
import {ISlideElement} from 'shared/collections/SlideElements';

export type SlideShowEditorAction = ActionType<typeof slideShowEditor>;

const storageNames = {
	isElementOutlinesEnabled: 'isElementOutlinesEnabled',
	isElementGuidelinesEnabled: 'isElementGuidelinesEnabled',
	isStickyElementEdges: 'isStickyElementEdges',
	transparentElements: 'transparentElements',
};

export class SlideShowEditorState {
	readonly slideshowId: string;
	readonly selectedElement?: ISlideElement;
	readonly selectedSlideId?: string;
	readonly isStylesPanelOpen?: boolean;
	readonly isSettingsPanelOpen?: boolean;
	readonly isSocialPanelOpen?: boolean;
	readonly isGridPanelOpen?: boolean;
	readonly transparentElements: number = !sessionStorage.getItem(storageNames.transparentElements)
		? 1
		: Number(sessionStorage.getItem(storageNames.transparentElements));
	readonly isStickyElementEdges?: boolean =
		sessionStorage.getItem(storageNames.isStickyElementEdges) !== 'false';
	readonly isElementGuidelinesEnabled?: boolean =
		sessionStorage.getItem(storageNames.isElementGuidelinesEnabled) !== 'false';
	readonly isElementOutlinesEnabled?: boolean =
		sessionStorage.getItem(storageNames.isElementOutlinesEnabled) !== 'false';
	readonly isRichTextEditorEnabled?: boolean = false;
	readonly elementInEditMode?: ISlideElement = undefined;
	readonly copiedSlideElement?: ISlideElement;
}

export default (state = new SlideShowEditorState(), action: SlideShowEditorAction) => {
	switch (action.type) {
		case getType(slideShowEditor.selectElementInEditMode):
			return {...state, elementInEditMode: action.payload};

		case getType(slideShowEditor.toggleEditorStylesPanel):
			return {
				...state,
				isStylesPanelOpen: action.payload,
				isSettingsPanelOpen: false,
				isGridPanelOpen: false,
				isSocialPanelOpen: false,
			};

		case getType(slideShowEditor.toggleEditorSettingsPanel):
			return {
				...state,
				isSettingsPanelOpen: action.payload,
				isStylesPanelOpen: false,
				isGridPanelOpen: false,
				isSocialPanelOpen: false,
			};

		case getType(slideShowEditor.toggleEditorSocialPanel):
			return {
				...state,
				isSocialPanelOpen: action.payload,
				isSettingsPanelOpen: false,
				isStylesPanelOpen: false,
				isGridPanelOpen: false,
			};

		case getType(slideShowEditor.toggleEditorGridPanel):
			return {
				...state,
				isGridPanelOpen: action.payload,
				isSettingsPanelOpen: false,
				isStylesPanelOpen: false,
				isSocialPanelOpen: false,
			};

		case getType(slideShowEditor.changeEditorTransparentElements):
			sessionStorage.setItem(storageNames.transparentElements, action.payload.toString());

			return {...state, transparentElements: action.payload};

		case getType(slideShowEditor.toggleEditorStickyElementEdges):
			sessionStorage.setItem(storageNames.isStickyElementEdges, action.payload.toString());

			return {...state, isStickyElementEdges: action.payload};

		case getType(slideShowEditor.toggleEditorElementGuidelines):
			sessionStorage.setItem(
				storageNames.isElementGuidelinesEnabled,
				action.payload.toString(),
			);

			return {...state, isElementGuidelinesEnabled: action.payload};

		case getType(slideShowEditor.toggleEditorElementOutlines):
			sessionStorage.setItem(
				storageNames.isElementOutlinesEnabled,
				action.payload.toString(),
			);

			return {...state, isElementOutlinesEnabled: action.payload};

		case getType(slideShowEditor.toggleRichTextEditor):
			return {...state, isRichTextEditorEnabled: action.payload};

		case getType(slideShowEditor.setSlideshowId):
			return {...state, slideshowId: action.payload};

		case getType(slideShowEditor.selectSlide):
		case getType(slideShowEditor.selectSlideHistory):
			return {
				...state,
				selectedSlideId: action.payload.slideId,
				selectedElement: undefined,
			};

		case getType(slideShowEditor.selectSlideElement):
			return {...state, selectedElement: action.payload};

		case getType(slideShowEditor.deselectSlideElement):
			return {...state, selectedElement: undefined, isRichTextEditorEnabled: false};

		case getType(slideShowEditor.addElementToSlideActions.success):
			return {...state, selectedElement: action.payload};

		case getType(slideShowEditor.addSlideActions.success):
			return {...state, selectedSlideId: action.payload.slideId, selectedElement: undefined};

		case getType(slideShowEditor.addSlideHistoryActions.success):
			return {...state, selectedSlideId: action.payload, selectedElement: undefined};

		case getType(slideShowEditor.deleteSlideActions.success):
			return {
				...state,
				selectedSlideId: action.payload.selectedSlideId,
				selectedElement: undefined,
			};

		case getType(slideShowEditor.deleteSlideHistoryActions.success):
			return {
				...state,
				selectedSlideId: action.payload.idOfPreviouslySelectedSlide,
				selectedElement: undefined,
			};

		case getType(slideShowEditor.deleteSlideElementHistoryActions.success):
			return {
				...state,
				selectedElement: undefined,
			};

		case getType(slideShowEditor.setElementCopiedSlideElement):
			return {...state, copiedSlideElement: action.payload};

		default:
			return state;
	}
};
