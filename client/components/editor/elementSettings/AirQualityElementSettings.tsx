import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {
	ISlideElement,
	SlideElementSubstanceTypeEnumDisplay,
	SlideElementSubstanceTypeEnum,
} from 'shared/collections/SlideElements';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import EditorDelimiter from '../formFields/EditorDelimiter';
import OpacityField from 'client/components/editor/settingsFields/OpacityField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import EditorTextInput from 'client/components/editor/formFields/EditorTextInput';
import EditorSelect from 'client/components/editor/formFields/EditorSelect';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface IAirQualityElementSettings {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

const AirQualityElementSettings: React.FC<IAirQualityElementSettings> = ({element, ...props}) => {
	// const handlePaddingChange = (value?: number) => {
	// 	props.updateSlideElement(element, {
	// 		padding: value,
	// 	});
	// };

	const handleZoomChange = (value?: number) => {
		props.updateSlideElement(element, {
			zoom: value,
		});
	};

	const handleSubstanceTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		props.updateSlideElement(element, {
			substanceType: event.target.value as SlideElementSubstanceTypeEnum,
		});
	};

	return (
		<ElementSettingsWrapper elementId={element._id}>
			<EditorTextInput
				label="Масштаб"
				value={element.zoom}
				onChange={handleZoomChange}
				type="number"
				inputProps={{max: 17, min: 1, step: 1}}
			/>

			<EditorSelect
				label="Тип вещества"
				options={Object.keys(SlideElementSubstanceTypeEnumDisplay).map((key) => ({
					label: SlideElementSubstanceTypeEnumDisplay[key],
					value: SlideElementSubstanceTypeEnum[key],
				}))}
				onChange={handleSubstanceTypeChange}
				value={element.substanceType}
			/>

			<RotateAngleField element={element} />
			<OpacityField element={element} />
			<PermanentElementField element={element} />

			<EditorDelimiter />

			<EditorActionButtonsCommon element={element} />
		</ElementSettingsWrapper>
	);
};

export default connect(null, {updateSlideElement})(AirQualityElementSettings);
