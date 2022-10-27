import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {ISlideElement} from 'shared/collections/SlideElements';
import EditorTextInput from '../formFields/EditorTextInput';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import EditorDelimiter from '../formFields/EditorDelimiter';
import EditorSelect from '../formFields/EditorSelect';
import BgColorField from '../settingsFields/BgColorField';
import BgImageField from '../settingsFields/BgImageField';
import OpacityField from '../settingsFields/OpacityField';
import TextColorField from '../settingsFields/TextColorField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import FontSizeField from '../settingsFields/FontSizeField';
import FontField from 'client/components/editor/settingsFields/FontField';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import EditorCheckbox from 'client/components/editor/formFields/EditorCheckbox';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface ITextElementSettingsProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class WeatherElementSettings extends React.PureComponent<ITextElementSettingsProps> {
	handleLocationChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {location: value});
	};

	handleDisplayDaysChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			displayDays: Number(event.target.value),
		});
	};

	handleHideTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e.target;
		const {element} = this.props;

		this.props.updateSlideElement(element, {hideTitle: checked});
	};

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorTextInput
					label="Город или населенный пункт"
					value={element.location}
					onChange={this.handleLocationChange}
				/>

				<EditorCheckbox
					label="Скрыть заголовок"
					value="hideTitle"
					checked={element.hideTitle}
					onChange={this.handleHideTitleChange}
				/>

				<EditorSelect
					label="День"
					tooltip="Позволяет выбрать за какой день выводить прогноз"
					options={[
						{label: '1', value: 1},
						{label: '2', value: 2},
						{label: '3', value: 3},
						{label: '4', value: 4},
						{label: '5', value: 5},
					]}
					value={element.displayDays}
					onChange={this.handleDisplayDaysChange}
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

export default connect(null, {updateSlideElement})(WeatherElementSettings);
