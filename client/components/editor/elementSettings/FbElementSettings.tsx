import * as React from 'react';
import {connect} from 'react-redux';
import {withTracker} from 'react-meteor-data-with-tracker';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {ISlideElement} from 'shared/collections/SlideElements';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import SocialDisplayField from 'client/components/editor/settingsFields/SocialDisplayField';
import EditorTextInput from '../formFields/EditorTextInput';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import EditorActionButtonsSocial from '../formFields/EditorActionButtonsSocial';
import BgColorField from '../settingsFields/BgColorField';
import BgImageField from '../settingsFields/BgImageField';
import OpacityField from '../settingsFields/OpacityField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import EditorDelimiter from '../formFields/EditorDelimiter';
import ShowPostsField from '../settingsFields/ShowPostsField';
import EditorCheckbox from 'client/components/editor/formFields/EditorCheckbox';
import EditorSelect from 'client/components/editor/formFields/EditorSelect';
import {IUser} from 'client/components/user/ProfilePage';
import {publishNames} from 'shared/constants/publishNames';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface IFbElementSettingsData {
	loading: boolean;
	user?: IUser;
}

interface IFbElementSettingsProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class FbElementSettings extends React.PureComponent<
	IFbElementSettingsProps & IFbElementSettingsData
> {
	handleLinkChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			fbGroupId: value,
		});
	};

	handleCountChange = (value?: string | number) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			fbPostCount: Number(value),
		});
	};

	handleChangeHideText = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e.target;
		const {element} = this.props;

		this.props.updateSlideElement(element, {fbHideText: checked});
	};

	handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			fbGroupId: event.target.value,
		});
	};

	render() {
		const {element, user} = this.props;
		const optionPages =
			user &&
			user.fbPages &&
			user.fbPages.map(({name, id}) => ({label: name || '', value: id || ''}));

		return (
			<ElementSettingsWrapper elementId={element._id}>
				{/*<EditorTextInput
					label="ID группы"
					value={element.fbGroupId}
					onChange={this.handleLinkChange}
				/>*/}

				{optionPages && (
					<EditorSelect
						label="Выбор страницы"
						options={optionPages}
						onChange={this.handlePageChange}
						value={element.fbGroupId}
					/>
				)}

				<SocialDisplayField element={element} />

				<EditorCheckbox
					label="Скрыть текст"
					tooltip="Позволяет отображать только фотографии из публикаций"
					value="constElement"
					checked={element.fbHideText}
					onChange={this.handleChangeHideText}
				/>

				<EditorTextInput
					label="Количество сообщений"
					tooltip="Задает количество последних сообщений, выводимых в виджете"
					value={element.fbPostCount}
					onChange={this.handleCountChange}
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
})(connect(null, {updateSlideElement})(FbElementSettings));
