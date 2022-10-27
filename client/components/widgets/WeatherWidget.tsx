import React, {useState, useEffect} from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'react-meteor-data-with-tracker';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import UpdateIcon from '@material-ui/icons/Update';
import * as moment from 'moment';

import css from './WeatherWidget.pcss';
import {ISlideElement} from 'shared/collections/SlideElements';
import {OWMFeed, IOWMFeed, IOWMFeedItem} from 'shared/collections/OWMFeed';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';
import {publishNames} from 'shared/constants/publishNames';
import {methodNames} from 'shared/constants/methodNames';
import {Grid} from '@material-ui/core';

interface IWeatherWidgetProps extends ISlideElement {
	element: ISlideElement;
	errorFeed: boolean;
	feed?: IOWMFeed;
	dates: Date[];
	weathers: IOWMFeedItem[][];
}

const WeatherWidget: React.FC<IWeatherWidgetProps> = (props) => {
	const {element, weathers, errorFeed, dates, feed} = props;
	const {location} = element;
	const textStyles = {
		color: element.textColor,
		fontSize: element.fontSize,
		fontFamily: element.fontFamily,
	};
	const [error, setError] = useState(errorFeed);

	useEffect(() => {
		updateFeed();
	}, []);

	useEffect(() => {
		setError(errorFeed);
	}, [error]);

	const updateFeed = () => {
		if (!feed && element.location) {
			Meteor.call(methodNames.owm.update, element.location, (err: boolean) => {
				if (!err) setError(true);
			});
		}
	};

	const tempValue = (val: number) => {
		return val > 0 ? `+${val.toFixed()}` : val.toFixed();
	};

	const grndValue = (val: number) => {
		// Из hPa в мм рт ст
		return (val * 0.750062).toFixed(2);
	};

	const currentDate = (index: number) => dates[index];

	return (
		<div
			className={css.weatherWidget}
			style={{
				height: '100%',
				opacity: element.opacity,
				backgroundColor: element.backgroundColor,
				backgroundImage: getBackgroundImageUrl(element.backgroundImage),
				backgroundRepeat:
					element.backgroundImageDisplay !== SlideshowBackgroundImageDisplayEnum.TILE
						? 'no-repeat'
						: 'repeat',
				backgroundSize: getBackgroundImageSize(element.backgroundImageDisplay),
			}}
		>
			{error ? (
				<div>Произошла ошибка. Проверьте введенные данные.</div>
			) : (
				location && (
					<>
						{!element.hideTitle && (
							<Typography
								className={css.title}
								variant="h5"
								gutterBottom
								style={textStyles}
							>
								Прогноз погоды. Город {location}
							</Typography>
						)}

						{!!weathers?.length ? (
							weathers.map((list, index) => (
								<div key={index} className={css.day}>
									<Typography
										variant="h6"
										className={css.dayLabel}
										gutterBottom
										style={textStyles}
									>
										{currentDate(index)}
									</Typography>

									<Grid container className={css.items}>
										{list.map((item, ind) => (
											<Grid key={ind} item xs={3} className={css.item}>
												<div className={css.inner} style={textStyles}>
													<div className={css.interval}>
														{item.interval}
													</div>

													<div className={css.icon}>
														<img
															src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
															className="item-img"
															alt=""
														/>
													</div>

													<div className={css.temp}>
														{tempValue(item.main.temp)}
													</div>

													<div className={css.desc}>
														{item.weather[0].description}
													</div>

													<div className={css.hum}>
														Влажность: <b>{item.main.humidity}%</b>
													</div>

													<div className={css.pres}>
														Давление:
														<div>
															<b>
																{grndValue(item.main.grnd_level)} мм
																рт. ст.
															</b>
														</div>
													</div>

													<div className={css.windSpeed}>
														Скорость ветра:
														<div>
															<b>{item.wind.speed}</b>
														</div>
													</div>
												</div>
											</Grid>
										))}
									</Grid>
								</div>
							))
						) : (
							<div className={css.updateArea}>
								<Fab variant="extended" aria-label="Update" onClick={updateFeed}>
									<UpdateIcon className={css.icon} />
									Обновить данные
								</Fab>
							</div>
						)}
					</>
				)
			)}
		</div>
	);
};

const millSecond = 1000;
const intervals = {0: 'Ночь', 1: 'Утро', 2: 'День', 3: 'Вечер'};

export default withTracker<{}, IWeatherWidgetProps>(({element: {location, displayDays}}) => {
	const dates = [];
	let weathers: IOWMFeedItem[][] = [];
	let errorFeed = false;
	const defaultDisplayDays = 5;
	const count = displayDays || defaultDisplayDays;
	const feed: IOWMFeed | undefined = OWMFeed.findOne({location});

	Meteor.subscribe(publishNames.owm.feed, location);

	if (feed && feed.error) {
		errorFeed = true;
	} else if (feed && feed.list) {
		const weatherList = feed.list.filter((item) => {
			return (
				moment(item.dt * millSecond)
					.utc(false)
					.get('hours') %
					6 >
				0
			);
		});

		const groupedWeather: IOWMFeedItem[][] = [];
		let index = 0;

		const firstMomentDate = moment(weatherList[0].dt * millSecond);
		let curInterval = firstMomentDate.get('date');

		dates.push(
			firstMomentDate.format(
				firstMomentDate.isSame(new Date(), 'day')
					? '[Сегодня], DD MMMM'
					: '[Завтра], DD MMMM',
			),
		);

		groupedWeather.push([]);

		weatherList.forEach((weatherItem) => {
			const momentDate = moment(weatherItem.dt * millSecond);
			const interval = Math.floor(momentDate.get('hours') / 6);
			const nextInterval = momentDate.get('date');

			if (curInterval !== nextInterval) {
				dates.push(
					momentDate.calendar(null, {
						nextDay: '[Завтра], DD MMMM',
						nextWeek: 'dddd, DD MMMM',
					}),
				);
				curInterval = nextInterval;
				index += 1;
				groupedWeather.push([]);
			}

			groupedWeather[index].push({...weatherItem, interval: intervals[interval]});
		});

		const weather = groupedWeather[count - 1];
		weathers = weather ? [weather] : [];
	}

	const date = dates[count - 1];

	return {feed, weathers, errorFeed, dates: date ? [date] : []};
})(WeatherWidget);
