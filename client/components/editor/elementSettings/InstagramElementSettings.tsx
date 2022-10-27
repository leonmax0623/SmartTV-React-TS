import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {ISlideElement} from 'shared/collections/SlideElements';
import {RootState} from 'client/store/root-reducer';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import SocialDisplayField from 'client/components/editor/settingsFields/SocialDisplayField';
import EditorTextInput from '../formFields/EditorTextInput';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import EditorActionButtonsSocial from '../formFields/EditorActionButtonsSocial';
import EditorDelimiter from '../formFields/EditorDelimiter';
import BgColorField from '../settingsFields/BgColorField';
import BgImageField from '../settingsFields/BgImageField';
import OpacityField from '../settingsFields/OpacityField';
import ShowPostsField from '../settingsFields/ShowPostsField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import EditorCheckbox from 'client/components/editor/formFields/EditorCheckbox';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface IInstagramElementSettingsProps {
	slideshowId: string;
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class InstagramElementSettings extends React.PureComponent<IInstagramElementSettingsProps> {
	handleNameChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {instagramName: value});
	};

	handlePhotoCountChange = (value?: number) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			instagramPhotoCount: value,
		});
	};

	handleChangeHideText = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e.target;
		const {element} = this.props;

		this.props.updateSlideElement(element, {instagramHideText: checked});
	};

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorTextInput
					label="Имя аккаунта"
					value={element.instagramName}
					onChange={this.handleNameChange}
				/>

				<SocialDisplayField element={element} />

				<EditorCheckbox
					label="Скрыть текст"
					tooltip="Позволяет отображать только фотографии из публикаций"
					value="constElement"
					checked={element.instagramHideText}
					onChange={this.handleChangeHideText}
				/>

				<EditorTextInput
					label="Количество фото"
					tooltip="Задает количество последних фото, выводимых в виджете"
					value={element.instagramPhotoCount}
					type="number"
					onChange={this.handlePhotoCountChange}
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

export default connect(
	(state: RootState) => ({
		slideshowId: state.slideShowEditor.slideshowId,
	}),
	{updateSlideElement},
)(InstagramElementSettings);
