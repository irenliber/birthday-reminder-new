import React, { useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  SectionList,
  Text,
} from "react-native";
import useSWR, { mutate } from 'swr';
import * as Notifications from 'expo-notifications';

import { fetchBirthdays } from '../api/birthdays';
import { fetchGroups } from '../api/groups';
import ItemTile from '../components/ItemTile';
import ListEmptySupport from '../components/ListEmptySupport';

import colors from '../utils/colors';
import groupBy from '../utils/groupBy';
import i18n from '../utils/i18n';
import moment from '../utils/moment';

const BirthdaysScreen = () => {
  const { data } = useSWR('/api/birthdays', async () => {
    return await fetchBirthdays();
  });

  useSWR('/api/groups', async () => {
    return await fetchGroups();
  });

  const notificationsHandler = async (list) => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    list.forEach((el) => {
      const {
        category,
        title,
        day_at,
        month_at,
        birthday_reminder_item: {
          first_name,
          last_name,
          birthday_group: { birthday_reminders },
        },
      } = el;

      birthday_reminders.forEach(({ minutes, hours, days }) => {
        const date = moment(`${day_at} ${month_at}`, 'DD MM')
          .startOf('day')
          .subtract(days, 'days')
          .add(hours, 'hours')
          .add(minutes, 'minutes');
        let notification = {
          content: {
            title: 'Bip. Birthday reminder',
            body: i18n.t('birthday_today', { first_name, last_name }),
          },
          trigger: date.toDate(),
        };
        if (category !== 'birthday') {
          notification = {
            ...notification,
            content: {
              title: `${first_name}: ${title}`,
              body: i18n.t('celebrates_today', { first_name, last_name }),
            },
          };
        }
        if (date.isBefore(moment())) {
          notification = {
            ...notification,
            trigger: date.add(1, 'year').toDate(),
          };
        }
        Notifications.scheduleNotificationAsync(notification);
      });
    });
  };

  useEffect(() => {
    if (data?.list) {
      notificationsHandler(data.list);
    }
  }, [data]);

  const monthsOrder = useMemo(() => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const monthIndex = moment().month();
    const firstPart = months.slice(monthIndex, months.length);
    const secondPart = months.slice(0, monthIndex);
    return [...firstPart, ...secondPart, monthIndex + 1];
  }, []);
  const sectionedData = useMemo(() => {
    if (data && data.list) {
      const grouped = groupBy(data.list, 'month_at');
      const groupedList = Object.keys(grouped).map((el) => {
        return { title: el, data: grouped[el] };
      });
      const sortData = (data) =>
        data.sort((a, b) => parseInt(a.day_at) - parseInt(b.day_at));
      let orderedList = [];
      monthsOrder.forEach((month, index) => {
        const el = groupedList.find((el) => parseInt(el.title) === month);
        if (el) {
          let modifiedElement = el;
          let title = moment(el.title, 'MM').format('MMMM').toUpperCase();
          // put next events for current month
          if (index === 0) {
            modifiedElement = {
              data: el.data.filter(
                (item) => moment(item.day_at, 'D') > moment()
              ),
            };
            const todayData = el.data.filter(
              (item) => item.day_at === moment().format('D')
            );
            // put today events
            if (todayData && todayData.length > 0) {
              orderedList = [
                ...orderedList,
                { title: i18n.t('today').toUpperCase(), data: todayData },
              ];
            }
          }
          // put previous events for current month
          if (index === 12) {
            modifiedElement = {
              data: el.data.filter(
                (item) =>
                  moment(item.day_at, 'D').add(1, 'day').startOf('day') <
                  moment()
              ),
            };
          }
          // remove month with empty elements
          if (modifiedElement.data.length === 0) return;
          orderedList = [...orderedList, { ...modifiedElement, title }];
        }
      });
      return orderedList.map((el) => ({ ...el, data: sortData(el.data) }));
    }
    return [];
  }, [data, monthsOrder]);


  return(
    <View style={styles.container}>
      <SectionList
        sections={sectionedData}
        refreshControl={
          <RefreshControl
            refreshing={!data}
            onRefresh={() => mutate('/api/birthdays')}
          />
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ItemTile key={item.id} {...item} />}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionBorder} />
            <Text style={styles.header}>{title}</Text>
          </View>
        )}
        ListEmptyComponent={ListEmptySupport({ data })}
        ListHeaderComponent={() => <View style={styles.ListHeaderComponent} />}
      />
    </View>
  );
}

export default BirthdaysScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  ListHeaderComponent: {
    height: 20,
  },
  sectionWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  sectionBorder: {
    borderWidth: 1,
    borderColor: colors.ultraLight,
    width: '100%',
    position: 'absolute',
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    color: colors.vivid,
    fontWeight: 'bold',
  },
});
