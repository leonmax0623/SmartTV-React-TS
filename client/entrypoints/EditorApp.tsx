import * as React from 'react';
import {Provider} from 'react-redux';
import {hot} from 'react-hot-loader';
import {MuiThemeProvider} from '@material-ui/core/styles';
import GoogleFontLoader from 'react-google-font-loader';

import Root from 'client/components/Root';
import theme from 'client/muiTheme';
import {store} from 'client/store/store';
import {googleFonts} from 'shared/models/GoogleFonts';

const EditorApp = () => (
	<Provider store={store}>
		<MuiThemeProvider theme={theme}>
			{/*google fonts from googleFonts const are loaded here */}
			{/* slideshow.additionalFonts are loaded inside SlideShowEditorPage.tsx */}
			<GoogleFontLoader
				fonts={googleFonts.map((font) => ({
					font,
					weights: [400, 700],
				}))}
				subsets={['cyrillic-ext', 'cyrillic']}
			/>

			<Root />
		</MuiThemeProvider>
	</Provider>
);

export default hot(module)(EditorApp);
