import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import {ISlideElement, SocialElementsEnum} from 'shared/collections/SlideElements';
import {IFeedStyles} from 'client/types/elements';
import css from './SocialTemplates.pcss';

interface ISlideShowEditorSocialPanelProps {
	getElement?: (el: string) => (e: React.MouseEvent) => void;
	styles: IFeedStyles;
}

export default class TelegramTemplate extends React.PureComponent<
	ISlideShowEditorSocialPanelProps
> {
	render() {
		const {
			getElement,
			styles: {headerStyle, textStyle, timerStyle},
		} = this.props;
		return (
			<Grid container className={css.feedItem}>
				<Grid item xs={2}>
					<Avatar className={css.avatar} src="/public/img/medusa-logo.jpg" />
				</Grid>

				<Grid item xs={10}>
					<Typography
						variant="h4"
						className={css.pointer}
						onClick={getElement && getElement(SocialElementsEnum.HEADER)}
						style={headerStyle}
					>
						Название Канала
					</Typography>
				</Grid>

				<Grid
					item
					xs={12}
					className={css.description}
					onClick={getElement && getElement(SocialElementsEnum.TEXT)}
					style={textStyle}
				>
					<p>
						Давай просто будем. Не надо обещаний. Не надо ожидать невозможного. Ты
						будешь у меня, а я - у тебя. Давай просто будем друг у друга. Молча. Тихо. И
						по-настоящему.
					</p>
					<br />
					<p>«Три товарища»</p>
					<p>Эрих Мария Ремарк</p>
				</Grid>
				<Grid
					item
					xs={12}
					className={css.description}
					onClick={getElement && getElement(SocialElementsEnum.DATE)}
					style={timerStyle}
				>
					223.1к 09:55
				</Grid>
			</Grid>
		);
	}
}
