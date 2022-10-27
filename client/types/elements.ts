interface IFeedStyle {
	fontSize?: number;
	color?: string;
	fontFamily?: string;
	backgroundColor?: string;
}

export interface IFeedStyles {
	headerStyle: IFeedStyle;
	timerStyle: IFeedStyle;
	textStyle: IFeedStyle;
}


export interface IFeedTelegramStyles {
	headerStyle: IFeedStyle;
	timerStyle: IFeedStyle;
	textStyle: IFeedStyle;
	footerStyle: IFeedStyle;
}