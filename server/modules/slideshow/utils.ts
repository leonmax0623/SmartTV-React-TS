import {ISlideshow} from 'shared/collections/Slideshows';
import {getUniqNumId} from 'shared/utils/methods';
import {Slide} from 'shared/collections/Slides';
import {SlideElement, ISlideElement} from 'shared/collections/SlideElements';

export const copySlideshow = (slideshow: MeteorAstronomy.Model<ISlideshow>, userId: string) => {
	if (!userId || !slideshow) {
		return;
	}

	const slideshowId = slideshow._id;
	const newSlideshow = slideshow.copy();

	newSlideshow.userId = userId;
	newSlideshow.isSystem = false;

	const numId = getUniqNumId('slideshow');

	newSlideshow.numId = numId;
	newSlideshow.name = `Слайдшоу №${numId}`;
	const newSlideshowId = newSlideshow.save();

	const slidePositionById = {};
	const slideIdByPosition = {};
	const permanentElementIds: string[] = [];

	const slideFound = Slide.find({slideshowId});
	//TODO тут тоже можно было бы оптимизировать, но я бы пока оставил как есть, есть великий риск сломать
	slideFound.forEach((slide: any) => {
		const copySlide = slide.copy();
		copySlide.slideshowId = newSlideshowId;
		const newSlideId = copySlide.save();

		slidePositionById[slide._id] = slide.position;
		slideIdByPosition[copySlide.position] = newSlideId;

		SlideElement.find({slideshowId, slideId: slide._id}).forEach((slideElement: any) => {
			const newSlideElement = slideElement.copy();
			newSlideElement.slideshowId = newSlideshowId;
			newSlideElement.slideId = newSlideId;

			const newSlideElementId = newSlideElement.save();

			if (newSlideElement.permanentOnSlides && newSlideElement.permanentOnSlides.length > 0) {
				permanentElementIds.push(newSlideElementId);
			}
		});
	});

	SlideElement.find({_id: {$in: permanentElementIds}}).forEach(
		(slideElement: MeteorAstronomy.Model<ISlideElement>) => {
			slideElement.permanentOnSlides = slideElement.permanentOnSlides
				.map((slideId: string) => slideIdByPosition[slidePositionById[slideId]])
				.filter((id) => id);

			slideElement.save();
		},
	);

	return newSlideshow;
};
