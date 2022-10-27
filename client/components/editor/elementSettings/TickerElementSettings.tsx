import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {
	ISlideElement,
	SlideElementDirectionEnumDisplay,
	SlideElementDirectionTypeEnum,
} from 'shared/collections/SlideElements';
import EditorTextarea from '../formFields/EditorTextarea';
import EditorTextInput from '../formFields/EditorTextInput';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import EditorDelimiter from '../formFields/EditorDelimiter';
import FontSizeField from '../settingsFields/FontSizeField';
import TextColorField from '../settingsFields/TextColorField';
import BgColorField from 'client/components/editor/settingsFields/BgColorField';
import BgImageField from 'client/components/editor/settingsFields/BgImageField';
import OpacityField from 'client/components/editor/settingsFields/OpacityField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import FontField from 'client/components/editor/settingsFields/FontField';
import EditorSelect from 'client/components/editor/formFields/EditorSelect';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface ITickerElementSettingsProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class TickerElementSettings extends React.PureComponent<ITickerElementSettingsProps> {
	handleLineHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.props.updateSlideElement(this.props.element, {
			lineHeight: Number(event.target.value),
		});
	};

	handleTickerTextUpdate = (value: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {text: value});
	};

	handleChangeDirection = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			tickerDirection: event.target.value,
		});
	};

	handleChangeSpeed = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			tickerSpeed: parseInt(value || '', 10),
		});
	};

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorTextarea
					label="Текст строки"
					value={element.text}
					onChange={this.handleTickerTextUpdate}
				/>

				<EditorTextInput
					label="Скорость прокрутки"
					value={element.tickerSpeed}
					onChange={this.handleChangeSpeed}
					type="number"
					inputProps={{min: 10, max: 100, step: 1}}
				/>

				<EditorSelect
					label="Направление прокрутки"
					options={[
						{
							label: SlideElementDirectionEnumDisplay.TORIGHT,
							value: SlideElementDirectionTypeEnum.TORIGHT,
						},
						{
							label: SlideElementDirectionEnumDisplay.TOLEFT,
							value: SlideElementDirectionTypeEnum.TOLEFT,
						},
					]}
					value={element.tickerDirection}
					onChange={this.handleChangeDirection}
				/>

				<FontSizeField element={element} />

				<FontField element={element} />
				<TextColorField element={element} />
				<BgColorField element={element} />
				<BgImageField element={element} />
				<RotateAngleField element={element} />
				<OpacityField element={element} />
				<PermanentElementField element={element} />

				<EditorDelimiter />

				<EditorActionButtonsCommon element={element} />
			</ElementSettingsWrapper>
		);
	}
}

export default connect(null, {updateSlideElement})(TickerElementSettings);
