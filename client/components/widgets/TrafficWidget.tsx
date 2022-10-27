import * as React from 'react';

import {ISlideElement, SlideElementTrafficServiceEnum} from 'shared/collections/SlideElements';
import {CityGidTraffic} from 'client/components/common/traffic/CityGidTraffic';
import css from './TrafficWidget.pcss';

interface ITrafficWidgetData {
	element: ISlideElement;
}

export default class TrafficWidget extends React.PureComponent<ITrafficWidgetData> {
	element: HTMLElement | null;
	image: HTMLImageElement | null;

	componentDidMount() {
		if (!this.image) {
			return;
		}

		this.image.addEventListener('load', this.imageLoad);
	}

	imageLoad = () => {
		if (!this.element || !this.image) {
			return;
		}

		const parentProportions = this.element.offsetWidth / this.element.offsetHeight;
		const imgProportions = this.image.naturalWidth / this.image.naturalHeight;

		// TODO разобраться почему условие не срабатыает
		if (imgProportions > parentProportions) {
			this.image.style.height = '100%';
			this.image.style.width = 'auto';
		}
	};

	render() {
		// Максимальный размер 650x450
		const {
			_id,
			location,
			lat,
			lon,
			zoom,
			width,
			height,
			opacity,
			trafficService,
		} = this.props.element;
		let serviceView;

		if (location && lat && lon && zoom) {
			serviceView =
				!trafficService || trafficService === SlideElementTrafficServiceEnum.YANDEX ? (
					<>
						<img
							className={css.map}
							ref={(el) => {
								this.image = el;
							}}
							src={`https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=${zoom}&size=${
								width > 650 ? 650 : width
							},${height > 450 ? 450 : height}&l=map,trf`}
							alt=""
						/>

						<div className={css.logoOuter}>
							<img src="/img/ya-logo.png" className={css.logo} alt="" />
						</div>

						<div className={css.fixMask} />
					</>
				) : (
					<CityGidTraffic
						id={_id}
						lat={lat}
						lon={lon}
						zoom={zoom}
						element={this.props.element}
					/>
				);
		}

		return (
			<div
				ref={(el) => {
					this.element = el;
				}}
				className={css.traffic}
				style={{opacity}}
			>
				<>
					{!location ? (
						<div className="alert alert-warning" role="alert">
							Чтобы отобразить пробки в городе, введите название города и точный
							адрес, если необходимо показать район.
						</div>
					) : (
						<>
							{!lat || !lon ? (
								<div className="alert alert-warning" role="alert">
									Не найдены координаты указанного адреса, проверьте адрес или
									повторите попытку позже.
								</div>
							) : (
								serviceView
							)}
						</>
					)}
				</>
			</div>
		);
	}
}
