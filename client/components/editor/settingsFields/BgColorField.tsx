import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import EditorColor from '../formFields/EditorColor';
import {ISlideElement} from 'shared/collections/SlideElements';

interface IBgColorFieldProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class BgColorField extends React.PureComponent<IBgColorFieldProps> {
	handleChange = (color: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {backgroundColor: color});
	};

	render() {
		const {backgroundColor} = this.props.element;

		return (
			<EditorColor
				label="Цвет фона"
				value={backgroundColor}
				onChange={this.handleChange}
				resetValue="rgba(255, 255, 255, 0)"
			/>
		);
	}
}

export default connect(null, {
	updateSlideElement,
})(BgColorField);
