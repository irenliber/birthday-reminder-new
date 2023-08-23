import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import colors from '../utils/colors';
import formatDateNumber from '../utils/formatDateNumber';
import fmtBeforeDays from '../utils/fmtBeforeDays';
import fmtPeopleCount from '../utils/fmtPeopleCount';
import i18n from '../utils/i18n';

const ReminderTile = ({
  id: groupId,
  title,
  birthday_reminder_items_count,
  birthday_reminders,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>
          {title.toUpperCase()} ({fmtPeopleCount(birthday_reminder_items_count)}
          )
        </Text>
      </View>
      {birthday_reminders?.length > 0 &&
        birthday_reminders.map(({ id, minutes, hours, days }) => (
          <TouchableOpacity
            key={id}
            onPress={() =>
              navigation.navigate('NewReminder', {
                days,
                hours,
                minutes,
                title: i18n.t('editing_reminder'),
                mode: 'update',
                groupId,
                reminderId: id,
              })
            }
            style={styles.tile}
          >
            <View>
              <Text style={styles.daysMarker}>{fmtBeforeDays(days)}</Text>
            </View>
            <View style={styles.timeBlock}>
              <Text style={styles.timeText}>
                {hours}:{formatDateNumber(minutes)}
              </Text>
              <AntDesign
                name="right"
                size={20}
                color={colors.vivid}
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
        ))}
      <TouchableOpacity
        style={styles.tile}
        onPress={() =>
          navigation.navigate('NewReminder', {
            days: 0,
            hours: 10,
            minutes: 0,
            title: i18n.t('new_reminder'),
            groupId,
            mode: 'create',
          })
        }
      >
        <View style={styles.addReminderWrapper}>
          <AntDesign
            name="plus"
            size={20}
            color={colors.vivid}
            style={styles.addReminderIcon}
          />
          <Text style={styles.addBtn}>{i18n.t('add_reminder')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ReminderTile;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  title: {
    marginLeft: 15,
    color: colors.secondText,
  },
  titleWrapper: {
    height: 50,
    backgroundColor: colors.ultraLight,
    justifyContent: 'flex-end',
    paddingBottom: 5,
  },
  tile: {
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomColor: colors.light,
    borderBottomWidth: 0.5,
  },
  timeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
  addReminderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addReminderIcon: {
    marginRight: 10,
  },
  daysMarker: {
    fontSize: 16,
  },
  addBtn: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 16,
  },
});
