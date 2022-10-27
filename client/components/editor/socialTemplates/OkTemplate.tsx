import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import OdnoklassnikiIcon from '../../editor/icons/OdnoklassnikiIcon';
import {SocialElementsEnum} from 'shared/collections/SlideElements';
import {IFeedStyles} from 'client/types/elements';
import css from './SocialTemplates.pcss';

interface ISlideShowEditorSocialPanelProps {
	getElement: (el: string) => void;
	styles: IFeedStyles;
}

export default class OkTemplate extends React.PureComponent<ISlideShowEditorSocialPanelProps> {
	render() {
		const {
			styles: {headerStyle, textStyle, timerStyle},
			getElement,
		} = this.props;

		return (
			<Grid container spacing={6} className={css.feedItem}>
				<Grid item>
					<OdnoklassnikiIcon />
				</Grid>

				<Grid item>
					<Typography
						variant="h4"
						gutterBottom
						className={css.pointer}
						onClick={getElement(SocialElementsEnum.HEADER)}
						style={headerStyle}
					>
						Название группы OK
					</Typography>
					<div
						onClick={getElement(SocialElementsEnum.DATE)}
						className={css.pointer}
						style={timerStyle}
					>
						14 Марта в 20.00
					</div>
				</Grid>

				<Grid
					item
					xs={12}
					className={css.description}
					onClick={getElement(SocialElementsEnum.TEXT)}
					style={textStyle}
				>
					<Typography gutterBottom>
						Есть поверье, что в День святого Патрика четырёхлистный клевер принесёт
						удачу, а пойманный лепрекон подарит горшочек с золотом
					</Typography>
					<Typography gutterBottom>
						Отличный повод для таксипортации! Кого поедете искать?
					</Typography>
				</Grid>
			</Grid>
		);
	}
}
