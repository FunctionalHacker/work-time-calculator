import dayjs, {Dayjs} from 'dayjs/esm';
import duration, {Duration} from 'dayjs/esm/plugin/duration';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';

dayjs.extend(duration);
dayjs.extend(customParseFormat);

export default dayjs;

export type {Dayjs, Duration};
