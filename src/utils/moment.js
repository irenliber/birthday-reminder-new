import * as Localization from 'expo-localization';
import moment from 'moment';
import 'moment/locale/ru';
moment.locale(Localization.locale);
export default moment;
