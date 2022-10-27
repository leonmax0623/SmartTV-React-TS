import React from 'react';
// @ts-ignore
import loadScript from 'load-script';

import {appConfig} from 'client/constants/config';

const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';
let scriptLoadingStarted = false;

interface IGooglePickerProps {
	multiselect?: boolean;
	navHidden?: boolean;
	authImmediate?: boolean;
	mimeTypes?: string[];
	viewId?: string;
	scope?: string[];
	disabled?: boolean;
	origin?: string;
	onChange: (data: any) => void;
	onAuthenticate: (oauthToken: string) => void;
	onAuthFailed: (data: any) => void;
	createPicker?: (google: any, oauthToken: string) => void;
}

export default class GooglePicker extends React.PureComponent<IGooglePickerProps> {
	static defaultProps = {
		onChange: () => {},
		onAuthenticate: () => {},
		onAuthFailed: () => {},
		scope: [
			'https://www.googleapis.com/auth/drive.file',
			'https://www.googleapis.com/auth/photos',
		],
		viewId: 'DOCS_IMAGES',
		authImmediate: false,
		multiselect: false,
		navHidden: false,
		disabled: false,
	};

	constructor(props: IGooglePickerProps) {
		super(props);

		this.onApiLoad = this.onApiLoad.bind(this);
		this.onChoose = this.onChoose.bind(this);
	}

	componentDidMount() {
		if (this.isGoogleReady()) {
			// google api is already exists
			// init immediately
			this.onApiLoad();
		} else if (!scriptLoadingStarted) {
			// load google api and the init
			scriptLoadingStarted = true;
			loadScript(GOOGLE_SDK_URL, this.onApiLoad);
		} else {
			// is loading
		}
	}

	isGoogleReady() {
		return !!window.gapi;
	}

	isGoogleAuthReady() {
		return !!window.gapi.auth2;
	}

	isGooglePickerReady() {
		return !!window.google.picker;
	}

	onApiLoad() {
		window.gapi.load('auth2');
		window.gapi.load('picker');
	}

	doAuth(callback) {
		window.gapi.auth2.init({client_id: appConfig.GOOGLE_CLIENT_ID}).then((googleAuth) => {
			googleAuth
				.signIn({scope: this.props.scope.join(' ')})
				.then((result) => callback(result.getAuthResponse()));
		});
	}

	onChoose = () => {
		if (
			!this.isGoogleReady() ||
			!this.isGoogleAuthReady() ||
			!this.isGooglePickerReady() ||
			this.props.disabled
		) {
			return;
		}

		const authInst = window.gapi.auth2.getAuthInstance();
		const oauth = authInst && authInst.currentUser.get().getAuthResponse();
		const oauthToken = oauth && oauth.access_token;

		if (oauthToken) {
			this.createPicker(oauthToken);
		} else {
			this.doAuth((response) => {
				if (response.access_token) {
					this.createPicker(response.access_token);
				} else {
					this.props.onAuthFailed(response);
				}
			});
		}
	};

	createPicker(oauthToken: string) {
		this.props.onAuthenticate(oauthToken);

		if (this.props.createPicker) {
			return this.props.createPicker(google, oauthToken);
		}

		const googleViewId = google.picker.ViewId[this.props.viewId];
		const view = new window.google.picker.DocsView(googleViewId);

		view.setEnableDrives(false);

		if (this.props.mimeTypes) {
			view.setMimeTypes(this.props.mimeTypes.join(','));
		}

		if (!view) {
			throw new Error("Can't find view by viewId");
		}

		const picker = new window.google.picker.PickerBuilder()
			.addView(view)
			.addView(new google.picker.DocsUploadView())
			// .addView(google.picker.ViewId.PHOTOS)
			.setOAuthToken(oauthToken)
			.setLocale('ru')
			.setCallback(this.handleChange);

		if (this.props.origin) {
			picker.setOrigin(this.props.origin);
		}

		if (this.props.navHidden) {
			// picker.enableFeature(window.google.picker.Feature.NAV_HIDDEN);
		}

		if (this.props.multiselect) {
			picker.enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED);
		}

		picker.enableFeature(window.google.picker.Feature.SUPPORT_DRIVES);

		picker.build().setVisible(true);
	}

	handleChange = (data: any) => {
		if (data.action === google.picker.Action.PICKED) {
			this.props.onChange(data.docs);
		}
	};

	render() {
		return (
			<div onClick={this.onChoose}>
				{this.props.children ? this.props.children : <button>Open google chooser</button>}
			</div>
		);
	}
}
