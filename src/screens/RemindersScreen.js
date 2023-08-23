import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import useSWR from 'swr';
import moment from 'moment';
import colors from '../utils/colors';
import { fetchGroups } from '../api/groups';
import ReminderTile from '../components/ReminderTile';
import * as Notifications from 'expo-notifications';
import EditReminderTile from '../components/EditReminderTile';
import i18n from '../utils/i18n';

const RemindersScreen = () => {
  const { data } = useSWR('/api/groups', async () => {
    return await fetchGroups();
  });

  return (
    <ScrollView style={styles.container}>
      {data?.list &&
        data.list.map((el) => <ReminderTile key={el.id} {...el} />)}

      <View style={styles.notificationWrapper}>
        <EditReminderTile
          action={() => {
            Notifications.scheduleNotificationAsync({
              content: {
                title: i18n.t('test_reminder'),
                body: i18n.t('you_are_all_set'),
              },
              trigger: moment().add(5, 'seconds').toDate(),
            });
            Alert.alert(i18n.t('test_reminder'), i18n.t('test_reminder_sent'));
          }}
          leftText={i18n.t('test_reminders')}
          leftStyles={styles.leftStyles}
        />
      </View>
    </ScrollView>
  );
};

export default RemindersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ultraLight,
  },
  notificationWrapper: {
    marginTop: 40,
    marginBottom: 50,
  },
  leftStyles: {
    fontSize: 16,
  },
});
