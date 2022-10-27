import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import {ISlideElement, SocialElementsEnum} from 'shared/collections/SlideElements';
import {IFeedStyles} from 'client/types/elements';
import css from './SocialTemplates.pcss';

interface ISlideShowEditorSocialPanelProps {
	getElement: (el: string) => void;
	styles: IFeedStyles;
}

export default class VkTemplate extends React.PureComponent<ISlideShowEditorSocialPanelProps> {
	render() {
		const {
			getElement,
			styles: {headerStyle, textStyle, timerStyle},
		} = this.props;

		return (
			<Grid container className={css.feedItem}>
				<Grid item xs={2}>
					<Avatar
						className={css.avatar}
						src="https://pp.userapi.com/c302205/v302205950/867a/dnfDZPh3Zws.jpg?ava=1"
					/>
				</Grid>

				<Grid item xs={10}>
					<Typography
						variant="h4"
						className={css.pointer}
						onClick={getElement(SocialElementsEnum.HEADER)}
						style={headerStyle}
					>
						Группа
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
					<p>
						Давай просто будем. Не надо обещаний. Не надо ожидать невозможного. Ты
						будешь у меня, а я - у тебя. Давай просто будем друг у друга. Молча. Тихо. И
						по-настоящему.
					</p>
					<br />
					<p>«Три товарища»</p>
					<p>Эрих Мария Ремарк</p>
				</Grid>
			</Grid>
		);
	}
}
