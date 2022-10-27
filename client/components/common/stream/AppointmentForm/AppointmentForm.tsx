import {withComponents} from '@devexpress/dx-react-core';
import {AppointmentForm as AppointmentFormBase} from '@devexpress/dx-react-scheduler';
import {Layout} from './layout';
import {TextEditor} from './common/text-editor';
import BasicLayout from './basic/layout';
import {Layout as CommandLayout} from './command/layout';
import {CommandButton} from './command/command-button';
import {Overlay} from './overlay';
import {DateEditor} from './common/date-editor';
import {Label} from './common/label';
import {BooleanEditor} from './common/boolean-editor';
import {Select} from '../common/select/select';
import {Layout as RecurrenceLayout} from './recurrence/layout';
import {RadioGroup} from './recurrence/radio-group/radio-group';
import {WeeklyRecurrenceSelector} from './recurrence/weekly-recurrence-selector';
import {OverlayContainer as Container} from '../common/overlay-container';
import {ResourceEditor} from './basic/resource-editor';

export const AppointmentForm = withComponents({
	Overlay,
	Layout,
	TextEditor,
	BasicLayout,
	CommandLayout,
	CommandButton,
	DateEditor,
	Label,
	BooleanEditor,
	Select,
	RecurrenceLayout,
	RadioGroup,
	WeeklyRecurrenceSelector,
	Container,
	ResourceEditor,
})(AppointmentFormBase);
