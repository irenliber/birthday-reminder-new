import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
if (moment.locale() === 'ru') {
  LocaleConfig.locales['ru'] = {
    monthNames: moment.months(),
    monthNamesShort: moment.monthsShort(),
    dayNames: moment.weekdays(),
    dayNamesShort: moment.weekdaysShort(),
    today: 'Сегодня',
  };
  LocaleConfig.defaultLocale = 'ru';
}

import colors from '../utils/colors';
import useSWR from 'swr';
import { fetchBirthdays } from '../api/birthdays';
import formatDateNumber from '../utils/formatDateNumber';
import ItemTile from '../components/ItemTile';
const width = Dimensions.get('window').width;

const CalendarScreen = () => {
  const { data } = useSWR('/api/birthdays', async () => {
    return await fetchBirthdays();
  });
  const [day, setDay] = useState(moment().format('YYYY-MM-DD'));
  const [calendarYear, setCalendarYear] = useState(moment().format('YYYY'));
  const markedDates = useMemo(() => {
    let markers = {};
    data?.list?.forEach(({ day_at, month_at }) => {
      const dataString = `${calendarYear}-${formatDateNumber(
        month_at
      )}-${formatDateNumber(day_at)}`;
      markers = {
        ...markers,
        [moment(dataString, 'YYYY-MM-DD').format('YYYY-MM-DD')]: {
          marked: true,
          selectedColor: colors.green,
          dotColor: colors.red,
        },
      };
    });
    markers = {
      ...markers,
      [day]: {
        selected: true,
        marked: true,
        selectedColor: colors.main,
      },
    };
    return markers;
  }, [data, day, calendarYear]);
  const filteredData = useMemo(() => {
    const [_, current_month, current_day] = day?.split('-');
    return (
      data?.list?.filter(({ day_at, month_at }) => {
        return (
          current_day === formatDateNumber(day_at) &&
          current_month === formatDateNumber(month_at)
        );
      }) || []
    );
  }, [data, day]);
  return (
    <View style={styles.container}>
      <CalendarList
        // Enable horizontal scrolling, default = false
        horizontal={true}
        // Enable paging on horizontal, default = false
        pagingEnabled={true}
        // Set custom calendarWidth.
        calendarWidth={width}
        onVisibleMonthsChange={(months) => {
          if (months?.length > 0) {
            setCalendarYear(months[0].year);
          }
        }}
        firstDay={1}
        onDayPress={(day) => {
          setDay(day.dateString);
        }}
        markedDates={markedDates}
      />
      <ScrollView>
        {filteredData.map((item) => (
          <ItemTile key={item.id} {...item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
