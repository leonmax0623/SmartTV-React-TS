import LetterSpacingIcon from 'client/utils/tinyMCEPlugins/icons/LetterSpacingIcon';

export default (editor: any) => {
	const letterSpacingValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

	editor.ui.registry.addIcon('letterSpacing', LetterSpacingIcon);

	editor.on('init', () => {
		letterSpacingValues.forEach((ls) => {
			editor.formatter.register(`letterspacing-${ls}`, {
				block: 'p',
				styles: {'letter-spacing': `${ls}px`},
			});
		});
	});

	return {
		icon: 'letterSpacing',
		tooltip: 'Letter spacing',
		fetch: function(callback: (menuItems: any) => void) {
			callback(
				letterSpacingValues.map((ls) => ({
					type: 'togglemenuitem',
					text: String(ls),
					onAction: function() {
						editor.formatter.apply(`letterspacing-${ls}`);
					},
					onSetup: function(api: any) {
						api.setActive(editor.formatter.match(`letterspacing-${ls}`));
						return () => {};
					},
				})),
			);
		},
	};
};
