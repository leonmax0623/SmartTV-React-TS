import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {ISlideElement} from 'shared/collections/SlideElements';
import EditorTextInput from '../formFields/EditorTextInput';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import TextColorField from 'client/components/editor/settingsFields/TextColorField';
import BgColorField from 'client/components/editor/settingsFields/BgColorField';
import BgImageField from 'client/components/editor/settingsFields/BgImageField';
import OpacityField from 'client/components/editor/settingsFields/OpacityField';
import FontSizeField from 'client/components/editor/settingsFields/FontSizeField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import FontField from 'client/components/editor/settingsFields/FontField';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface IRssElementSettingsProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class RssElementSettings extends React.PureComponent<IRssElementSettingsProps> {
	handleUrlChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			rssUrl: value,
		});
	};

	handleAmountChange = (value?: number) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			rssItemsCount: value,
		});
	};

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorTextInput
					label="Ссылка на RSS"
					value={element.rssUrl}
					onChange={this.handleUrlChange}
				/>

				<EditorTextInput
					label="Количество сообщений"
					tooltip="Задает количество последних сообщений, выводимых в виджете"
					type="number"
					value={element.rssItemsCount}
					onChange={this.handleAmountChange}
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

export default connect(null, {updateSlideElement})(RssElementSettings);
