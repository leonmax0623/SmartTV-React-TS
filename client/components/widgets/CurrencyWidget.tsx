import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'react-meteor-data-with-tracker';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import css from './CurrencyWidget.pcss';
import {ISlideElement} from 'shared/collections/SlideElements';
import {CurrencyFeed, ICurrencyItem} from 'shared/collections/CurrencyFeed';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';

interface ICurrencyWidgetProps {
	element: ISlideElement;
}

interface ICurrencyWidgetData {
	ready: boolean;
	feed: any;
}

interface ICurrencyWidgetState {
	loading: boolean;
}

class CurrencyWidget extends React.PureComponent<
	ICurrencyWidgetProps & ICurrencyWidgetData,
	ICurrencyWidgetState
> {
	state = {loading: false};

	// componentDidMount(): void {
	// 	this.updateData();
	// }
	//
	// componentDidUpdate(): void {
	// 	this.updateData();
	// }

	currencies = () => {
		const {element, feed} = this.props;
		const {currencyList} = element;

		if (currencyList && currencyList.length && feed && (feed.today || feed.tomorrow)) {
			const {today, tomorrow} = feed;

			return (
				(today || tomorrow).currency.filter((currency: ICurrencyItem) =>
					currencyList.includes(currency.CharCode),
				) || ''
			);
		}

		return [];
	};

	toDate = () => {
		const {feed} = this.props;

		if (feed && (feed.today || feed.tomorrow)) {
			const {today, tomorrow} = feed;

			return moment((today || tomorrow).date).format('DD.MM.YYYY');
		}

		return;
	};

	// updateData = () => {
	// 	const {ready, feed} = this.props;
	//
	// 	if (ready && !feed) {
	// 		Meteor.call('currency.update', (error, result) => {
	// 			if (result) {
	// 				this.setState({loading: true});
	// 			}
	// 		});
	// 	}
	// };

	render() {
		const {
			opacity,
			textColor,
			backgroundColor,
			backgroundImage,
			backgroundImageDisplay,
			currencyList,
			fontSize,
			fontFamily,
		} = this.props.element;
		const {loading} = this.state;

		const textStyles = {
			fontSize,
			fontFamily,
			color: textColor,
		};

		return (
			<div
				style={{
					opacity,
					backgroundColor,
					height: '100%',
					color: textColor,
					backgroundImage: getBackgroundImageUrl(backgroundImage),
					backgroundRepeat:
						backgroundImageDisplay !== SlideshowBackgroundImageDisplayEnum.TILE
							? 'no-repeat'
							: 'repeat',
					backgroundSize: getBackgroundImageSize(backgroundImageDisplay),
				}}
			>
				{!this.currencies().length ? (
					<>
						{loading && <p>Загрузка данных...</p>}

						{(!currencyList || !currencyList.length) && (
							<p>Укажите валюту для отображения!</p>
						)}
					</>
				) : (
					<>
						<Typography
							variant="h6"
							align="center"
							gutterBottom
							classes={{root: css.colorReset}}
							style={textStyles}
						>
							Курс валют на {this.toDate()}
						</Typography>

						<div>
							<Table size="small">
								<TableBody>
									{this.currencies().map((cur: ICurrencyItem) => (
										<TableRow key={cur.CharCode}>
											<TableCell
												classes={{body: css.colorReset}}
												size="small"
												style={textStyles}
												align="center"
											>
												{cur.CharCode}
											</TableCell>
											<TableCell
												classes={{body: css.colorReset}}
												size="small"
												style={textStyles}
												align="center"
											>
												{cur.CharCode}/RUB
											</TableCell>
											<TableCell
												classes={{body: css.colorReset}}
												size="small"
												style={textStyles}
												align="center"
											>
												{cur.Value}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</>
				)}
			</div>
		);
	}
}

export default withTracker<ICurrencyWidgetData, ICurrencyWidgetProps>(() => {
	const ready = Meteor.subscribe('currency_feed').ready();
	const feed = CurrencyFeed.findOne();

	return {ready, feed};
})(CurrencyWidget);
