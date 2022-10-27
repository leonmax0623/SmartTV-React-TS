import 'leaflet/dist/leaflet.css';
// tslint:disable-next-line:no-import-side-effect
import 'leaflet/dist/leaflet';

import React from 'react';
import {ISlideElement} from 'shared/collections/SlideElements';
import classNames from 'classnames';
// @ts-ignore
import css from './CityGidTraffic.pcss';

interface ICityGidTrafficProps {
	// id: string;
	lat: string;
	lon: string;
	zoom: number;
	element: ISlideElement;
}

interface ICityGidTrafficState {
	updateMap?: boolean;
}

const jamTilesUrl = 'https://api.probki.net/jam/{z}/{x}/{y}';

export class CityGidTraffic extends React.Component<ICityGidTrafficProps, ICityGidTrafficState> {
	map: any;
	mapRef: HTMLDivElement | null;

	state = {updateMap: false};

	componentDidMount() {
		this.initMap();
	}

	componentDidUpdate(prevProps: Readonly<ICityGidTrafficProps>) {
		const {lat, lon, zoom} = this.props;

		if (!this.map) {
			return;
		}

		if (prevProps.zoom !== zoom) {
			this.map.setZoom(zoom);
		}

		if (prevProps.lat !== lat) {
			this.map.setView({lat, lon});
		}
	}

	shouldComponentUpdate(nextProps: Readonly<ICityGidTrafficProps>) {
		const {width, height} = this.props.element;

		if (width !== nextProps.element.width || height !== nextProps.element.height) {
			this.setState({updateMap: true}, () => this.setState({updateMap: false}, this.initMap));
		}

		return true;
	}

	initMap = () => {
		const {lat, lon, zoom} = this.props;

		// @ts-ignore
		this.map = L.map(this.mapRef, {
			zoom,
			// @ts-ignore
			center: L.latLng(lat, lon),
			zoomControl: false,
		});

		// @ts-ignore
		L.tileLayer(jamTilesUrl, {
			maxZoom: 18,
			minZoom: 5,
		}).addTo(this.map);

		if (this.mapRef) {
			const copyright = this.mapRef.querySelector(
				'.leaflet-bottom.leaflet-right',
			) as HTMLDivElement;
			const img = document.createElement('img');

			img.src = '/img/cg-logo.jpg';
			img.className = css.logo;

			if (copyright) {
				copyright.innerHTML = '';
				copyright.appendChild(img);
				copyright.className = classNames(copyright.className, css.copyright);
			}
		}
	};

	render() {
		const {updateMap} = this.state;

		if (updateMap) {
			return null;
		}

		return (
			<div style={{position: 'relative', width: '100%', height: '100%'}}>
				<div ref={(el) => (this.mapRef = el)} style={{width: '100%', height: '100%'}} />

				<div style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}} />
			</div>
		);
	}
}
