import React, { useLayoutEffect, useState, useEffect } from 'react';
import { mutate } from 'swr';

import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import i18n from '../utils/i18n';
import colors from '../utils/colors';
import EditReminderTile from '../components/EditReminderTile';
import fmtBeforeDays from '../utils/fmtBeforeDays';
import formatDateNumber from '../utils/formatDateNumber';
import {Picker} from '@react-native-picker/picker';
import createArrayFromRange from '../utils/createArrayFromRange';
import { updateGroup } from '../api/groups';

const NewReminderScreen = ({ navigation, route: { params } }) => {
  const { title, mode, groupId, reminderId } = params;
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(0);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDaysPicker, setShowDaysPicker] = useState(false);
  useEffect(() => {
    setDays(params.days);
    setHours(params.hours);
    setMinutes(params.minutes);
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () => (
        <TouchableOpacity
          style={styles.editBtn}
          onPress={async () => {
            await mutate('global_loading', true, false);
            try {
              if (mode === 'update') {
                await updateGroup({
                  group: {
                    id: groupId,
                    birthday_reminders_attributes: [
                      {
                        id: reminderId,
                        days,
                        minutes,
                        hours,
                      },
                    ],
                  },
                });
              }
              if (mode === 'create') {
                await updateGroup({
                  group: {
                    id: groupId,
                    birthday_reminders_attributes: [
                      {
                        days,
                        minutes,
                        hours,
                      },
                    ],
                  },
                });
              }
              await mutate('/api/groups');
              mutate('/api/birthdays');
              navigation.goBack();
            } catch (e) {
              console.log(e.response);
              Alert.alert('Error', 'Something went wrong. Try again later');
            } finally {
              await mutate('global_loading', false, false);
            }
          }}
        >
          <Text style={styles.doneBtn}>{i18n.t('done')}</Text>
        </TouchableOpacity>
      ),
    });
  }, [title, minutes, hours, days, mode]);
  return (
    <ScrollView style={styles.container}>
      <EditReminderTile
        action={() => setShowDaysPicker(!showDaysPicker)}
        leftText={i18n.t('date')}
        rightText={fmtBeforeDays(days)}
      />
      {showDaysPicker && (
        <View style={styles.picker}>
          <Picker
            selectedValue={days.toString()}
            onValueChange={(itemValue, itemIndex) => setDays(itemValue)}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 14, 21, 28].map((el) => (
              <Picker.Item
                key={el.toString()}
                label={fmtBeforeDays(el)}
                value={el.toString()}
              />
            ))}
          </Picker>
        </View>
      )}
      <EditReminderTile
        leftText={i18n.t('time')}
        rightText={`${hours}:${formatDateNumber(minutes)}`}
        action={() => setShowTimePicker(!showTimePicker)}
      />
      {showTimePicker && (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={hours.toString()}
              onValueChange={(itemValue, itemIndex) => setHours(itemValue)}
            >
              {createArrayFromRange(0, 23).map((el) => (
                <Picker.Item
                  key={el.toString()}
                  label={el.toString()}
                  value={el.toString()}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={minutes.toString()}
              onValueChange={(itemValue, itemIndex) => setMinutes(itemValue)}
            >
              {createArrayFromRange(0, 59).map((el) => (
                <Picker.Item
                  key={el.toString()}
                  label={el.toString()}
                  value={el.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}
      {mode === 'update' && (
        <View style={styles.removeBtn}>
          <EditReminderTile
            showIcon={false}
            leftStyles={styles.removeText}
            leftText={i18n.t('remove_reminder')}
            action={async () => {
              await mutate('global_loading', true, false);
              try {
                await updateGroup({
                  group: {
                    id: groupId,
                    birthday_reminders_attributes: [
                      {
                        id: reminderId,
                        _destroy: '1',
                      },
                    ],
                  },
                });
                await mutate('/api/groups');
                mutate('/api/birthdays');
                navigation.goBack();
              } catch (e) {
                console.log(e.response);
                Alert.alert('Error', 'Something went wrong. Try again later');
              } finally {
                await mutate('global_loading', false, false);
              }
            }}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default NewReminderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ultraLight,
    marginTop: 15,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    ...Platform.select({
      ios: {
        flexDirection: 'row',
      },
      android: {
        flexDirection: 'column',
      },
    }),
  },
  picker: {
    backgroundColor: colors.white,
    borderBottomColor: colors.light,
    borderBottomWidth: 0.5,
    paddingHorizontal: 10,
  },
  doneBtn: {
    color: colors.active,
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 16,
  },
  removeBtn: {
    marginTop: 25,
  },
  removeText: {
    color: colors.red,
  },
});
