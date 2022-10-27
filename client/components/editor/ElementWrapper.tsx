import React, {useState, useEffect, useRef} from 'react';
import cn from 'classnames';
import {connect} from 'react-redux';
import {Portal} from 'react-portal';
import Moveable, {OnDrag, OnResize, OnRotate, OnWarp} from 'react-moveable';
import {Frame} from 'scenejs';

import {
	ISlideElement,
	ISlideElementAdditionalFonts,
	SlideElementTypeEnum,
	ISlideElementAnimation,
} from 'shared/collections/SlideElements';
import {ISlideshow} from 'shared/collections/Slideshows';
import {
	selectSlideElement,
	deselectSlideElement,
	updateSlideElement,
	toggleRichTextEditor,
	selectElementInEditMode,
} from '../../actions/slideShowEditor';
import ElementFactory from 'client/components/editor/ElementFactory';
import {RootState} from 'client/store/root-reducer';
import {getInitialStyles, getPermanentZIndex} from 'client/utils/slides';
// @ts-ignore
import css from './SlideViewport.pcss';
import Menu from '@material-ui/core/Menu';
import {MenuItem} from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import AddHrefToElementModal from 'client/components/editor/modals/AddHrefToElementModal';
import ElementSettingsModal from 'client/components/editor/modals/ElementSettingsModal';
import ElementAnimationModal from 'client/components/editor/modals/ElementAnimationModal';
import {IUpdateElementStyles, IUpdateElementAnimation} from 'shared/models/SlideshowMethodParams';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import AddStatIdToElementModal from 'client/components/editor/modals/AddStatIdToElementModal';
import LockIcon from 'client/components/common/icons/LockIcon';

interface IElementWrapperProps {
	element: ISlideElement;
	elements: ISlideElement[];
	isSelected: boolean;
	scale: number;
	isRichTextEditorEnabled?: boolean;
	updateSlideElement: typeof updateSlideElement;
	selectSlideElement: typeof selectSlideElement;
	deselectSlideElement: typeof deselectSlideElement;
	toggleRichTextEditor: typeof toggleRichTextEditor;
	transparentElements: number;
	elementInEditMode?: ISlideElement;
	selectElementInEditMode: typeof selectElementInEditMode;
	selectedElement?: ISlideElement;
	isStickyElementEdges: boolean;
	isElementGuidelinesEnabled: boolean;
	isElementOutlinesEnabled: boolean;
	isStatisticsGranted?: boolean;
}

interface IElementWrapperData {
	element: ISlideElement & ISlideElementAdditionalFonts;
	elements: ISlideElement[];
	slideshow: ISlideshow;
}

const SMALL_MENU_OFFSET = 4;

const ElementWrapper: React.FC<IElementWrapperProps & IElementWrapperData> = (props) => {
	const {
		element,
		elements,
		slideshow,
		isSelected,
		scale,
		isRichTextEditorEnabled,
		transparentElements,
		elementInEditMode,
		selectedElement,
		isStickyElementEdges,
		isElementOutlinesEnabled,
		isElementGuidelinesEnabled,
		isStatisticsGranted,
	} = props;
	const elementRef = useRef<HTMLDivElement>(null);
	const [isDrag, setDrag] = useState(false);
	const [warpMode, setWarpMode] = useState(false);
	const [scaleMode, setScaleMode] = useState(false);
	const moveableRef = useRef<Moveable | null>(null);
	const [frame, setFrame] = useState<Frame | null>(null);
	const [target, setTarget] = useState<HTMLDivElement | null>(null);
	const [elementGuidelines, setElementGuidelines] = useState<Element[]>([]);
	const [isAddHrefModalOpen, setIsAddHrefModalOpen] = useState<boolean | null>(false);
	const [isElementSettingsModalOpen, setIsElementSettingsModalOpen] = useState<boolean | null>(
		false,
	);
	const [isElementAnimationModalOpen, setIsElementAnimationModalOpen] = useState<boolean | null>(
		false,
	);
	const [isCustomContextMenuDisabled, setIsCustomContextMenuDisabled] = useState(false);

	const scaleResizeDelta = useRef<{width: number; height: number}>({width: 0, height: 0});

	const [mousePosition, setMousePosition] = useState<number[] | null>(null);
	const [isAddStatIdModalOpen, setIsAddStatIdModalOpen] = useState<boolean | null>(false);

	const {permanentPosition, permanent} = element;

	const updateElementOpacity = () => {
		if (slideshow.isGridBlockEnabled) {
			frame?.set('opacity', transparentElements);
		} else {
			frame?.set('opacity', 1);
		}

		setTransform();
		handleMoveableUpdateRect();
	};

	const updateElementZIndex = () => {
		if (permanent) {
			frame?.set('zIndex', getPermanentZIndex(permanentPosition));
		} else {
			frame?.set('zIndex', element.zIndex);
		}

		setTransform();
		handleMoveableUpdateRect();
	};

	useEffect(() => {
		updateElementOpacity();
	}, [slideshow.isGridBlockEnabled, transparentElements, frame]);

	useEffect(() => {
		updateElementZIndex();
	}, [permanentPosition, permanent, frame, element.zIndex]);

	const handleMoveableUpdateRect = () => {
		moveableRef?.current?.updateRect();
	};

	useEffect(() => {
		window.addEventListener('resize', handleMoveableUpdateRect);

		setTarget(document.querySelector(`.element-${element._id}`) as HTMLDivElement);

		setFrame(new Frame(getInitialStyles(element)));

		setTimeout(() => {
			// TODO: решить как можно отрендерить направояющие при загрузке без таймаута
			setTransform();
			handleMoveableUpdateRect();
			updateGuidelines();
		}, 500);

		return () => {
			window.removeEventListener('resize', handleMoveableUpdateRect);
		};
	}, []);

	useEffect(() => {
		const newStyles = getInitialStyles(element);
		const alreadySetStyles: string[] = [];

		frame?.getNames()?.forEach(([styleName]) => {
			if (newStyles[styleName]) {
				frame?.set(styleName, newStyles[styleName]);
				alreadySetStyles.push(styleName);
			} else frame?.remove(styleName);
		});

		Object.keys(newStyles)
			.filter((styleName) => alreadySetStyles.indexOf(styleName) === -1)
			.forEach((styleName) => {
				frame?.set(styleName, newStyles[styleName]);
			});

		setTransform();
		handleMoveableUpdateRect();
	}, [element]);

	const updateGuidelines = () => {
		const elementItems: Element[] = [];

		document.querySelectorAll('.element')?.forEach((el) => {
			if (el.id === `element-${element._id}`) {
				return;
			}

			elementItems.push(el);
		});

		setElementGuidelines(elementItems);
	};

	useEffect(() => {
		updateGuidelines();
	}, [elements]);

	useEffect(() => {
		if (isSelected) {
			return;
		}
		props.selectElementInEditMode(undefined);
		setMousePosition(null);
	}, [isSelected]);

	const setSelected = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();
		if (!props.isSelected) {
			props.selectSlideElement(element);
		}

		if (props.isRichTextEditorEnabled && element.type !== SlideElementTypeEnum.TEXT) {
			props.toggleRichTextEditor(false);
		}
	};

	const handleDoubleClick = () => {
		if (!props.isRichTextEditorEnabled && element.type === SlideElementTypeEnum.TEXT) {
			props.toggleRichTextEditor(true);
		}

		if (
			elementInEditMode?._id === element._id ||
			element.type !== SlideElementTypeEnum.AIR_QUALITY
		) {
			return;
		}

		props.selectElementInEditMode(element);
	};

	const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.stopPropagation();
		event.preventDefault();
		if (isSelected && elementRef?.current?.contains(event.target as HTMLElement)) {
			setMousePosition([
				event.clientY - SMALL_MENU_OFFSET,
				event.clientX - SMALL_MENU_OFFSET,
			]);
		}
	};
	const handleClose = () => {
		setMousePosition(null);
	};

	const setHref = (href?: string | null) => {
		handleClose();
		props.updateSlideElement(element, {href});
	};

	const setStyles = (data: IUpdateElementStyles) => {
		handleClose();
		props.updateSlideElement(element, {...data});
	};

	const setAnimation = (data: IUpdateElementAnimation) => {
		handleClose();
		props.updateSlideElement(element, {...data});
	};
	const unsetHref = () => {
		setHref(null);
	};

	const closeElementSettingsModalOpen = () => {
		setIsElementSettingsModalOpen(false);
	};

	const openElementSettingsModalOpen = () => {
		setIsElementSettingsModalOpen(true);
	};

	const openElementAnimationModalOpen = () => {
		setIsElementAnimationModalOpen(true);
	};

	const closeElementAnimationModalOpen = () => {
		setIsElementAnimationModalOpen(false);
	};

	const closeAddHrefModalOpen = () => {
		setIsAddHrefModalOpen(false);
	};
	const setIsAddHrefModalOpen_ = () => {
		setIsAddHrefModalOpen(true);
	};

	const handleCollectStat = (collectStat: boolean) => {
		handleClose();
		props.updateSlideElement(element, {collectStat});
	};
	const setHandleCollectStat = () => {
		handleCollectStat(true);
	};
	const unsetHandleCollectStat = () => {
		handleCollectStat(false);
	};

	const setStatisticId = (statisticId?: string) => {
		handleClose();
		props.updateSlideElement(element, {statisticId});
	};
	const unsetStatisticId = () => {
		setStatisticId(null);
	};

	const toggleWarpMode = () => {
		if (scaleMode) setScaleMode(false);
		setWarpMode(!warpMode);
		handleClose();
	};

	const toggleScaleMode = () => {
		if (warpMode) setWarpMode(false);
		setScaleMode(!scaleMode);
		handleClose();
	};

	const closeAddStatIdModalOpen = () => {
		setIsAddStatIdModalOpen(false);
	};
	const setIsAddStatIdModalOpen_ = () => {
		setIsAddStatIdModalOpen(true);
	};

	const viewOverlay = () => {
		if (
			element.type === SlideElementTypeEnum.TEXT ||
			(elementInEditMode?._id === element._id &&
				element.type === SlideElementTypeEnum.AIR_QUALITY)
		) {
			return;
		}

		return <div className={css.overlay} />;
	};

	const viewNotif = () => {
		if (
			selectedElement?._id !== element._id ||
			element.type !== SlideElementTypeEnum.AIR_QUALITY
		) {
			return;
		}

		return (
			<Portal>
				<div
					className={cn(css.editNotif, {
						[css.isHidden]: isDrag,
						[css.isEdit]: elementInEditMode?._id === element._id,
					})}
					style={{
						top:
							(elementRef?.current?.getBoundingClientRect().top || 0) +
							(elementRef?.current?.getBoundingClientRect().height || 0),
						left: elementRef?.current?.getBoundingClientRect().left,
					}}
				>
					{elementInEditMode?._id === element._id
						? 'Редактирование'
						: 'Кликните дважды для редактирования'}
				</div>
			</Portal>
		);
	};

	const setTransform = () => {
		if (!frame || !target) {
			return;
		}
		Object.assign(target.style, frame.toCSSObject());
	};

	const onDrag = ({top, left}: OnDrag) => {
		frame?.set('left', `${left}px`);
		frame?.set('top', `${top}px`);

		setTransform();
	};

	const onResize = ({width, height}: OnResize) => {
		frame?.set('width', `${width}px`);
		frame?.set('height', `${height}px`);

		setTransform();
	};

	const handleDragStop = () => {
		const top = Number(frame?.get('top').replace('px', ''));
		const left = Number(frame?.get('left').replace('px', ''));

		if (top !== element.top || left !== element.left) {
			props.updateSlideElement(element, {top, left});
		}

		setDrag(false);
	};

	const handleDragStart = () => {
		setDrag(true);
	};

	const handleResizeStop = () => {
		const width = Number(frame?.get('width').replace('px', ''));
		const height = Number(frame?.get('height').replace('px', ''));

		props.updateSlideElement(element, {width, height});
	};

	const onRotateStart = (e: any) => {
		const currentRotateAngle = Number(
			frame?.get('transform', 'rotate')?.replace('deg', '') ?? 0,
		);
		if (currentRotateAngle) e.set(currentRotateAngle);
	};

	const onRotate = ({beforeRotate}: OnRotate) => {
		const rotateStep = element?.rotateStep ?? 1;
		const rotateAngle = Number(frame?.get('transform', 'rotate')?.replace('deg', '') ?? 0);

		if (Math.abs(beforeRotate - rotateAngle) < rotateStep) return;

		frame?.set(
			'transform',
			'rotate',
			`${Math.trunc(beforeRotate / rotateStep) * rotateStep}deg`,
		);

		setTransform();
	};

	const onRotateEnd = () => {
		const rotateAngle = Number(frame?.get('transform', 'rotate').replace('deg', ''));

		props.updateSlideElement(element, {rotateAngle});
	};

	const onWarpStart = (e: any) => {
		const warpMatrix = frame?.get('transform', 'matrix3d');
		if (warpMatrix) e.set(warpMatrix.split(',').map((v: string) => Number(v)));
	};

	const onWarp = ({matrix}: OnWarp) => {
		frame?.set('transform', 'matrix3d', matrix.join(','));

		setTransform();
	};

	const onWarpEnd = ({matrix}: OnWarp) => {
		const warpMatrix = frame
			?.get('transform', 'matrix3d')
			.split(',')
			.map((v: string) => Number(v));

		props.updateSlideElement(element, {warpMatrix});
	};

	const onScaleStart = () => {
		if (element.scale) {
			scaleResizeDelta.current.width = element.width * element.scale[0] - element.width;
			scaleResizeDelta.current.height = element.height * element.scale[1] - element.height;
		}
	};

	const onScale = ({delta}: OnResize) => {
		const width = element.width + scaleResizeDelta.current.width + delta[0];
		const height = element.height + scaleResizeDelta.current.height + delta[1];

		const xScale = width / element.width;
		const yScale = height / element.height;

		frame?.set('transform', 'matrix', `${xScale}, 0, 0, ${yScale}, 0, 0`);

		scaleResizeDelta.current.width += delta[0];
		scaleResizeDelta.current.height += delta[1];

		setTransform();
	};

	const onScaleEnd = () => {
		const width = element.width + scaleResizeDelta.current.width;
		const height = element.height + scaleResizeDelta.current.height;

		const xScale = width / element.width;
		const yScale = height / element.height;

		scaleResizeDelta.current.width = 0;
		scaleResizeDelta.current.height = 0;

		props.updateSlideElement(element, {scale: [xScale, yScale]});
	};

	const isDisabled = isRichTextEditorEnabled || !!elementInEditMode;
	const snapTrashold = 10;
	element.additionalFonts = slideshow.additionalFonts?.map((f) => f.name);
	return (
		<>
			<Moveable
				ref={moveableRef}
				target={target}
				className={cn(css.moveable, {
					[css.isSelected]: isElementOutlinesEnabled || isSelected,
					[css.isElementGuidelinesEnabled]: isElementGuidelinesEnabled,
				})}
				container={target?.parentElement}
				// edge={true}
				renderDirections={isDisabled || !isSelected ? [] : undefined}
				draggable={!isDisabled}
				resizable={!isDisabled && !warpMode}
				rotatable={!isDisabled && isSelected}
				warpable={!isDisabled && warpMode && isSelected}
				snappable
				snapCenter
				snapThreshold={isStickyElementEdges ? snapTrashold : 0}
				zoom={1 + (1 - scale)}
				elementGuidelines={elementGuidelines}
				origin={false}
				throttleDrag={1}
				throttleResize={1}
				keepRatio={element.retainAspectRatio}
				bounds={{
					top: 0,
					left: 0,
					right: target?.parentElement?.clientWidth,
					bottom: target?.parentElement?.clientHeight,
				}}
				onDrag={onDrag}
				onResizeStart={scaleMode ? onScaleStart : () => {}}
				onResize={scaleMode ? onScale : onResize}
				onDragEnd={handleDragStop}
				onResizeEnd={scaleMode ? onScaleEnd : handleResizeStop}
				onDragStart={handleDragStart}
				onRotateStart={onRotateStart}
				onRotate={onRotate}
				onRotateEnd={onRotateEnd}
				onWarp={onWarp}
				onWarpStart={onWarpStart}
				onWarpEnd={onWarpEnd}
			/>

			<div
				id={`element-${element._id}`}
				className={cn(`element element-${element._id}`, css.element, {
					[css.isSelected]: isSelected,
				})}
				ref={elementRef}
				onDoubleClick={handleDoubleClick}
				onMouseDown={setSelected}
				onContextMenu={handleClick}
				//TODO вообще то этот стиль практически сразу перезаписывается в конструкторе Frame - new Frame(
				// и далее через setTransform,
				// точнее он перезаписывается через target.style.cssText = frame.toCSS()
				// style={{
				// 	zIndex: element.zIndex,
				// }}
			>
				{viewNotif()}

				{viewOverlay()}

				<ElementFactory
					element={element}
					editorMode
					isSelected={selectedElement?._id === element._id}
					scale={scale}
					disableCustomContextMenu={() => setIsCustomContextMenuDisabled(true)}
					enableCustomContextMenu={() => setIsCustomContextMenuDisabled(false)}
				/>
			</div>
			{element.collectStat && !isDrag && (
				<EqualizerIcon
					titleAccess={'рекламный элемент'}
					style={{
						fontSize: 54,
						position: 'absolute',
						left: element.left - 54,
						top: element.top,
						opacity: 0.4,
					}}
				/>
			)}
			{element.collectStat && element.statisticId && !isDrag && (
				<FingerprintIcon
					titleAccess={`Идентификатор элемента для рекламной компании: ${element.statisticId}`}
					style={{
						fontSize: 54,
						position: 'absolute',
						left: element.left - 54,
						top: element.top + 54,
						opacity: 0.4,
					}}
				/>
			)}
			{element.href && !isDrag && (
				<LinkIcon
					titleAccess={`Кликабельный элемент: ${element.href}`}
					style={{
						fontSize: 54,
						position: 'absolute',
						left: element.left - 54,
						top: element.top - 54,
						opacity: 0.4,
					}}
				/>
			)}
			<Menu
				keepMounted
				open={isCustomContextMenuDisabled ? false : mousePosition !== null}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={
					mousePosition ? {top: mousePosition[0], left: mousePosition[1]} : undefined
				}
			>
				{!element.href && (
					<MenuItem onClick={setIsAddHrefModalOpen_}>
						Сделать кликабельным элементом
					</MenuItem>
				)}
				{element.href && <MenuItem onClick={unsetHref}>Убрать кликабельность</MenuItem>}
				<MenuItem onClick={openElementSettingsModalOpen}>Настройки стиля элемента</MenuItem>
				<MenuItem onClick={openElementAnimationModalOpen}>
					Настройки анимации элемента
				</MenuItem>
				{!element.collectStat && (
					<MenuItem onClick={setHandleCollectStat} disabled={!isStatisticsGranted}>
						Сделать рекламным элементом
						{!isStatisticsGranted && (
							<LockIcon
								viewBox="0 0 11 14"
								style={{width: '11px', height: '14px'}}
								fill="none"
								pathProps={{
									fill: '#3f51b5',
									fillOpacity: '0.54',
								}}
							/>
						)}
					</MenuItem>
				)}
				{element.collectStat && (
					<MenuItem onClick={unsetHandleCollectStat} disabled={!isStatisticsGranted}>
						Убрать рекламный статус
						{!isStatisticsGranted && (
							<LockIcon
								viewBox="0 0 11 14"
								style={{width: '11px', height: '14px'}}
								fill="none"
								pathProps={{
									fill: '#3f51b5',
									fillOpacity: '0.54',
								}}
							/>
						)}
					</MenuItem>
				)}
				{element.collectStat && !element.statisticId && (
					<MenuItem onClick={setIsAddStatIdModalOpen_} disabled={!isStatisticsGranted}>
						Задать идентификатор элемента для рекламной компании
						{!isStatisticsGranted && (
							<LockIcon
								viewBox="0 0 11 14"
								style={{width: '11px', height: '14px'}}
								fill="none"
								pathProps={{
									fill: '#3f51b5',
									fillOpacity: '0.54',
								}}
							/>
						)}
					</MenuItem>
				)}
				{element.collectStat && element.statisticId && (
					<MenuItem onClick={unsetStatisticId} disabled={!isStatisticsGranted}>
						Убрать идентификатор элемента для рекламной компании
						{!isStatisticsGranted && (
							<LockIcon
								viewBox="0 0 11 14"
								style={{width: '11px', height: '14px'}}
								fill="none"
								pathProps={{
									fill: '#3f51b5',
									fillOpacity: '0.54',
								}}
							/>
						)}
					</MenuItem>
				)}
				<MenuItem onClick={toggleWarpMode}>
					{warpMode
						? 'Выключить режим работы с переспективой'
						: 'Включить режим работы с переспективой'}
				</MenuItem>
				<MenuItem onClick={toggleScaleMode}>
					{scaleMode
						? 'Выключить режим масштабирования'
						: 'Включить режим масштабирования'}
				</MenuItem>
			</Menu>
			<AddHrefToElementModal
				isOpen={isAddHrefModalOpen || false}
				onClose={closeAddHrefModalOpen}
				onSubmit={setHref}
			/>
			<ElementSettingsModal
				isOpen={isElementSettingsModalOpen || false}
				onClose={closeElementSettingsModalOpen}
				element={element}
				onSubmit={setStyles}
			/>
			<ElementAnimationModal
				isOpen={isElementAnimationModalOpen || false}
				onClose={closeElementAnimationModalOpen}
				element={element}
				onSubmit={setAnimation}
			/>
			<AddStatIdToElementModal
				isOpen={isAddStatIdModalOpen || false}
				onClose={closeAddStatIdModalOpen}
				onSubmit={setStatisticId}
			/>
		</>
	);
};

export default connect(
	(state: RootState) => ({
		isRichTextEditorEnabled: state.slideShowEditor.isRichTextEditorEnabled,
		transparentElements: state.slideShowEditor.transparentElements,
		elementInEditMode: state.slideShowEditor.elementInEditMode,
		selectedElement: state.slideShowEditor.selectedElement,
		isStickyElementEdges: state.slideShowEditor.isStickyElementEdges,
		isElementGuidelinesEnabled: state.slideShowEditor.isElementGuidelinesEnabled,
		isElementOutlinesEnabled: state.slideShowEditor.isElementOutlinesEnabled,
	}),
	{
		selectSlideElement,
		deselectSlideElement,
		updateSlideElement,
		toggleRichTextEditor,
		selectElementInEditMode,
	},
)(React.memo(ElementWrapper));
