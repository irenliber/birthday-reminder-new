import { useMemo } from 'react';
import moment from 'moment';
import formatDateNumber from '../utils/formatDateNumber';

const countBeforeDaysHook = ({ day_at, month_at }) => {
  return useMemo(() => {
    if (!day_at && !month_at) {
      return null;
    }
    const date = moment(`${day_at} ${month_at}`, 'DD MM');
    if (date.isBefore(moment())) {
      date.add(1, 'year');
    }
    const days = date.diff(moment().startOf('day'), 'days');
    const formattedDate = `${formatDateNumber(day_at)} ${formatDateNumber(
      month_at
    )}`;
    const formattedToday = moment().format('DD MM');
    if (formattedDate === formattedToday) {
      return 0;
    }
    return days;
  }, [day_at, month_at]);
};

export default countBeforeDaysHook;
