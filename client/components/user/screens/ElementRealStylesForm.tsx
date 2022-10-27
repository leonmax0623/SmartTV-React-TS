import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import {
	SlideshowBackgroundImageDisplay,
	SlideshowBackgroundImageDisplayText,
} from 'shared/collections/Slideshows';
import UploadButton from '../../common/ui/UploadButton';
import Input from '../../common/ui/Input';
import Select from '../../editor/sidebarPanelUI/Select';
import Picker from '../../common/ui/Picker';
import {IUpdateElementStyles} from 'shared/models/SlideshowMethodParams';
import {
	SlideElementBorderStyleDisplay,
	SlideElementBorderStyleDisplayEnum,
	SlideElementBorderStyleDisplayText,
} from 'shared/collections/SlideElements';
import Switch from 'client/components/editor/sidebarPanelUI/Switch';

interface ISlideshowStylesForm {
	values: Partial<IUpdateElementStyles>;
	additionalFonts?: string[];
	setFieldValue: any;
	isModal?: boolean;
	NoTitle?: boolean;
	showFonts?: boolean;
}

const DEFAULT_BORDER_WIDTH = 5;
const DEFAULT_COLOR = '#000';
const ElementStylesForm: React.FunctionComponent<ISlideshowStylesForm> = React.memo((props) => {
	//если тут понадобятся шрифты см SlidshowStyleForm

	const isBorderEnabled =
		!(props.values.borderStyle === null || props.values.borderStyle === undefined) &&
		!(props.values.borderWidth === null || props.values.borderWidth === undefined);

	const handleToggleIsBorderEnabled = (
		_: React.ChangeEvent<HTMLInputElement>,
		checked: boolean,
	) => {
		if (isBorderEnabled) {
			props.setFieldValue('borderStyle', null);
			props.setFieldValue('borderWidth', null);
		} else {
			props.setFieldValue('borderStyle', SlideElementBorderStyleDisplayEnum.solid);
			props.setFieldValue('borderWidth', DEFAULT_BORDER_WIDTH);
		}
	};

	const useImageAsBorder =
		props.values.borderColor === null || props.values.borderColor === undefined;
	const handleToggleUseImage = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		if (useImageAsBorder) {
			props.setFieldValue('borderStyle', SlideElementBorderStyleDisplayEnum.solid);
			props.setFieldValue('borderColor', DEFAULT_COLOR);
			props.setFieldValue('borderImage', null);
		} else {
			props.setFieldValue('borderColor', null);
		}
	};

	return (
		<>
			{!props.NoTitle && (
				<>
					<Typography variant={props.isModal ? 'h6' : 'h5'} gutterBottom>
						Настройки элементов
					</Typography>
					<br />
				</>
			)}
			<Picker
				label="Цвет фона"
				getHexColor={props.setFieldValue}
				name="backgroundColor"
				color={props.values.backgroundColor}
			/>
			<UploadButton
				name="backgroundImage"
				label="Изображение фона"
				onChange={props.setFieldValue}
				value={props.values.backgroundImage}
			/>
			<Select label="Отображение фона" name="backgroundImageDisplay">
				{SlideshowBackgroundImageDisplay.getValues().map((value, index) => (
					<MenuItem value={value} key={index}>
						{SlideshowBackgroundImageDisplayText[value]}
					</MenuItem>
				))}
			</Select>

			<Input
				label="Размер текста"
				name="fontSize"
				value={props.values.fontSize}
				type="number"
			/>
			<Picker
				label="Цвет текста"
				getHexColor={props.setFieldValue}
				name="textColor"
				color={props.values.textColor}
			/>
			<Typography variant={props.isModal ? 'h6' : 'h5'} gutterBottom>
				Настройки границ элемента
			</Typography>
			<br />
			<Switch
				label="Добавить к элементу границы"
				checked={isBorderEnabled}
				onChange={handleToggleIsBorderEnabled}
			/>
			{isBorderEnabled && (
				<>
					<Input
						label="Размер границы"
						name="borderWidth"
						value={props.values.borderWidth}
						type="number"
					/>

					{!useImageAsBorder && (
						<Select label="Тип границы" name="borderStyle">
							{SlideElementBorderStyleDisplay.getValues().map((value, index) => (
								<MenuItem value={value} key={index}>
									{SlideElementBorderStyleDisplayText[value]}
								</MenuItem>
							))}
						</Select>
					)}
					{!useImageAsBorder && (
						<Picker
							label="Цвет границы"
							getHexColor={props.setFieldValue}
							name="borderColor"
							color={props.values.borderColor}
						/>
					)}

					<Switch
						label="Использовать картинку в качестве фона"
						checked={useImageAsBorder}
						onChange={handleToggleUseImage}
					/>

					{useImageAsBorder && (
						<UploadButton
							name="borderImage"
							label="Граница на основе картинки"
							onChange={props.setFieldValue}
							value={props.values.borderImage}
						/>
					)}
				</>
			)}
		</>
	);
});

export default ElementStylesForm;
