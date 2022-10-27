import {ActionType, getType} from 'typesafe-actions';
import keys from 'lodash/keys';
import pick from 'lodash/pick';

import * as slideShowEditor from '../actions/slideShowEditor';
import * as slideshowActionHistory from '../actions/slideshowActionHistory';
import {SlideShowEditorAction} from '../reducers/slideShowEditor';
import {
	IUpdateSlideElementParams,
	IUpdateSlideParams,
	IUpdateSlideshowParams,
	IUpdateSlideshowStyles,
} from 'shared/models/SlideshowMethodParams';
import {replaceUndefinedFields} from 'shared/utils/methods';

export type SlideshowActionHistoryAction =
	| ActionType<typeof slideshowActionHistory>
	| SlideShowEditorAction;

export class SlideshowActionHistoryState {
	readonly slideshowId: string;
	readonly actions: ISlideshowAction[] = [];
}

interface IUpdateSlideshowStylesAction extends IUpdateSlideshowStyles {
	_id: string;
	applyForAllSlides?: boolean;
}

export interface ISlideshowAction {
	type: SlideshowActionType;
	slideshowParamsData?: IUpdateSlideshowParams;
	slideshowStylesData?: IUpdateSlideshowStylesAction;
	slideData?: IUpdateSlideParams;
	slideStyleData?: IUpdateSlideshowStylesAction;
	slideElements?: IUpdateSlideElementParams[];
	slidePosition?: number;
	idOfPreviouslySelectedSlide?: string;
	elementData?: IUpdateSlideElementParams;
	isNotSaveToHistory?: boolean;
}

export enum SlideshowActionType {
	EDIT_SLIDESHOW_PARAMS,
	EDIT_SLIDESHOW_STYLES,
	SELECT_SLIDE,
	ADD_SLIDE,
	EDIT_SLIDE,
	DELETE_SLIDE,
	DUBLICATE_SLIDE,
	REORDER_SLIDE,
	ADD_ELEMENT,
	EDIT_ELEMENT,
	EDIT_ELEMENT_STYLE,
	DELETE_ELEMENT,
	DUBLICATE_ELEMENT,
}

const MAX_HISTORY_ITEMS = 100;

export default (
	state = new SlideshowActionHistoryState(),
	action: SlideshowActionHistoryAction,
) => {
	switch (action.type) {
		case getType(slideshowActionHistory.undoLastActionActions.request):
			return {...state, actions: state.actions.slice(1)};

		case getType(slideshowActionHistory.replaceActionActions.success):
			return {...state, actions: action.payload};

		case getType(slideShowEditor.selectSlide):
			if (action.payload.isNotSaveToHistory) {
				return state;
			}

			return {
				...state,
				actions: [
					{
						type: SlideshowActionType.SELECT_SLIDE,
						slideData: {_id: action.payload.oldSlideId},
					},
					...state.actions,
				],
			};

		case getType(slideShowEditor.updateSlideshowParamsActions.success):
			return {
				...state,
				actions: [
					{
						type: SlideshowActionType.EDIT_SLIDESHOW_PARAMS,
						slideshowParamsData: {
							...replaceUndefinedFields(
								pick(
									action.payload.slideshow,
									keys(action.payload.slideshowParams),
								),
							),
							_id: action.payload.slideshow._id,
						},
					},
					...state.actions,
				].slice(0, MAX_HISTORY_ITEMS),
			};

		case getType(slideShowEditor.updateSlideshowStylesActions.success):
			return {
				...state,
				actions: [
					{
						type: SlideshowActionType.EDIT_SLIDESHOW_STYLES,
						slideshowStylesData: {
							...replaceUndefinedFields(
								pick(
									action.payload.slideshow.styles,
									keys(action.payload.slideshowStyles),
								),
							),
							applyForAllSlides: action.payload.applyForAllSlides,
							_id: action.payload.slideshow._id,
						},
					},
					...state.actions,
				].slice(0, MAX_HISTORY_ITEMS),
			};

		case getType(slideShowEditor.updateSlideStylesActions.success):
			return {
				...state,
				actions: [
					{
						type: SlideshowActionType.EDIT_SLIDE,
						slideStyleData: {
							...replaceUndefinedFields(
								pick(
									action.payload.slide.styles,
									keys(action.payload.slide.styles),
								),
							),
							_id: action.payload.slide._id,
						},
					},
					...state.actions,
				].slice(0, MAX_HISTORY_ITEMS),
			};

		case getType(slideShowEditor.updateElementStylesActions.success):
			return {
				...state,
				actions: [
					{
						type: SlideshowActionType.EDIT_ELEMENT_STYLE,
						slideshowStylesData: {
							...replaceUndefinedFields(
								pick(action.payload.element, keys(action.payload.element)),
							),
							applyForAllSlides: action.payload.applyForAllSlides,
							_id: action.payload.element._id,
						},
					},
					...state.actions,
				].slice(0, MAX_HISTORY_ITEMS),
			};

		case getType(slideShowEditor.addSlideActions.success):
			return {
				...state,
				actions: [
					{
						type: SlideshowActionType.ADD_SLIDE,
						slideData: {_id: action.payload.slideId},
						idOfPreviouslySelectedSlide: action.payload.idOfPreviouslySelectedSlide,
					},
					...state.actions,
				].slice(0, MAX_HISTORY_ITEMS),
			};

		case getType(slideShowEditor.dublicateSlideActions.success):
			return {
				...state,
				actions: [
					{
						type: SlideshowActionType.DUBLICATE_SLIDE,
						slideData: {_id: action.payload},
					},
					...state.actions,
				].slice(0, MAX_HISTORY_ITEMS),
			};

		case getType(slideShowEditor.reorderSlideActions.success):
			return {
				...state,
				actions: [
					{
						type: SlideshowActionType.REORDER_SLIDE,
						slideData: {_id: action.payload.slideId},
						slidePosition: action.payload.slidePosition,
					},
					...state.actions,
				].slice(0, MAX_HISTORY_ITEMS),
			};

		case getType(slideShowEditor.deleteSlideActions.success):
			return {
				...state,
				actions: [
					{
						type: SlideshowActionType.DELETE_SLIDE,
						slideData: {...action.payload.slideData},
						slideElements: action.payload.slideElements.map((element) =>
							pick(element, keys(element)),
						),
					},
					...state.actions,
				].slice(0, MAX_HISTORY_ITEMS),
			};

		case getType(slideShowEditor.updateSlideElementActions.success):
			return {
				...state,
				actions: [
					{
						type: SlideshowActionType.EDIT_ELEMENT,
						elementData: {
							...replaceUndefinedFields(
								pick(action.payload.element, keys(action.payload.elementData)),
							),
							_id: action.payload.element._id,
						},
					},
					...state.actions,
				].slice(0, MAX_HISTORY_ITEMS),
			};

		case getType(slideShowEditor.addElementToSlideActions.success):
			return {
				...state,
				actions: [
					{
						type: SlideshowActionType.ADD_ELEMENT,
						elementData: {_id: action.payload._id},
					},
					...state.actions,
				].slice(0, MAX_HISTORY_ITEMS),
			};

		case getType(slideShowEditor.deleteSlideElementActions.success):
			return {
				...state,
				actions: [
					{
						type: SlideshowActionType.DELETE_ELEMENT,
						elementData: {...action.payload},
					},
					...state.actions,
				].slice(0, MAX_HISTORY_ITEMS),
			};

		case getType(slideShowEditor.duplicateSlideElementActions.success):
			return {
				...state,
				actions: [
					{
						type: SlideshowActionType.DUBLICATE_ELEMENT,
						elementData: {_id: action.payload},
					},
					...state.actions,
				].slice(0, MAX_HISTORY_ITEMS),
			};

		default:
			return state;
	}
};
