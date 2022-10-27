import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {
	ISlideElement,
	SlideElementTwitterHashtagFilterEnum,
	SlideElementTwitterHashtagFilterEnumDisplay,
} from 'shared/collections/SlideElements';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import EditorSelect from 'client/components/editor/formFields/EditorSelect';
import {TwitterGetTypeEnum, TwitterGetTypeText} from 'shared/collections/Twitter';
import SocialDisplayField from 'client/components/editor/settingsFields/SocialDisplayField';
import EditorCheckbox from 'client/components/editor/formFields/EditorCheckbox';
import EditorTextInput from '../formFields/EditorTextInput';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import EditorActionButtonsSocial from '../formFields/EditorActionButtonsSocial';
import BgColorField from '../settingsFields/BgColorField';
import BgImageField from '../settingsFields/BgImageField';
import OpacityField from '../settingsFields/OpacityField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import EditorDelimiter from '../formFields/EditorDelimiter';
import ShowPostsField from '../settingsFields/ShowPostsField';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface ITwitterElementSettingsProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class TwitterElementSettings extends React.PureComponent<ITwitterElementSettingsProps> {
	handleGetTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;
		const {value: twitterGetType} = event.target as {
			value: TwitterGetTypeEnum;
		};

		this.props.updateSlideElement(element, {twitterGetType});
	};

	handleHashtagFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;
		const {value: twitterHashtagFilter} = event.target as {
			value: SlideElementTwitterHashtagFilterEnum;
		};

		this.props.updateSlideElement(element, {twitterHashtagFilter});
	};

	handleListIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;
		const {value: twitterListId} = event.target as {
			value: string;
		};

		this.props.updateSlideElement(element, {twitterListId});
	};

	handleCollectionIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;
		const {value: twitterCollectionId} = event.target as {
			value: string;
		};

		this.props.updateSlideElement(element, {twitterCollectionId});
	};

	handleHashTagChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			twitterHashtag: value,
		});
	};

	handleProfileNameChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			twitterProfileName: value,
		});
	};

	handleProfileNameForListChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			twitterProfileNameForList: value,
			twitterListId: '',
		});
	};

	handleProfileNameForCollectionChange = (value?: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			twitterProfileNameForCollection: value,
			twitterCollectionId: '',
		});
	};

	handleTwitsCountChange = (value?: string | number) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			twitsCount: Number(value),
		});
	};

	handleChangeHideText = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e.target;
		const {element} = this.props;

		this.props.updateSlideElement(element, {twitsHideText: checked});
	};

	elementsByType = () => {
		const {element} = this.props;

		switch (element.twitterGetType) {
			case TwitterGetTypeEnum.HASHTAG:
			default:
				return (
					<>
						<EditorTextInput
							label={TwitterGetTypeText.HASHTAG}
							value={element.twitterHashtag}
							onChange={this.handleHashTagChange}
						/>

						<EditorSelect
							label="Отображать"
							options={[
								{
									label: SlideElementTwitterHashtagFilterEnumDisplay.RECENT,
									value: SlideElementTwitterHashtagFilterEnum.RECENT,
								},
								{
									label: SlideElementTwitterHashtagFilterEnumDisplay.POPULAR,
									value: SlideElementTwitterHashtagFilterEnum.POPULAR,
								},
								{
									label: SlideElementTwitterHashtagFilterEnumDisplay.IMAGES,
									value: SlideElementTwitterHashtagFilterEnum.IMAGES,
								},
								{
									label: SlideElementTwitterHashtagFilterEnumDisplay.NATIVE_VIDEO,
									value: SlideElementTwitterHashtagFilterEnum.NATIVE_VIDEO,
								},
							]}
							value={
								element.twitterHashtagFilter ||
								SlideElementTwitterHashtagFilterEnum.RECENT
							}
							onChange={this.handleHashtagFilterChange}
						/>
					</>
				);

			case TwitterGetTypeEnum.PROFILE_NAME:
				return (
					<EditorTextInput
						label={TwitterGetTypeText.PROFILE_NAME}
						value={element.twitterProfileName}
						onChange={this.handleProfileNameChange}
					/>
				);

			case TwitterGetTypeEnum.LIST:
				return (
					<>
						<EditorTextInput
							label={TwitterGetTypeText.PROFILE_NAME}
							value={element.twitterProfileNameForList}
							onChange={this.handleProfileNameForListChange}
						/>

						<EditorSelect
							label="Списки пользователя"
							options={[
								{
									label: 'Выберите список',
									value: '',
								},
								...(element.twitterLists?.map(({label, listId}) => ({
									label,
									value: listId,
								})) || []),
							]}
							value={element.twitterListId || ''}
							onChange={this.handleListIdChange}
						/>
					</>
				);

			case TwitterGetTypeEnum.COLLECTION:
				return (
					<>
						<EditorTextInput
							label={TwitterGetTypeText.PROFILE_NAME}
							value={element.twitterProfileNameForCollection}
							onChange={this.handleProfileNameForCollectionChange}
						/>

						<EditorSelect
							label="Коллекции пользователя"
							options={[
								{
									label: 'Выберите коллекцию',
									value: '',
								},
								...(element.twitterCollections?.map(({label, collectionId}) => ({
									label,
									value: collectionId,
								})) || []),
							]}
							value={element.twitterCollectionId || ''}
							onChange={this.handleCollectionIdChange}
						/>
					</>
				);
		}
	};

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorSelect
					label="Вывод твитов"
					options={[
						{label: TwitterGetTypeText.HASHTAG, value: TwitterGetTypeEnum.HASHTAG},
						{
							label: TwitterGetTypeText.PROFILE_NAME,
							value: TwitterGetTypeEnum.PROFILE_NAME,
						},
						{
							label: TwitterGetTypeText.LIST,
							value: TwitterGetTypeEnum.LIST,
						},
						{
							label: TwitterGetTypeText.COLLECTION,
							value: TwitterGetTypeEnum.COLLECTION,
						},
						// {
						// 	label: TwitterGetTypeText.MOMENT,
						// 	value: TwitterGetTypeEnum.MOMENT,
						// },
					]}
					tooltip={
						<div>
							Поддерживаемые форматы:
							<br />
							Тег - например mtv (без #)
							<br />
							Имя пользователя - ivan133 (без @)
							<br />
							Список - можно посмотреть по адресу https://twitter.com/ivan133/lists
							или создать на сервисе https://tweetdeck.twitter.com/
							<br />
							Коллекция - можно создать на https://tweetdeck.twitter.com/ (collection)
							<br />
						</div>
					}
					value={element.twitterGetType || TwitterGetTypeText.HASHTAG}
					onChange={this.handleGetTypeChange}
				/>

				{this.elementsByType()}

				<SocialDisplayField element={element} />

				<EditorCheckbox
					label="Скрыть текст"
					tooltip="Позволяет отображать только фотографии из публикаций"
					value="constElement"
					checked={element.twitsHideText}
					onChange={this.handleChangeHideText}
				/>

				<EditorTextInput
					label="Количество сообщений"
					tooltip="Задает количество последних сообщений, выводимых в виджете"
					value={element.twitsCount}
					onChange={this.handleTwitsCountChange}
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

export default connect(null, {updateSlideElement})(TwitterElementSettings);
