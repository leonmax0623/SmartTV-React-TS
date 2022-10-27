import * as React from 'react';
import {connect} from 'react-redux';
import {withTracker} from 'react-meteor-data-with-tracker';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {
	ISlideElement,
	SlideElementVkMethodShowEnumDisplay,
	SlideElementVkMethodShowEnum,
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

interface IVkElementSettingsProps {
	slideshowId: string;
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class VkElementSettings extends React.PureComponent<IVkElementSettingsProps> {
	handleVkIdGroupChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {vkGroupId: value});
	};

	handleVkPostCountChange = (value?: number) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			vkPostCount: value,
		});
	};

	handleChangeHideText = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e.target;
		const {element} = this.props;

		this.props.updateSlideElement(element, {vkHideText: checked});
	};

	handleMethodShowChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			vkMethodShow: event.target.value as SlideElementVkMethodShowEnum,
		});
	};

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorSelect
					label="Выводить"
					options={[
						{
							label: SlideElementVkMethodShowEnumDisplay.GROUP,
							value: SlideElementVkMethodShowEnum.GROUP,
						},
						{
							label: SlideElementVkMethodShowEnumDisplay.GROUP_PHOTO_ALBUM,
							value: SlideElementVkMethodShowEnum.GROUP_PHOTO_ALBUM,
						},
						{
							label: SlideElementVkMethodShowEnumDisplay.USER_WALL,
							value: SlideElementVkMethodShowEnum.USER_WALL,
						},
					]}
					onChange={this.handleMethodShowChange}
					value={element.vkMethodShow || SlideElementVkMethodShowEnum.GROUP}
				/>

				{(!element.vkMethodShow ||
					element.vkMethodShow !== SlideElementVkMethodShowEnum.USER_WALL) && (
					<EditorTextInput
						label="ID группы ВК"
						value={element.vkGroupId}
						onChange={this.handleVkIdGroupChange}
					/>
				)}

				<SocialDisplayField element={element} />

				<EditorCheckbox
					label="Скрыть текст"
					tooltip="Позволяет отображать только фотографии из публикаций"
					value="constElement"
					checked={element.vkHideText}
					onChange={this.handleChangeHideText}
				/>

				<EditorTextInput
					label="Количество сообщений"
					tooltip="Задает количество последних сообщений, выводимых в виджете"
					value={element.vkPostCount}
					onChange={this.handleVkPostCountChange}
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

export default withTracker<{}, {}>(() => {
	const subProfile = Meteor.subscribe(publishNames.user.userProfile);
	const loading = !subProfile.ready();
	const user = Meteor.user();

	return {loading, user};
})(
	connect(
		(state: RootState) => ({
			slideshowId: state.slideShowEditor.slideshowId,
		}),
		{updateSlideElement},
	)(VkElementSettings),
);
