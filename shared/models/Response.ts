export interface IResponseSuccess {
	message: string;
}

export interface IResponseError {
	error: {
		message?: string;
		fields?: object;
	};
}
