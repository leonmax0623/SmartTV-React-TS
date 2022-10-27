import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {
	ISlideshowStyles,
	SlideshowTransition,
	SlideshowBackgroundImageDisplay,
	SlideshowBackgroundImageDisplayText,
	SlideshowTransitionText,
} from 'shared/collections/Slideshows';
import UploadButton from '../../common/ui/UploadButton';
import Input from '../../common/ui/Input';
import Select from '../../editor/sidebarPanelUI/Select';
import Picker from '../../common/ui/Picker';
import Delimiter from '../../editor/sidebarPanelUI/Delimiter';
import HelpIcon from '@material-ui/icons/Help';
import css from 'client/components/editor/formFields/EditorFieldLabel.pcss';
import ElementStylesForm from 'client/components/user/screens/ElementStylesForm';

interface ISlideshowStylesForm {
	values: Partial<ISlideshowStyles>;
	additionalFonts?: string[];
	setFieldValue: any;
	isModal?: boolean;
	showElementStyleSettings?: boolean;
}

const SlideshowStylesForm: React.FunctionComponent<ISlideshowStylesForm> = React.memo((props) => {
	const openHelpLink = () => {
		const win = window.open('https://github.com/d3/d3-ease', '_blank');

		win!.focus();
	};

	return (
		<>
			<Typography variant={props.isModal ? 'h6' : 'h5'} gutterBottom>
				Настройки стилей
			</Typography>
			<br />

			<FormControlLabel
				control={
					<Checkbox
						color="primary"
						name="hideProgressbar"
						checked={props.values.hideProgressbar || false}
						onChange={({target}) =>
							props.setFieldValue('hideProgressbar', target.checked)
						}
					/>
				}
				label="Скрывать полосу загрузки"
			/>

			<Input
				label="Длительность показа слайда (секунды)"
				name="slideDuration"
				value={props.values.slideDuration}
				type="number"
				inputProps={{min: 1, step: 1}}
			/>

			<Picker
				label="Цвет полосы загрузки"
				getHexColor={props.setFieldValue}
				name="barColorPrimary"
				color={props.values.barColorPrimary}
			/>
			<Picker
				label="Цвет фона полосы загрузки"
				getHexColor={props.setFieldValue}
				name="colorPrimary"
				color={props.values.colorPrimary}
			/>
			<Picker
				label="Цвет фона"
				getHexColor={props.setFieldValue}
				name="slideBackgroundColor"
				color={props.values.slideBackgroundColor}
			/>
			<UploadButton
				name="slideBackgroundImage"
				label="Изображение фона"
				onChange={props.setFieldValue}
				value={props.values.slideBackgroundImage}
			/>
			<Input
				label="Видео фона"
				name="slideBackgroundVideo"
				placeholder="Ссылка на видео, плейлист или канал"
				value={props.values.slideBackgroundVideo}
			/>
			<Select label="Отображение фона" name="slideBackgroundImageDisplay">
				{SlideshowBackgroundImageDisplay.getValues().map((value, index) => (
					<MenuItem value={value} key={index}>
						{SlideshowBackgroundImageDisplayText[value]}
					</MenuItem>
				))}
			</Select>
			<Select label="Эффект перехода" name="slideTransition">
				{SlideshowTransition.getValues().map((value, index) => (
					<MenuItem value={value} key={index}>
						{SlideshowTransitionText[value]}
					</MenuItem>
				))}
			</Select>
			<Input
				label="Длительность показа перехода (секунды)"
				name="slideTransitionLength"
				value={props.values.slideTransitionLength}
				type="number"
				inputProps={{min: 1, step: 1}}
			/>

			<Input
				label={
					<>
						<span>Тип функции перехода</span>{' '}
						<HelpIcon className={css.icon} onClick={openHelpLink} />
					</>
				}
				name="slideTransitionEasing"
				value={props.values.slideTransitionEasing}
				type="text"
			/>
			{props.showElementStyleSettings && (
				<>
					<Delimiter noMarge={props.isModal} /> <ElementStylesForm {...props} />
				</>
			)}
		</>
	);
});

export default SlideshowStylesForm;
