import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {
	SlideshowBackgroundImageDisplayEnum,
	SlideshowBackgroundImageDisplayText,
} from 'shared/collections/Slideshows';
import EditorImage from '../formFields/EditorImage';
import EditorSelect from '../formFields/EditorSelect';
import {ISlideElement} from 'shared/collections/SlideElements';

interface IBgImageFieldProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
	label: string;
	labelDisplay: string;
}

class BgImageField extends React.Component<IBgImageFieldProps> {
	static defaultProps: Partial<IBgImageFieldProps> = {
		label: 'Изображение фона',
		labelDisplay: 'Отображение фона',
	};

	handleImageChange = (image: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {backgroundImage: image});
	};

	handleImageDisplayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;
		const {value: backgroundImageDisplay} = event.target as {
			value: SlideshowBackgroundImageDisplayEnum;
		};

		this.props.updateSlideElement(element, {backgroundImageDisplay});
	};

	render() {
		const {label, labelDisplay} = this.props;
		const {backgroundImage, backgroundImageDisplay} = this.props.element;

		return (
			<>
				<EditorImage
					label={label}
					value={backgroundImage}
					onChange={this.handleImageChange}
				/>

				<EditorSelect
					label={labelDisplay}
					options={[
						{
							label: SlideshowBackgroundImageDisplayText.STRETCH,
							value: SlideshowBackgroundImageDisplayEnum.STRETCH,
						},
						{
							label: SlideshowBackgroundImageDisplayText.TILE,
							value: SlideshowBackgroundImageDisplayEnum.TILE,
						},
						{
							label: SlideshowBackgroundImageDisplayText.FILL,
							value: SlideshowBackgroundImageDisplayEnum.FILL,
						},
					]}
					onChange={this.handleImageDisplayChange}
					value={backgroundImageDisplay}
				/>
			</>
		);
	}
}

export default connect(null, {
	updateSlideElement,
})(BgImageField);
