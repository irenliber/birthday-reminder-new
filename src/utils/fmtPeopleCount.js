import i18n from '../utils/i18n';

const fmtPeopleCount = (number, upperCase = true, showAction = false) => {
  let text = i18n.t('people', { count: number });
  if (upperCase) {
    return text.toUpperCase();
  }
  return text;
};

export default fmtPeopleCount;
