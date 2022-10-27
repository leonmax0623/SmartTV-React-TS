import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import {
	ISlideshowStyles,
	SlideshowFontFamily,
	SlideshowBackgroundImageDisplay,
	SlideshowBackgroundImageDisplayText,
	SlideshowFontFamilyText,
} from 'shared/collections/Slideshows';
import UploadButton from '../../common/ui/UploadButton';
import Input from '../../common/ui/Input';
import Select from '../../editor/sidebarPanelUI/Select';
import Picker from '../../common/ui/Picker';
import {googleFonts} from 'shared/models/GoogleFonts';

interface ISlideshowStylesForm {
	values: Partial<ISlideshowStyles>;
	additionalFonts?: string[];
	setFieldValue: any;
	isModal?: boolean;
	NoTitle?: boolean;
	showFonts?: boolean;
}

const ElementStylesForm: React.FunctionComponent<ISlideshowStylesForm> = React.memo((props) => {
	const googleSelectedFont = (props.additionalFonts || [])
		.concat(googleFonts)
		.find((family) => family === props.values.elementFontFamily);

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
				name="elementBackgroundColor"
				color={props.values.elementBackgroundColor}
			/>
			<UploadButton
				name="elementBackgroundImage"
				label="Изображение фона"
				onChange={props.setFieldValue}
				value={props.values.elementBackgroundImage}
			/>
			<Select label="Отображение фона" name="elementBackgroundImageDisplay">
				{SlideshowBackgroundImageDisplay.getValues().map((value, index) => (
					<MenuItem value={value} key={index}>
						{SlideshowBackgroundImageDisplayText[value]}
					</MenuItem>
				))}
			</Select>

			{props.showFonts && (
				<Select
					label="Шрифт"
					name="elementFontFamily"
					style={{
						fontFamily:
							googleSelectedFont ||
							(props.values.elementFontFamily &&
								SlideshowFontFamilyText[props.values.elementFontFamily]),
					}}
				>
					{props.additionalFonts?.map((family) => (
						<MenuItem value={family} key={family} style={{fontFamily: family}}>
							{family}
						</MenuItem>
					))}

					{SlideshowFontFamily.getValues().map((value, index) => (
						<MenuItem
							value={SlideshowFontFamilyText[value]}
							key={index}
							style={{fontFamily: SlideshowFontFamilyText[value]}}
							selected={props.values.elementFontFamily === value}
						>
							{SlideshowFontFamilyText[value]}
						</MenuItem>
					))}

					{googleFonts.map((family) => (
						<MenuItem
							value={family}
							key={family}
							style={{fontFamily: family}}
							selected={props.values.elementFontFamily === family}
						>
							{family}
						</MenuItem>
					))}
				</Select>
			)}

			<Input
				label="Размер текста"
				name="elementFontSize"
				value={props.values.elementFontSize}
				type="number"
			/>
			<Picker
				label="Цвет текста"
				getHexColor={props.setFieldValue}
				name="elementTextColor"
				color={props.values.elementTextColor}
			/>
		</>
	);
});

export default ElementStylesForm;
