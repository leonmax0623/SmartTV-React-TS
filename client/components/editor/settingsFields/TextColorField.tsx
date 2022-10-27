import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import EditorColor from '../formFields/EditorColor';
import {ISlideElement} from 'shared/collections/SlideElements';

interface ITextColorFieldProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class TextColorField extends React.Component<ITextColorFieldProps> {
	handleChange = (color: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {textColor: color});
	};

	render() {
		const {textColor} = this.props.element;

		return (
			<EditorColor
				label="Цвет текста"
				value={textColor}
				resetValue="#000"
				onChange={this.handleChange}
			/>
		);
	}
}

export default connect(null, {
	updateSlideElement,
})(TextColorField);
