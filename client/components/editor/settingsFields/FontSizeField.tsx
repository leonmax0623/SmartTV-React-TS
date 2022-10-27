import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import EditorTextInput from '../formFields/EditorTextInput';
import {ISlideElement} from 'shared/collections/SlideElements';

interface IFontSizeFieldProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class FontSizeField extends React.Component<IFontSizeFieldProps> {
	handleChange = (value?: number) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			fontSize: value,
		});
	};

	render() {
		const {fontSize} = this.props.element;

		return (
			<EditorTextInput
				label="Размер текста"
				value={fontSize}
				onChange={this.handleChange}
				type="number"
				inputProps={{min: 1, step: 1}}
			/>
		);
	}
}

export default connect(null, {
	updateSlideElement,
})(FontSizeField);
