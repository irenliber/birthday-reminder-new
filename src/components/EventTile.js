import React, { useMemo, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import DialogInput from 'react-native-dialog-input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../utils/colors';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';
import i18n from '../utils/i18n';
import computeLabel from '../hooks/computeLabel';

const EventTile = ({
  item: {
    year_at,
    month_at,
    day_at,
    title,
    withYear,
    active,
    visibleDate,
    category,
  },
  updateValue,
  index,
}) => {
  const [activeDialog, setActiveDialog] = useState(false);
  const months = useMemo(() => moment.monthsShort(), []);
  const toggleVisibleDate = () =>
    updateValue(index, { visibleDate: !visibleDate });
  const calendarDate = useMemo(() => {
    const getData = (variableDay) => {
      return moment(
        `${variableDay} ${month_at} ${withYear && year_at}`,
        `D MMM ${withYear ? 'YYYY' : ''}`
      );
    };
    const result = getData(day_at);
    if (result.format() === 'Invalid date') {
      updateValue(index, { day_at: '13' });
      return getData(13);
    }
    return result;
  }, [month_at, day_at, year_at, withYear]);
  const days = useMemo(() => {
    const array = Array.from(
      { length: calendarDate.daysInMonth() },
      (_, i) => i + 1
    );
    return array;
  }, [month_at]);
  const years = useMemo(() => {
    const array = Array.from({ length: moment().year() }, (_, i) => i + 1);
    return array.reverse();
  }, []);
  const label = computeLabel({ category, title });

  const toggleAdd = (title) => {
    let data = {
      month_at: moment().format('MMM'),
      day_at: 15,
      year_at: moment().year().toString(),
      withYear: false,
      active: true,
      visibleDate: true,
    };
    if (title) {
      data = { ...data, title };
    }
    updateValue(index, data);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.birthdayContainer, { marginTop: 30 }]}
        onPress={() => {
          if (active) {
            toggleVisibleDate();
          } else {
            if (category === 'custom') {
              setActiveDialog(true);
            } else {
              toggleAdd();
            }
          }
        }}
      >
        <View style={styles.birthdayLabelContainer}>
          <AntDesign
            name="gift"
            size={20}
            color={colors.vivid}
            style={styles.birthdayIcon}
          />
          <Text numberOfLines={1} style={styles.birthdayLabel}>
            {label}
          </Text>
        </View>
        <View style={styles.dateWrapper}>
          {active && (
            <Text style={styles.birthdayDate}>
              {calendarDate.format(`DD.MM${withYear ? '.YYYY' : ''}`)}
            </Text>
          )}
          {!active && (
            <View>
              <Text style={styles.addBtn}>{i18n.t('add')}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      {visibleDate && (
        <>
          <View style={styles.dateContainer}>
            <View style={styles.dateElement}>
              <Picker
                selectedValue={month_at}
                onValueChange={(itemValue, itemIndex) =>
                  updateValue(index, { month_at: itemValue })
                }
              >
                {months.map((el) => (
                  <Picker.Item
                    key={el.toString()}
                    label={el.toString()}
                    value={el.toString()}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.dateElement}>
              <Picker
                selectedValue={day_at.toString()}
                onValueChange={(itemValue, itemIndex) => {
                  updateValue(index, { day_at: itemValue });
                }}
              >
                {days.map((el) => (
                  <Picker.Item
                    key={el.toString()}
                    label={el.toString()}
                    value={el.toString()}
                  />
                ))}
              </Picker>
            </View>
            {withYear && (
              <View style={styles.dateElement}>
                <Picker
                  selectedValue={year_at}
                  onValueChange={(itemValue, itemIndex) =>
                    updateValue(index, { year_at: itemValue })
                  }
                >
                  {years.map((el) => (
                    <Picker.Item
                      key={el.toString()}
                      label={el.toString()}
                      value={el.toString()}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>
          <View style={styles.birthdayContainer}>
            <Text style={styles.birthdayLabel}>{i18n.t('show_year')}</Text>
            <Switch
              value={withYear}
              onChange={(event) => {
                let new_year_at = '';
                if (event.nativeEvent.value) {
                  new_year_at = moment().format('YYYY');
                }
                updateValue(index, { withYear: !withYear, new_year_at });
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                `${i18n.t('delete')} ${title}`,
                i18n.t('are_you_sure'),
                [
                  {
                    text: i18n.t('cancel'),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: i18n.t('yes'),
                    onPress: () => updateValue(index, {}, true),
                  },
                ],
                { cancelable: false }
              );
            }}
            style={styles.birthdayContainer}
          >
            <Text numberOfLines={1} style={styles.deleteLabel}>
              {i18n.t('delete')} {label.toLowerCase()}
            </Text>
          </TouchableOpacity>
        </>
      )}
      <DialogInput
        cancelText={i18n.t('cancel')}
        submitText={i18n.t('submit')}
        modalStyle={styles.dialogInput}
        isDialogVisible={activeDialog}
        title={i18n.t('what_is_the_special_day')}
        submitInput={(inputText) => {
          toggleAdd(inputText);
          setActiveDialog(false);
        }}
        closeDialog={() => setActiveDialog(false)}
      ></DialogInput>
    </View>
  );
};

export default EventTile;

const styles = StyleSheet.create({
  birthdayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomColor: colors.light,
    borderBottomWidth: 2,
  },
  birthdayLabel: {
    fontSize: 18,
  },
  deleteLabel: {
    fontSize: 18,
    color: colors.red,
  },
  birthdayIcon: {
    marginRight: 10,
  },
  birthdayDate: {
    fontSize: 18,
  },
  birthdayLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1.2,
  },
  dateContainer: {
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        flexDirection: 'row',
      },
      android: {},
    }),
  },
  dateElement: {
    flex: 1,
    marginHorizontal: 10,
  },
  addBtn: {
    color: colors.active,
    fontSize: 16,
    fontWeight: '500',
  },
  dialogInput: {
    backgroundColor: colors.transparentGray,
  },
  dateWrapper: {
    flex: 0.6,
    alignItems: 'flex-end',
  },
});
