import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import EditorTextInput from '../formFields/EditorTextInput';
import {ISlideElement} from 'shared/collections/SlideElements';

interface IRotateAngleFieldProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class RotateAngleField extends React.Component<IRotateAngleFieldProps> {
	handleChange = (property: 'rotateAngle' | 'rotateStep', value?: string | number) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			[property]: Number(value),
		});
	};

	render() {
		const {rotateAngle, rotateStep} = this.props.element;

		return (
			<>
				<EditorTextInput
					label="Угол поворота"
					value={rotateAngle ?? 0}
					onChange={(value) => this.handleChange('rotateAngle', value)}
					type="number"
					inputProps={{step: 1}}
				/>
				<EditorTextInput
					label="Шаг поворота"
					tooltip="Позволяет задавать шаг поворота элемента"
					value={rotateStep ?? 1}
					onChange={(value) => this.handleChange('rotateStep', value)}
					type="number"
					inputProps={{max: 90, min: 1, step: 1}}
				/>
			</>
		);
	}
}

export default connect(null, {
	updateSlideElement,
})(RotateAngleField);
