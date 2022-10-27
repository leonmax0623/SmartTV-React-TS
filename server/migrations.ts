import groupBy from 'lodash/groupBy';
import forEach from 'lodash/forEach';

import {
	SlideElementTypeEnum,
	SlideElement,
	PermanentPositionEnum,
	SlideElementVideoDisplayEnum,
	SlideElementSocialDisplayEnum,
	SlideElementVkMethodShowEnum,
	SlideElementVideoProviderEnum,
} from 'shared/collections/SlideElements';
import {TwitterGetTypeEnum} from 'shared/collections/Twitter';
import {IUser} from 'client/components/user/ProfilePage';
import {Slideshow} from 'shared/collections/Slideshows';
import {sharedConsts} from 'shared/constants/sharedConsts';
import {Group} from 'shared/collections/Groups';
import padStart from 'lodash/padStart';
import {SlideshowNumber} from 'shared/collections/SlideshowNumbers';
import {SlideStream} from 'shared/collections/SlideStream';
import {AppSets} from 'shared/collections/AppSets';

Migrations.add({
	version: 1,
	name: 'Добавление zIndex старым элементам',
	up() {
		const elements = SlideElement.find().fetch();

		forEach(groupBy(elements, 'slideId'), (slideElements) => {
			forEach(slideElements, (element, index) => {
				element.zIndex = index + 1;
				element.save();
			});
		});
	},
});

Migrations.add({
	version: 2,
	name: 'Добавление социальным сетям новых параметров',
	up() {
		SlideElement.update(
			{
				type: {
					$in: [
						SlideElementTypeEnum.FACEBOOK,
						SlideElementTypeEnum.ODNOKLASSNIKI,
						SlideElementTypeEnum.VKONTAKTE,
						SlideElementTypeEnum.TWITTER,
					],
				},
			},
			{
				$set: {
					postShowByOne: false,
					postShowTime: 5,
				},
			},
			{
				multi: true,
			},
		);

		SlideElement.update(
			{type: SlideElementTypeEnum.INSTAGRAM},
			{
				$set: {
					postShowByOne: true,
					postShowTime: 5,
				},
			},
			{
				multi: true,
			},
		);
	},
});

Migrations.add({
	version: 3,
	name: 'Добавление permanentPosition в slideElement',
	up() {
		SlideElement.update(
			{
				permanent: true,
			},
			{
				$set: {
					permanentPosition: PermanentPositionEnum.TOP,
				},
			},
			{
				multi: true,
			},
		);
	},
});

Migrations.add({
	version: 4,
	name: 'Twitter поиск по аккаунту',
	up() {
		SlideElement.update(
			{
				type: SlideElementTypeEnum.TWITTER,
			},
			{
				$set: {
					twitterGetType: TwitterGetTypeEnum.HASHTAG,
				},
			},
			{
				multi: true,
			},
		);
	},
});

Migrations.add({
	version: 5,
	name: 'Видео без звука и только звук',
	up() {
		SlideElement.update(
			{
				type: SlideElementTypeEnum.YOUTUBE,
			},
			{
				$set: {
					videoDisplay: SlideElementVideoDisplayEnum.NONE,
				},
			},
			{
				multi: true,
			},
		);
	},
});

Migrations.add({
	version: 6,
	name: 'Добавление социальным сетям параметр',
	up() {
		SlideElement.update(
			{
				type: {
					$in: [
						SlideElementTypeEnum.FACEBOOK,
						SlideElementTypeEnum.ODNOKLASSNIKI,
						SlideElementTypeEnum.VKONTAKTE,
						SlideElementTypeEnum.TWITTER,
						SlideElementTypeEnum.INSTAGRAM,
					],
				},
			},
			{
				$set: {
					socialDisplay: SlideElementSocialDisplayEnum.MEDIA_TOP,
				},
			},
			{
				multi: true,
			},
		);
	},
});

Migrations.add({
	version: 7,
	name: 'Добавление projectServices.vk и .google в user',
	up() {
		Meteor.users.update(
			{projectServices: {$exists: false}},
			{
				$set: {
					projectServices: {
						vk: null,
						google: null,
					},
				},
			},
			{multi: true},
		);
	},
});

Migrations.add({
	version: 8,
	name: 'Добавление projectServices.facebook в user',
	up() {
		Meteor.users.find().forEach(({_id, projectServices}: IUser) => {
			Meteor.users.update(
				{_id, projectServices: {$exists: true}},
				{
					$set: {projectServices: {...projectServices, facebook: null}},
				},
				{multi: true},
			);
		});
	},
});

Migrations.add({
	version: 9,
	name: 'Смена socialUserWall на methodShow и сброс projectServices.vk',
	up() {
		SlideElement.update(
			{socialUserWall: true},
			{$set: {vkMethodShow: SlideElementVkMethodShowEnum.USER_WALL, socialUserWall: false}},
			{multi: true},
		);

		Meteor.users.find().forEach(({_id, projectServices}: IUser) => {
			Meteor.users.update(
				{_id, projectServices: {$exists: true}},
				{
					$set: {projectServices: {...projectServices, vk: null}},
				},
				{multi: true},
			);
		});
	},
});

Migrations.add({
	version: 10,
	name: 'Принудительно обновление html',
	up() {
		SlideElement.update(
			{
				type: {
					$in: [SlideElementTypeEnum.HTML],
				},
			},
			{
				$set: {
					htmlUpdate: 0,
				},
			},
			{
				multi: true,
			},
		);
	},
});

Migrations.add({
	version: 11,
	name: 'Присвоение vkMethodShow элементам',
	up() {
		SlideElement.update(
			{vkMethodShow: {$exists: false}, type: SlideElementTypeEnum.VKONTAKTE},
			{$set: {vkMethodShow: SlideElementVkMethodShowEnum.GROUP}},
			{multi: true},
		);
	},
});

Migrations.add({
	version: 12,
	name: 'Добавление группы "Мои слайдшоу" во все слайдшоу',
	up() {
		Meteor.users.find().forEach(({_id}) => {
			const group = new Group({
				userId: _id,
				name: sharedConsts.user.slideShowGroupDefault,
			});

			group.save();

			Slideshow.update(
				{groupId: {$exists: false}, userId: _id},
				{$set: {groupId: group._id}},
				{multi: true},
			);
		});
	},
});

Migrations.add({
	version: 13,
	name: 'Добавление projectServices.twitter в user',
	up() {
		Meteor.users.find().forEach(({_id, projectServices}: IUser) => {
			Meteor.users.update(
				{_id, projectServices: {$exists: true}},
				{
					$set: {projectServices: {...projectServices, twitter: null}},
				},
				{multi: true},
			);
		});
	},
});

Migrations.add({
	version: 14,
	name: 'Присвоение videoProvider виджету видео',
	up() {
		SlideElement.update(
			{
				type: SlideElementTypeEnum.YOUTUBE,
			},
			{
				$set: {
					videoProvider: SlideElementVideoProviderEnum.YOUTUBE,
				},
			},
			{multi: true},
		);
	},
});

Migrations.add({
	version: 15,
	name: 'Создание коллекции с доступными номерами для различных коллекций',
	up() {
		// prettier-ignore
		const excludedNumbers = [
			'11111', '22222', '33333', '44444', '55555', '66666', '77777', '88888', '99999', '00000',
			'12345', '54321', '43210', '01234', '00001', '00002', '00004', '00005', '00006', '00007',
			'00009', '11112', '11113', '11114', '11115', '11116', '11117', '11118', '11119', '22221',
			'22223', '22224', '22225', '22226', '22227', '22228', '22229', '33331', '33332', '33334',
			'33335', '33336', '33337', '33338', '33339', '44441', '44442', '44443', '44445', '44446',
			'44447', '44448', '44449', '55551', '55552', '55553', '55554', '55556', '55557', '55558',
			'55559', '66661', '66662', '66663', '66664', '66665', '66667', '66668', '66669', '77771',
			'77772', '77773', '77774', '77775', '77776', '77778', '77779', '88881', '88882', '88883',
			'88884', '88885', '88886', '88887', '88889', '99991', '99992', '99993', '99994', '99995',
			'99996', '99997', '99998',
		];

		const maxNumber = 99999;
		const numLength = 5;

		for (let i = 1; i <= maxNumber; i += 1) {
			const numId = padStart(String(i), numLength, '0');

			if (excludedNumbers.includes(numId)) continue;

			const isAvailableForSlideshow = !Slideshow.findOne({numId});
			const isAvailableForSlideStream = !SlideStream.findOne({code: numId});
			const isAvailableForAppSet = !AppSets.findOne({numId});

			const slideshowNumber = new SlideshowNumber({
				number: numId,
				isAvailableForSlideshow,
				isAvailableForSlideStream,
				isAvailableForAppSet,
			});
			slideshowNumber.save();
		}
	},
});

const startMigrations = () => {
	Migrations.migrateTo('latest');
};

export {startMigrations};
