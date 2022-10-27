import {
	PaidService,
	PaidServicePackage,
	PaidServicePackagesInitialData,
	PaidServicesInitialData,
} from 'shared/collections/PaidServices';

export default function setPaidServiceData() {
	// Создание тарифов
	if (PaidService.find().count() === 0) {
		Object.keys(PaidServicesInitialData).forEach((key) => {
			const value = PaidServicesInitialData[key];
			if (!value) return;

			PaidService.insert(value);
		});
	}

	// Создание пакетов
	if (PaidServicePackage.find().count() === 0) {
		Object.keys(PaidServicePackagesInitialData).forEach((key) => {
			const value = PaidServicePackagesInitialData[key];
			if (!value) return;
			PaidServicePackage.insert(value);
		});
	}
}
