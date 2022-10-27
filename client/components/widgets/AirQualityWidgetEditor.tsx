import React, {useState, useEffect} from 'react';
import {Map, Placemark} from 'react-yandex-maps';
import {Meteor} from 'meteor/meteor';
import {connect} from 'react-redux';
import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';

import {ISlideElement} from 'shared/collections/SlideElements';
import {methodNames} from 'shared/constants/methodNames';
import {updateSlideElement} from 'client/actions/slideShowEditor';
import css from './AirQualityWidget.pcss';

interface IAirQualityWidgetEditor {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

export interface IPlacemark {
	value: string;
	geometry: number[];
	category: string;
}

export interface IAirQualityItemAQ {
	_attributes: {
		AQI: string;
		category: string;
		feed: string;
		name: string;
		pdk: string;
		srcT: string;
		type: string;
		unit: string;
		value: string;
	};
}

export interface IAirQualityItem {
	AQ: IAirQualityItemAQ[];
	_attributes: {
		AQI: string;
		allDay: string;
		category: string;
		day: string;
		feed: string;
		key: string;
		lat: string;
		lon: string;
		maxName: string;
		maxType: string;
		name: string;
		pdk: string;
		srcT: string;
		stationCode: string;
		stationName: string;
		time: string;
		to: string;
		type: string;
	};
}

export const iconSize = 38;
export const placemarkProperties = (value: string, category: string) => ({
	iconContent: `<div
        style="
            font-weight: bold;
            color: ${['1'].includes(category) ? '#000' : '#fff'};
            width: ${iconSize}px;
            height: ${iconSize}px;
            display: flex;
            align-items: center;
            justify-content: center;
        "
        >
			<div>${value}</div>
		</div>`,
});
export const placemarkOptions = (category: number) => {
	return {
		iconLayout: 'default#imageWithContent',
		iconImageHref: `/img/aq${category}.png`,
		iconImageSize: [iconSize, iconSize],
		iconImageOffset: [-iconSize / 2, -iconSize / 2],
		iconContentOffset: [0, 0],
	};
};

const AirQualityWidgetEditor: React.FC<IAirQualityWidgetEditor> = ({element, ...props}) => {
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

		getData(false);

		map.controls.add('zoomControl', {top: 75, left: 5});
		setListeners(map.events.group().add('boundschange', debounceSetCenter));

		return () => {
			setMap(null);
		};
	}, [map]);

	useEffect(() => {
		if (!map) {
			return;
		}

		getData(false);

		listeners.removeAll();
		setListeners(map.events.group().add('boundschange', debounceSetCenter));
	}, [substanceType]);

	const setRef = (m: any) => setMap(m);
	const getData = (setCenter = true) => {
		if (setCenter) {
			props.updateSlideElement(element, {
				airQualityCoordinates: map.getCenter(),
				zoom: map.getZoom(),
			});
		}

		Meteor.callAsync(methodNames.airQuality.getData, {
			iconSize,
			substanceType,
			bounds: map.getBounds(),
			elementWidth: width,
			elementHeight: height,
		}).then((aq: {AirQuality?: IAirQualityItem[]; copyright: {_text: string}}) => {
			if (!isArray(aq.AirQuality)) {
				setPlacemarks([]);
				return;
			}

			setPlacemarks(
				(aq.AirQuality || []).map(({_attributes: {AQI, lat, lon, category}}) => ({
					category,
					value: AQI,
					geometry: [Number(lat), Number(lon)],
				})) || [],
			);

			if (aq.copyright?._text) {
				setCopyright(decodeURI(aq.copyright._text));
			}

			setCopyright('');
		});
	};
	const debounceSetCenter = debounce(getData, 2000);

	return (
		<div style={{opacity, position: 'relative'}}>
			<Map
				instanceRef={setRef}
				defaultState={{zoom, center: airQualityCoordinates}}
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

			<div className={css.copyright}>{copyright}</div>
		</div>
	);
};

export default connect(null, {updateSlideElement})(AirQualityWidgetEditor);
