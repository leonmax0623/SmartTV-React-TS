import * as React from 'react';
import {connect} from 'react-redux';
import {withTracker} from 'react-meteor-data-with-tracker';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {
	ISlideElement,
	SlideElementTelegramMethodShowEnumDisplay,
	SlideElementTelegramMethodShowEnum,
} from 'shared/collections/SlideElements';
import {RootState} from 'client/store/root-reducer';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import SocialDisplayField from 'client/components/editor/settingsFields/SocialDisplayField';
import EditorCheckbox from 'client/components/editor/formFields/EditorCheckbox';
import EditorDelimiter from '../formFields/EditorDelimiter';
import BgColorField from '../settingsFields/BgColorField';
import BgImageField from '../settingsFields/BgImageField';
import OpacityField from '../settingsFields/OpacityField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import ShowPostsField from '../settingsFields/ShowPostsField';
import EditorTextInput from '../formFields/EditorTextInput';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import EditorActionButtonsSocial from '../formFields/EditorActionButtonsSocial';
import {publishNames} from 'shared/constants/publishNames';
import EditorSelect from 'client/components/editor/formFields/EditorSelect';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface ITelegramElementSettingsProps {
	slideshowId: string;
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class TelegramElementSettings extends React.PureComponent<ITelegramElementSettingsProps> {
	handleTelegramIdChannelChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {telegramChannelId: value});
	};

	handleTelegramPostCountChange = (value?: number) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			telegramPostCount: value,
		});
	};

	handleMethodShowChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			telegramMethodShow: event.target.value as SlideElementTelegramMethodShowEnum,
		});
	};

	handleChangeHideText = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e.target;
		const {element} = this.props;
		this.props.updateSlideElement(element, {telegramHideText: checked});
	};

	handleChangeHideImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e.target;
		const {element} = this.props;

		this.props.updateSlideElement(element, {telegramHideImage: checked});
	};

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorSelect
					label="Выводить"
					options={[
						{
							label: SlideElementTelegramMethodShowEnumDisplay.CHANNEL,
							value: SlideElementTelegramMethodShowEnum.CHANNEL,
						},
					]}
					onChange={this.handleMethodShowChange}
					value={element.telegramMethodShow || SlideElementTelegramMethodShowEnum.CHANNEL}
				/>

				{
					<EditorTextInput
						label="ID Телеграм Канала"
						value={element.telegramChannelId}
						onChange={this.handleTelegramIdChannelChange}
					/>
				}

				<EditorCheckbox
					label="Скрыть текст"
					tooltip="Позволяет отображать только фотографии из публикаций"
					value="constElement"
					checked={element.telegramHideText}
					onChange={this.handleChangeHideText}
				/>

				<EditorCheckbox
					label="Скрыть картинки"
					tooltip="Позволяет отображать только текст из публикаций"
					value="constElement"
					checked={element.telegramHideImage}
					onChange={this.handleChangeHideImage}
				/>

				<EditorTextInput
					label="Количество сообщений"
					tooltip="Задает количество последних сообщений, выводимых в виджете"
					value={element.telegramPostCount}
					onChange={this.handleTelegramPostCountChange}
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

export default connect(
	(state: RootState) => ({
		slideshowId: state.slideShowEditor.slideshowId,
	}),
	{updateSlideElement},
)(TelegramElementSettings);
