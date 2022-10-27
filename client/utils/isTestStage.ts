/**
 * Сюда можно указать домены, где не должны отображаться новые фичи
 */
const testStages = [
	'localhost:3007',
	'localhost:3000',
	't-prtv-tl2445639_stage-1.creonit.dev',
	'new.prtv.su',
];

export const isTestStage = (): boolean => testStages.includes(window.location.host);
