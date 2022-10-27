import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {ISlideElement} from 'shared/collections/SlideElements';
import EditorTextInput from '../formFields/EditorTextInput';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import EditorActionButtonsSocial from '../formFields/EditorActionButtonsSocial';
import BgColorField from '../settingsFields/BgColorField';
import BgImageField from '../settingsFields/BgImageField';
import OpacityField from '../settingsFields/OpacityField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import EditorDelimiter from '../formFields/EditorDelimiter';
import ShowPostsField from '../settingsFields/ShowPostsField';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import SocialDisplayField from 'client/components/editor/settingsFields/SocialDisplayField';
import EditorCheckbox from 'client/components/editor/formFields/EditorCheckbox';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface IOkElementSettingsProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class OkElementSettings extends React.PureComponent<IOkElementSettingsProps> {
	handleLinkChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			okGroupLink: value,
		});
	};

	handleOkPostCountChange = (value?: number) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			okPostCount: value,
		});
	};

	handleChangeHideText = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e.target;
		const {element} = this.props;

		this.props.updateSlideElement(element, {okHideText: checked});
	};

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorTextInput
					label="Ссылка на группы OK (полностью)"
					value={element.okGroupLink}
					onChange={this.handleLinkChange}
				/>

				<SocialDisplayField element={element} />

				<EditorCheckbox
					label="Скрыть текст"
					tooltip="Позволяет отображать только фотографии из публикаций"
					value="constElement"
					checked={element.okHideText}
					onChange={this.handleChangeHideText}
				/>

				<EditorTextInput
					label="Количество постов"
					tooltip="Задает количество последних постов, выводимых в виджете"
					value={element.okPostCount}
					onChange={this.handleOkPostCountChange}
					type="number"
					inputProps={{min: 1, step: 1}}
				/>

				<ShowPostsField element={element} />

				<BgColorField element={element} />
				<BgImageField element={element} />
				<RotateAngleField element={element} />
				<OpacityField element={element} />
				<PermanentElementField element={element} />

				<EditorDelimiter />

				<EditorActionButtonsCommon element={element} />
				<EditorActionButtonsSocial slideElementId={element._id} />
			</ElementSettingsWrapper>
		);
	}
}

export default connect(null, {updateSlideElement})(OkElementSettings);
