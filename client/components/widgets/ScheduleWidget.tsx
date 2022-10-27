import * as React from 'react';
import * as moment from 'moment';
import {Meteor} from 'meteor/meteor';
// @ts-ignore
import {withTracker} from 'react-meteor-data-with-tracker';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import {
	ISlideElement,
	SlideElementTransportTypeEnumDisplay,
} from 'shared/collections/SlideElements';
import {YaScheduleFeed, IYaScheduleFeed} from 'shared/collections/YaScheduleFeed';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';
import {Autoscroll} from '../../utils/slides/autoscroll';
// @ts-ignore
import css from './ScheduleWidget.pcss';
import {publishNames} from 'shared/constants/publishNames';
import {methodNames} from 'shared/constants/methodNames';

interface IScheduleWidgetProps {
	element: ISlideElement;
	inCurrentSlide: boolean;
}

interface IScheduleWidgetData {
	feed: IYaScheduleFeed;
}

class ScheduleWidget extends React.PureComponent<IScheduleWidgetProps & IScheduleWidgetData> {
	element: HTMLElement;
	autoscroll: any; // TODO определить тип

	componentDidMount() {
		if (this.props.inCurrentSlide) {
			this.autoscroll = new Autoscroll(this.element);
			this.autoscroll.start();
		}
	}

	componentDidUpdate(prevProps: Readonly<IScheduleWidgetProps> & IScheduleWidgetData) {
		const {inCurrentSlide, element} = this.props;

		if (this.autoscroll && inCurrentSlide && prevProps.inCurrentSlide) {
			this.autoscroll.remove();
			this.autoscroll.start();
		}

		if (inCurrentSlide && !prevProps.inCurrentSlide) {
			this.autoscroll = new Autoscroll(this.element);
			this.autoscroll.start();
		}

		if (
			(inCurrentSlide && !prevProps.inCurrentSlide) ||
			element.transportType !== prevProps.element.transportType ||
			element.fromCity !== prevProps.element.fromCity ||
			element.toCity !== prevProps.element.toCity
		) {
			Meteor.call(methodNames.ya.getYaSchedule, {
				transport: element.transportType,
				from: element.fromCity,
				to: element.toCity,
			});
		}
	}

	componentWillUnmount() {
		if (!this.autoscroll) {
			return;
		}

		this.autoscroll.remove();
	}

	moFormat = (date: Date) => {
		return moment(date).format('HH:mm');
	};

	schedule = () => {
		return this.props.feed;
	};

	formatDuration = (duration: number) => {
		const total = duration / 3600;
		const hours = Math.trunc(total);
		const minutes = Math.round((total - hours) * 60);

		return `${hours} ч ${minutes} мин`;
	};

	error = () => {
		const {feed} = this.props;

		return feed && feed.errorMessage ? feed.errorMessage : false;
	};

	isHaveSegments = (segments) => {
		return segments && segments.length;
	};

	render() {
		const {
			transportType,
			fromCity,
			toCity,
			opacity,
			backgroundColor,
			backgroundImage,
			backgroundImageDisplay,
			textColor,
			fontSize,
			fontFamily,
		} = this.props.element;

		const textStyles = {
			fontSize,
			fontFamily,
			color: textColor,
		};

		return (
			<div
				className={css.container}
				ref={(el) => {
					if (!el) {
						return;
					}

					this.element = el;
				}}
				style={{
					opacity,
					backgroundColor,
					backgroundImage: getBackgroundImageUrl(backgroundImage),
					backgroundRepeat:
						backgroundImageDisplay !== SlideshowBackgroundImageDisplayEnum.TILE
							? 'no-repeat'
							: 'repeat',
					backgroundSize: getBackgroundImageSize(backgroundImageDisplay),
					color: textColor,
				}}
			>
				{!this.schedule() ? (
					<div>{this.error() || <p>Укажите какие либо данные</p>}</div>
				) : (
					<>
						<Typography variant="h6" gutterBottom style={textStyles}>
							Расписание транспорта и билеты на{' '}
							{SlideElementTransportTypeEnumDisplay[transportType]}. {fromCity} -{' '}
							{toCity} (
							{moment(this.schedule().lastUpdate).format('DD.MM.YY - HH:mm')})
						</Typography>

						{!this.isHaveSegments(this.schedule().segments) ? (
							<div>
								<p>Ничего не найденно</p>
							</div>
						) : (
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell style={textStyles} align="center">
											Маршрут
										</TableCell>
										<TableCell style={textStyles} align="center">
											Отправление
										</TableCell>
										<TableCell style={textStyles} align="center">
											Длительность
										</TableCell>
										<TableCell style={textStyles} align="center">
											Место назначения
										</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{this.schedule().segments.map((segment) => (
										<TableRow key={segment.thread.uid}>
											<TableCell style={textStyles} align="center">
												<Typography gutterBottom style={textStyles}>
													{segment.thread.title}
												</Typography>

												{segment.thread.carrier &&
													segment.thread.carrier.title && (
														<Typography
															variant="caption"
															style={textStyles}
														>
															{segment.thread.carrier.title}
														</Typography>
													)}
											</TableCell>

											<TableCell style={textStyles} align="center">
												{this.moFormat(segment.departure)}

												<br />

												{segment.from && segment.from.popular_title
													? segment.from.popular_title
													: `${segment.from.title} ${segment.from.station_type_name}`}
											</TableCell>

											<TableCell style={textStyles} align="center">
												{this.formatDuration(segment.duration)}
											</TableCell>

											<TableCell style={textStyles} align="center">
												{this.moFormat(segment.arrival)}

												<br />

												{segment.to && segment.to.popular_title
													? segment.to.popular_title
													: `${segment.to.title} ${segment.to.station_type_name}`}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</>
				)}
			</div>
		);
	}
}

let isDataLoad = false;

export default withTracker<IScheduleWidgetData, IScheduleWidgetProps>(({element}) => {
	const {transportType, fromCity, toCity} = element;

	const ready = Meteor.subscribe(publishNames.ya.feed, {
		transport: transportType,
		from: fromCity,
		to: toCity,
	});
	const feed = YaScheduleFeed.findOne({
		transport: transportType,
		from: fromCity,
		to: toCity,
	});

	if (ready.ready() && !isDataLoad) {
		isDataLoad = true;

		Meteor.call(methodNames.ya.getYaSchedule, {
			transport: transportType,
			from: fromCity,
			to: toCity,
		});
	}

	return {feed};
})(ScheduleWidget);
