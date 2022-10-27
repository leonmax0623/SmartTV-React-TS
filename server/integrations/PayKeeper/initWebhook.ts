import {Meteor} from 'meteor/meteor';
import {Picker} from 'meteor/meteorhacks:picker';
import apiRoutes from 'client/constants/apiRoutes';
import {methodNames} from 'shared/constants/methodNames';
import crypto from 'crypto';
import queryString from 'query-string';
const secretSeed = Meteor.settings?.services?.payKeeper?.secretSeed || '';

export function initWebhook() {
	const paymentHook = Picker.filter((req: any) => {
		return req.method === 'POST';
	});
	paymentHook.route(apiRoutes.paymentHook, function(params, req, res) {
		let responseText = '';

		req.on(
			'data',
			Meteor.bindEnvironment((requestData: object) => {
				try {
					// IPayKeeperPostHookData - данные запроса. который приходит
					const data = queryString.parse(requestData.toString());
					const hashInput = `${data.id}${secretSeed}`;
					const md5Hash = crypto
						.createHash('md5')
						.update(hashInput)
						.digest('hex');
					responseText = `OK ${md5Hash}`;

					const verifyResult = Meteor.call(
						methodNames.paidServices.verifyPayment,
						data.orderid,
					);
					console.log(verifyResult);

					res.writeHead(200);
					res.end(responseText);
				} catch (e) {
					console.log('Invalid data from payment service.', e);
				}
			}),
		);
	});
}
