import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {ISlideElement, SlideElementCurrenciesEnum} from 'shared/collections/SlideElements';
import EditorCheckbox from '../formFields/EditorCheckbox';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import EditorDelimiter from '../formFields/EditorDelimiter';
import TextColorField from '../settingsFields/TextColorField';
import BgColorField from '../settingsFields/BgColorField';
import BgImageField from '../settingsFields/BgImageField';
import OpacityField from '../settingsFields/OpacityField';
import FontSizeField from '../settingsFields/FontSizeField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import FontField from 'client/components/editor/settingsFields/FontField';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface ICurrencyElementSettingsProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

const currencies = [
	{label: 'Доллар США', value: SlideElementCurrenciesEnum.USD},
	{label: 'Евро', value: SlideElementCurrenciesEnum.EUR},
	{label: 'Белорусский рубль', value: SlideElementCurrenciesEnum.BYN},
	{label: 'Фунт стерлингов', value: SlideElementCurrenciesEnum.GBP},
	{label: 'Польский злотый', value: SlideElementCurrenciesEnum.PLN},
	{label: 'Турецкая лира', value: SlideElementCurrenciesEnum.TRY},
	{label: 'Швейцарский франк', value: SlideElementCurrenciesEnum.CHF},
	{label: 'Датская крона', value: SlideElementCurrenciesEnum.DKK},
];

class CurrencyElementSettings extends React.PureComponent<ICurrencyElementSettingsProps> {
	changeCourseHandler = (e: {target: {value: string; checked: boolean}}) => {
		let {currencyList} = this.props.element;
		const {value, checked} = e.target;

		if (!currencyList) {
			currencyList = [];
		}

		if (checked) {
			currencyList.push(value as SlideElementCurrenciesEnum);
		} else {
			currencyList = currencyList.filter((currency) => currency !== value);
		}

		this.props.updateSlideElement(this.props.element, {currencyList});
	};

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				{currencies.map((course) => (
					<EditorCheckbox
						key={course.value}
						label={course.label}
						checked={
							element.currencyList && element.currencyList.includes(course.value)
						}
						value={course.value}
						onChange={this.changeCourseHandler}
					/>
				))}

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

export default connect(null, {updateSlideElement})(CurrencyElementSettings);
