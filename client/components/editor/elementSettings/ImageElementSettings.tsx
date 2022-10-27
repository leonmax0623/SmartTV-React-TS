import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {ISlideElement} from 'shared/collections/SlideElements';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import EditorDelimiter from '../formFields/EditorDelimiter';
import BgImageField from '../settingsFields/BgImageField';
import OpacityField from '../settingsFields/OpacityField';
import EditorCheckbox from '../formFields/EditorCheckbox';
import PermanentElementField from '../settingsFields/PermanentElementField';
import {getOriginImageUrl} from 'client/utils/slides';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface IImageElementSettingsProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class ImageElementSettings extends React.PureComponent<IImageElementSettingsProps> {
	componentDidMount() {
		if (this.props.element.retainAspectRatio === true) {
			this.updateImageAspectRatio();
		}
	}

	componentDidUpdate(prevProps: Readonly<IImageElementSettingsProps>): void {
		const {
			element: {backgroundImage, retainAspectRatio},
		} = this.props;

		// смена изображения
		if (backgroundImage !== prevProps.element.backgroundImage && retainAspectRatio) {
			this.updateImageAspectRatio();
		}
	}

	changeUpdateAspectRatio = (e: {target: {checked: boolean}}) => {
		const {checked} = e.target;

		this.props.updateSlideElement(this.props.element, {retainAspectRatio: checked});

		if (checked) {
			this.updateImageAspectRatio();
		}
	};

	updateImageAspectRatio() {
		const {props} = this;

		const {
			element: {backgroundImage, width},
		} = props;

		const img = new Image();

		if (backgroundImage) {
			img.src = getOriginImageUrl(backgroundImage);

			img.onload = function(this: HTMLImageElement) {
				props.updateSlideElement(props.element, {
					height: (width / this.width) * this.height,
				});
			};
		}
	}

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<BgImageField element={element} label="Изображение" labelDisplay="Отображение" />
				<OpacityField element={element} />
				<EditorCheckbox
					label="Сохранить пропорции"
					tooltip="Если данная опция включена, при изменении размера элемента пропорции будут сохранены"
					value=""
					checked={element.retainAspectRatio}
					onChange={this.changeUpdateAspectRatio}
				/>
				<PermanentElementField element={element} />
				<RotateAngleField element={element} />

				<EditorDelimiter />

				<EditorActionButtonsCommon element={element} />
			</ElementSettingsWrapper>
		);
	}
}

export default connect(null, {updateSlideElement})(ImageElementSettings);
