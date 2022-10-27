import React, {useState, useEffect} from 'react';
import {YMaps, Map, Placemark} from 'react-yandex-maps';
import {Meteor} from 'meteor/meteor';
import isArray from 'lodash/isArray';

import appConsts from 'client/constants/appConsts';
import {ISlideElement} from 'shared/collections/SlideElements';
import {methodNames} from 'shared/constants/methodNames';
import {
	IPlacemark,
	iconSize,
	IAirQualityItem,
	placemarkProperties,
	placemarkOptions,
} from 'client/components/widgets/AirQualityWidgetEditor';
import css from './AirQualityWidget.pcss';

interface IAirQualityWidget {
	element: ISlideElement;
}

const AirQualityWidget: React.FC<IAirQualityWidget> = ({element}) => {
	const {opacity, zoom, width, height, airQualityCoordinates, substanceType} = element;
	const [listeners, setListeners] = useState<any>(undefined);

	if (!airQualityCoordinates || !zoom) {
		return null;
	}

	const [map, setMap] = useState<any>(null);
	const [placemarks, setPlacemarks] = useState<IPlacemark[]>([]);
	const [copyright, setCopyright] = useState('');

	useEffect(() => {
		if (!map) {
			return;
		}

		handleSetPlacemarks();

		setListeners(map.events.group().add('boundschange', handleSetPlacemarks));

		return () => {
			setMap(null);
		};
	}, [map]);

	useEffect(() => {
		if (!map) {
			return;
		}

		handleSetPlacemarks();

		listeners.removeAll();
		setListeners(map.events.group().add('boundschange', handleSetPlacemarks));
	}, [substanceType]);

	const setRef = (m: any) => setMap(m);
	const handleSetPlacemarks = () => {
		Meteor.callAsync(methodNames.airQuality.getData, {
			iconSize,
			substanceType,
			bounds: map.getBounds(),
			elementWidth: width,
			elementHeight: height,
		}).then((aq: {AirQuality?: IAirQualityItem[]; copyright: {_text: string}}) => {
			if (!isArray(aq.AirQuality)) {
				setPlacemarks([]);
			} else {
				setPlacemarks(
					(aq.AirQuality || []).map(({_attributes: {AQI, lat, lon, category}}) => ({
						category,
						value: AQI,
						geometry: [Number(lat), Number(lon)],
					})) || [],
				);
			}

			if (aq.copyright?._text) {
				setCopyright(decodeURI(aq.copyright._text));
			} else {
				setCopyright('');
			}
		});
	};

	return (
		<div style={{opacity, position: 'relative'}}>
			<YMaps
				enterprise
				query={{...appConsts.ya.apiKey, load: 'Map,Placemark,layout.ImageWithContent'}}
				preload
			>
				<Map
					instanceRef={setRef}
					state={{zoom, center: airQualityCoordinates}}
					width={width}
					height={height}
				>
					{placemarks.map(({value, category, geometry}, index) => (
						<Placemark
							key={index}
							properties={placemarkProperties(value, category)}
							options={placemarkOptions(Number(category))}
							geometry={geometry}
						/>
					))}
				</Map>
			</YMaps>

			<div className={css.copyright}>{copyright}</div>
		</div>
	);
};

export default AirQualityWidget;
