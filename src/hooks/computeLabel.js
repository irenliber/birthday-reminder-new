import React, { useMemo } from 'react';
import i18n from '../utils/i18n';

const computeLabel = ({ nextTurning, category, title }) => {
  const result = useMemo(() => {
    let label = '';
    if (nextTurning && nextTurning > 0 && category === 'birthday') {
      label = i18n.t('turning', { nextTurning });
    } else {
      label = label = i18n.t('birthday');
    }
    if (category === 'custom') {
      label = title;
    }
    if (category === 'anniversary') {
      label = i18n.t('anniversary');
    }
    return label;
  }, [nextTurning, category, title]);
  return result;
};

export default computeLabel;
