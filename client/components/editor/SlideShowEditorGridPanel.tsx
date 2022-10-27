import * as React from 'react';
import {connect} from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button/Button';

import SlideShowBasePanel from './SlideShowBasePanel';
import {
	updateSlideshowParams,
	changeEditorTransparentElements,
	toggleEditorStickyElementEdges,
	toggleEditorElementOutlines,
	toggleEditorElementGuidelines,
} from 'client/actions/slideShowEditor';
import Slider from 'client/components/editor/sidebarPanelUI/Slider';
import {RootState} from 'client/store/root-reducer';
import Switch from 'client/components/editor/sidebarPanelUI/Switch';
import {ISlideshow} from 'shared/collections/Slideshows';

interface ISlideShowEditorGridPanel {
	isOpen: boolean;
	onClose?: () => void;
	transparentElements: number;
	changeEditorTransparentElements: typeof changeEditorTransparentElements;
	isStickyElementEdges: boolean;
	toggleEditorStickyElementEdges: typeof toggleEditorStickyElementEdges;
	toggleEditorElementGuidelines: typeof toggleEditorElementGuidelines;
	toggleEditorElementOutlines: typeof toggleEditorElementOutlines;
	isElementGuidelinesEnabled: boolean;
	isElementOutlinesEnabled: boolean;
	updateSlideshowParams: typeof updateSlideshowParams;
	slideshow: ISlideshow;
}

const SlideShowEditorGridPanel: React.FC<ISlideShowEditorGridPanel> = (props) => {
	const {
		isOpen,
		onClose,
		transparentElements,
		isStickyElementEdges,
		isElementGuidelinesEnabled,
		isElementOutlinesEnabled,
		slideshow,
	} = props;

	const sliderStep = 0.01;

	const changeTransparentElements = (e: React.ChangeEvent<HTMLElement>, val: number) => {
		props.changeEditorTransparentElements(val);
	};

	const handleToggleGridBlock = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		props.updateSlideshowParams(slideshow, {isGridBlockEnabled: !slideshow.isGridBlockEnabled});
	};

	const handleToggleStickyElementEdges = (
		_: React.ChangeEvent<HTMLInputElement>,
		checked: boolean,
	) => {
		props.toggleEditorStickyElementEdges(checked);
	};

	const handleToggleElementGuidelines = (
		_: React.ChangeEvent<HTMLInputElement>,
		checked: boolean,
	) => {
		props.toggleEditorElementGuidelines(checked);
	};

	const handleToggleElementOutlines = (
		_: React.ChangeEvent<HTMLInputElement>,
		checked: boolean,
	) => {
		props.toggleEditorElementOutlines(checked);
	};

	return (
		<SlideShowBasePanel
			isOpen={isOpen}
			buttons={
				<Button key="cancel" size="large" onClick={onClose} variant="contained">
					Закрыть
				</Button>
			}
			onClose={onClose}
		>
			<Typography variant="h5" gutterBottom>
				Настройки полотна
			</Typography>

			<br />

			<Switch
				label="Сетка"
				checked={slideshow.isGridBlockEnabled}
				onChange={handleToggleGridBlock}
			/>

			<br />
			<br />

			<Typography variant="h5" gutterBottom>
				Элементы
			</Typography>

			<br />
			<br />

			{slideshow.isGridBlockEnabled && (
				<Slider
					label="Непрозрачность"
					value={transparentElements}
					onChange={changeTransparentElements}
					step={sliderStep}
					max={1}
				/>
			)}

			<Switch
				label="Подсвечивать края"
				checked={isElementOutlinesEnabled}
				onChange={handleToggleElementOutlines}
			/>

			<Switch
				label="Направляющие"
				checked={isElementGuidelinesEnabled}
				onChange={handleToggleElementGuidelines}
			/>

			<Switch
				label="Липкие края"
				checked={isStickyElementEdges}
				onChange={handleToggleStickyElementEdges}
			/>
		</SlideShowBasePanel>
	);
};

export default connect(
	(state: RootState) => ({
		transparentElements: state.slideShowEditor.transparentElements,
		isStickyElementEdges: state.slideShowEditor.isStickyElementEdges,
		isElementGuidelinesEnabled: state.slideShowEditor.isElementGuidelinesEnabled,
		isElementOutlinesEnabled: state.slideShowEditor.isElementOutlinesEnabled,
	}),
	{
		updateSlideshowParams,
		changeEditorTransparentElements,
		toggleEditorStickyElementEdges,
		toggleEditorElementGuidelines,
		toggleEditorElementOutlines,
	},
)(SlideShowEditorGridPanel);
