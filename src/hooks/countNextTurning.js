import { useMemo } from 'react';
import moment from 'moment';

const countNextTurning = ({ day_at, month_at, year_at }) => {
  return useMemo(() => {
    if ((!day_at && !month_at) || !year_at) {
      return null;
    }
    const birthday = moment(`${day_at} ${month_at} ${year_at}`, 'DD MM YYYY');
    const date = moment(`${day_at} ${month_at}`, 'DD MM');
    if (date.isBefore(moment())) {
      date.add(1, 'year');
    }
    const years = date.diff(birthday.startOf('day'), 'years');
    return years;
  }, [day_at, month_at, year_at]);
};

export default countNextTurning;
