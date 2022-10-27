import {
	IPaidServiceOffer,
	IPaidServiceOfferWithPackages,
	IPaidServicePackagePaidServiceOffer,
	IPaidServicePackagePaidServiceOfferFull,
} from 'shared/collections/PaidServices';

interface ICalculateCart {
	packagesIds: string[] | [];
	offer: IPaidServiceOffer | IPaidServiceOfferWithPackages;
	packageList: IPaidServicePackagePaidServiceOffer[] | IPaidServicePackagePaidServiceOfferFull[];
}

export function calculateCart({packagesIds, offer, packageList}: ICalculateCart) {
	const packagesPrices: number[] = [];

	(Array.isArray(packagesIds) ? packagesIds : []).forEach((packageId) => {
		const foundPackage = (Array.isArray(packageList) ? packageList : []).find(
			(packageItem) => packageItem?._id === packageId,
		);
		if (foundPackage?.price) {
			packagesPrices.push(foundPackage.price);
		}
	});
	const packagesTotal = packagesPrices.reduce((a, b) => a + b, 0);

	const months = offer?.months || 0;
	const price = (offer?.price || 0) + packagesTotal;
	const discount = offer.discount || 0;
	const priceDiscount = price - price * (discount / 100);
	const priceDiscountMonthly = priceDiscount / months;

	return {
		discount,
		price: Math.ceil(price),
		priceDiscount: Math.ceil(priceDiscount),
		priceDiscountMonthly: Math.ceil(priceDiscountMonthly),
	};
}
