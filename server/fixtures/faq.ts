import {Faq, faqInitialData} from 'shared/collections/Faq';

export default function setFaqData() {
	if (Faq.find().count() === 0) {
		Object.keys(faqInitialData).forEach((key) => {
			const value = faqInitialData[key];
			if (!value) return;

			Faq.insert(value);
		});
	}
}
