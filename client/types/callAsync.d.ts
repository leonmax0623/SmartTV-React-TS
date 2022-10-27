declare module "meteor/meteor" {
	module Meteor {
		function callAsync<T>(methodName: string, ...args: any[]): Promise<T>;

		function applyAsync<T>(methodName: string, args: EJSONable[], options?: {
			wait?: boolean;
			onResultReceived?: Function;
			returnStubValue?: boolean;
			throwStubExceptions?: boolean;
		}): Promise<T>;
	}
}
