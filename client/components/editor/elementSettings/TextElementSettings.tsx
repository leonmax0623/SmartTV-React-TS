import * as React from 'react';
import {connect} from 'react-redux';
import Tab from '@material-ui/core/Tab';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {ISlideElement, SlideElementTextAlignEnum} from 'shared/collections/SlideElements';
import EditorTextInput from '../formFields/EditorTextInput';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import EditorActionTabs from '../formFields/EditorActionTabs';
import EditorDelimiter from '../formFields/EditorDelimiter';
import TextColorField from '../settingsFields/TextColorField';
import BgColorField from 'client/components/editor/settingsFields/BgColorField';
import BgImageField from 'client/components/editor/settingsFields/BgImageField';
import OpacityField from 'client/components/editor/settingsFields/OpacityField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface ITextElementSettingsProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class TextElementSettings extends React.PureComponent<ITextElementSettingsProps> {
	handleTextAlignChange = (e: React.ChangeEvent, textAlign: SlideElementTextAlignEnum) => {
		this.props.updateSlideElement(this.props.element, {textAlign});
	};

	handleLineHeightChange = (value?: number) => {
		this.props.updateSlideElement(this.props.element, {
			lineHeight: value,
		});
	};

	handleLetterSpacingChange = (value?: number) => {
		this.props.updateSlideElement(this.props.element, {
			letterSpacing: value,
		});
	};

	handlePaddingChange = (value?: number) => {
		this.props.updateSlideElement(this.props.element, {
			padding: value,
		});
	};

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorActionTabs
					label="Выравнивание текста"
					value={element.textAlign}
					onChange={this.handleTextAlignChange}
					together
				>
					<Tab label={<FormatAlignLeftIcon />} value={SlideElementTextAlignEnum.LEFT} />

					<Tab
						label={<FormatAlignCenterIcon />}
						value={SlideElementTextAlignEnum.CENTER}
					/>

					<Tab label={<FormatAlignRightIcon />} value={SlideElementTextAlignEnum.RIGHT} />

					<Tab
						label={<FormatAlignJustifyIcon />}
						value={SlideElementTextAlignEnum.JUSTIFY}
					/>
				</EditorActionTabs>

				<EditorTextInput
					label="Высота линии текста"
					value={element.lineHeight}
					onChange={this.handleLineHeightChange}
					type="number"
					inputProps={{min: 0}}
				/>

				<EditorTextInput
					label="Межбуквенный интервал"
					value={element.letterSpacing}
					onChange={this.handleLetterSpacingChange}
					type="number"
					inputProps={{min: 0, step: 0.1}}
				/>

				<EditorTextInput
					label="Отступ"
					value={element.padding}
					onChange={this.handlePaddingChange}
					type="number"
					inputProps={{min: 0}}
				/>

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

export default connect(null, {updateSlideElement})(TextElementSettings);
