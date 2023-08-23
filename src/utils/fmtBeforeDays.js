import i18n from '../utils/i18n';

const fmtBeforeDays = (days) => {
  days = parseInt(days);
  if (days === 0) {
    return i18n.t('day_of_occasion');
  }
  if (days < 7) {
    return i18n.t('days_before', { count: days });
  }
  if (days >= 7) {
    return i18n.t('weeks_before', { count: days / 7 });
  }
};

export default fmtBeforeDays;
