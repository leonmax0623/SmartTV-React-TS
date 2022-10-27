import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import EditorTextInput from '../formFields/EditorTextInput';
import {ISlideElement} from 'shared/collections/SlideElements';

interface IOpacityFieldProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class OpacityField extends React.Component<IOpacityFieldProps> {
	handleChange = (value?: string | number) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			opacity: Number(value),
		});
	};

	render() {
		const {opacity} = this.props.element;

		return (
			<EditorTextInput
				label="Непрозрачность"
				tooltip="Позволяет сделать элемент прозрачным. Укажите значение от 0 до 1, где 0 полностью прозрачный элемент, а 1 полностью непрозрачный"
				value={opacity < 1 ? opacity.toFixed(1) : 1}
				onChange={this.handleChange}
				type="number"
				inputProps={{max: 1, min: 0, step: 0.1}}
			/>
		);
	}
}

export default connect(null, {
	updateSlideElement,
})(OpacityField);
