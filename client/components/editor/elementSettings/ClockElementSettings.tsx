import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {ISlideElement, SlideElementClockViewEnum} from 'shared/collections/SlideElements';
import EditorTextInput from '../formFields/EditorTextInput';
import TextColorField from '../settingsFields/TextColorField';
import BgColorField from '../settingsFields/BgColorField';
import BgImageField from '../settingsFields/BgImageField';
import OpacityField from '../settingsFields/OpacityField';
import FontSizeField from '../settingsFields/FontSizeField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import EditorSelect from '../formFields/EditorSelect';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import FontField from 'client/components/editor/settingsFields/FontField';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface IClockElementSettingsProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class ClockElementSettings extends React.PureComponent<IClockElementSettingsProps> {
	handleCityChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			city: value,
		});
	};

	handleClockViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			clockView: event.target.value as SlideElementClockViewEnum,
		});
	};

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorTextInput
					label="Город"
					value={element.city}
					onChange={this.handleCityChange}
				/>

				<EditorSelect
					label="Тип"
					options={[
						{label: 'Цифровые часы', value: SlideElementClockViewEnum.CLOCK},
						{label: 'Дата', value: SlideElementClockViewEnum.DATE},
					]}
					onChange={this.handleClockViewChange}
					value={element.clockView}
				/>

				<FontSizeField element={element} />
				<FontField element={element} />
				<TextColorField element={element} />
				<BgColorField element={element} />
				<BgImageField element={element} />
				<RotateAngleField element={element} />
				<OpacityField element={element} />

				<PermanentElementField element={element} />

				<EditorActionButtonsCommon element={element} />
			</ElementSettingsWrapper>
		);
	}
}

export default connect(null, {updateSlideElement})(ClockElementSettings);
