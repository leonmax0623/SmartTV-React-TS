import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import EditorTextInput from '../formFields/EditorTextInput';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import {ISlideElement, SlideElementTransportTypeEnum} from 'shared/collections/SlideElements';
import {RootState} from 'client/store/root-reducer';
import EditorDelimiter from '../formFields/EditorDelimiter';
import EditorSelect from '../formFields/EditorSelect';
import BgColorField from '../settingsFields/BgColorField';
import BgImageField from '../settingsFields/BgImageField';
import OpacityField from '../settingsFields/OpacityField';
import TextColorField from '../settingsFields/TextColorField';
import FontSizeField from '../settingsFields/FontSizeField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import FontField from 'client/components/editor/settingsFields/FontField';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface IHtmlElementSettingsProps {
	slideshowId: string;
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class ScheduleElementSettings extends React.PureComponent<IHtmlElementSettingsProps> {
	handleFromChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {fromCity: value});
	};

	handleToChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {toCity: value});
	};

	handleTransportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			transportType: event.target.value as SlideElementTransportTypeEnum,
		});
	};

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorTextInput
					label="Откуда"
					onChange={this.handleFromChange}
					value={element.fromCity}
				/>

				<EditorTextInput
					label="Куда"
					onChange={this.handleToChange}
					value={element.toCity}
				/>

				<EditorSelect
					label="Тип транспорта"
					options={[
						{label: 'Самолет', value: SlideElementTransportTypeEnum.PLANE},
						{label: 'Поезд', value: SlideElementTransportTypeEnum.TRAIN},
						{label: 'Электричка', value: SlideElementTransportTypeEnum.SUBURBAN},
						{label: 'Автобус', value: SlideElementTransportTypeEnum.BUS},
					]}
					value={element.transportType}
					onChange={this.handleTransportChange}
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

export default connect(
	(state: RootState) => ({
		slideshowId: state.slideShowEditor.slideshowId,
	}),
	{updateSlideElement},
)(ScheduleElementSettings);
