import dayjs, {Dayjs} from 'dayjs';
import duration, {Duration} from 'dayjs/plugin/duration.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(duration);
dayjs.extend(customParseFormat);

export default dayjs;

export type {Dayjs, Duration};
