import * as React from 'react';
import {connect} from 'react-redux';
import {withTracker} from 'react-meteor-data-with-tracker';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import EditorCheckbox from '../formFields/EditorCheckbox';
import EditorMultipleSelect from '../formFields/EditorMultipleSelect';
import EditorSelect from '../formFields/EditorSelect';
import {
	ISlideElement,
	PermanentPositionEnumDisplay,
	PermanentPositionEnum,
} from 'shared/collections/SlideElements';
import {Slide, ISlide} from 'shared/collections/Slides';

interface IPermanentElementFieldProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
	slides: ISlide[];
}

class PermanentElementField extends React.Component<IPermanentElementFieldProps> {
	handleSetSlides = (event: React.ChangeEvent<{value?: string[] | string}>) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {permanentOnSlides: event.target.value as string[]});
	};

	handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e.target;
		const {element} = this.props;

		this.props.updateSlideElement(element, {permanent: checked});

		if (checked && element.blockTransition) {
			this.props.updateSlideElement(element, {blockTransition: false});
		}
	};

	handleChangeAtAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e.target;
		const {element} = this.props;

		this.props.updateSlideElement(element, {permanentAtAll: checked});
	};

	handleChangePermanentPosition = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {value} = e.target;
		const {element} = this.props;

		this.props.updateSlideElement(element, {permanentPosition: value as PermanentPositionEnum});
	};

	render() {
		const {
			slides,
			element: {permanent, permanentAtAll = true, permanentOnSlides = [], permanentPosition},
		} = this.props;

		const options = slides.map((slide) => ({
			label: `Слайд ${slide.position}`,
			value: slide._id,
		}));

		return (
			<>
				<EditorCheckbox
					label="Постоянный элемент"
					tooltip="Позволяет отображать элемент сразу на нескольких или сразу всех слайдах"
					value="constElement"
					checked={permanent}
					onChange={this.handleChange}
				/>

				{permanent && (
					<>
						<EditorSelect
							label="Позиция элемента"
							options={[
								{
									label: PermanentPositionEnumDisplay.TOP,
									value: PermanentPositionEnum.TOP,
								},
								{
									label: PermanentPositionEnumDisplay.BOTTOM,
									value: PermanentPositionEnum.BOTTOM,
								},
							]}
							value={permanentPosition}
							onChange={this.handleChangePermanentPosition}
						/>

						<EditorCheckbox
							label="Показывать на всех слайдах"
							value="constElement"
							checked={permanentAtAll}
							onChange={this.handleChangeAtAll}
						/>

						{!permanentAtAll && (
							<EditorMultipleSelect
								label="Показывать на слайдах"
								options={options}
								onChange={this.handleSetSlides}
								value={permanentOnSlides}
							/>
						)}
					</>
				)}
			</>
		);
	}
}

export default withTracker(() => {
	return {
		slides: Slide.find({}, {sort: {position: 1}}).fetch(),
	};
})(
	connect(null, {
		updateSlideElement,
	})(PermanentElementField),
);
