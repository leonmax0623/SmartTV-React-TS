import * as React from 'react';
import {Meteor} from 'meteor/meteor';
import moment from 'moment';
import {withTracker} from 'react-meteor-data-with-tracker';

import {ISlideElement, SlideElementClockViewEnum} from 'shared/collections/SlideElements';
import {CitiesCollection, ICity} from 'shared/collections/Cities';
import {publishNames} from 'shared/constants/publishNames';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import './ClockWidget.scss';
import {SlideshowBackgroundImageDisplayEnum} from 'shared/collections/Slideshows';

interface IClockWidgetProps {
	element: ISlideElement;
}

interface IClockWidgetData {
	city: ICity;
	loading: boolean;
}

interface IClockWidgetState {
	clock?: string;
	date?: string;
}

class ClockWidget extends React.PureComponent<
	IClockWidgetProps & IClockWidgetData,
	IClockWidgetState
> {
	state = {clock: '', date: undefined};
	timer: NodeJS.Timeout;

	componentDidUpdate() {
		const {city, element} = this.props;

		if (city && element.city) {
			if (this.timer) {
				clearInterval(this.timer);
			}

			// start new ticker
			this.timer = setInterval(() => {
				let utc = city.utcoffset || 3, // UTC+3 is default value
					cl = moment()
						.locale('ru')
						.utc()
						.add(utc, 'hours');

				// the element can display either date or time
				this.setState({
					date: cl.format('D MMMM YYYY'),
					clock: cl.format('HH:mm'),
				});
			}, 500);
		}
	}

	componentWillUnmount() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}

	clockObj = () => {
		let str = this.state.clock;

		if (!str) {
			return;
		}

		return {
			hours: str.substring(0, 2),
			minutes: str.substring(3),
		};
	};

	render() {
		const {city, element, loading} = this.props;
		const {date} = this.state;
		const time = this.clockObj();

		return (
			<div
				className="el-clock"
				style={{
					fontSize: element.fontSize,
					opacity: element.opacity,
					color: element.textColor,
					fontFamily: element.fontFamily,
					backgroundColor: element.backgroundColor,
					backgroundImage: getBackgroundImageUrl(element.backgroundImage),
					backgroundRepeat:
						element.backgroundImageDisplay !== SlideshowBackgroundImageDisplayEnum.TILE
							? 'no-repeat'
							: 'repeat',
					backgroundSize: getBackgroundImageSize(element.backgroundImageDisplay),
				}}
			>
				<div className="el-clock-inner">
					{loading ? (
						'Загрузка...'
					) : (
						<>
							{!city ? (
								<div className="alert alert-info" role="alert">
									Укажите город, чтобы показать текущее время или дату.
								</div>
							) : (
								<>
									<div className="city">{element.city}</div>

									{element.clockView !== SlideElementClockViewEnum.CLOCK ? (
										<div className="date">{date}</div>
									) : (
										<div>
											<span className="digits">{time && time.hours}</span>
											<span className="colon blink">:</span>
											<span className="digits">{time && time.minutes}</span>
										</div>
									)}
								</>
							)}
						</>
					)}
				</div>
			</div>
		);
	}
}

export default withTracker<IClockWidgetData, IClockWidgetProps>(({element}) => {
	const sub = Meteor.subscribe(publishNames.cities.oneCity, element.city);

	return {
		loading: !sub.ready(),
		city: CitiesCollection.findOne({name: element.city}),
	};
})(ClockWidget);
