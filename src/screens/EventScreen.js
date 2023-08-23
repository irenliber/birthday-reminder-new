import React, { useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import AvatarSelector from '../components/AvatarSelector';
import colors from '../utils/colors';
import useSWR from 'swr';
import i18n from '../utils/i18n';

const EventScreen = ({ navigation, route: { params } }) => {
  const { data: tab } = useSWR('tab', null, false);
  const {
    birthday_reminder_item: {
      reminder_avatar: { url },
      note,
    },
  } = params;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                tab === 'Calendar' ? 'NewItemCalendar' : 'NewItem',
                params
              )
            }
          >
            <Text style={styles.changeBtn}>{i18n.t('change')}</Text>
          </TouchableOpacity>
        );
      },
    });
  }, [params, tab]);
  return (
    <ScrollView style={styles.container}>
      <AvatarSelector avatarUrl={url} user={params} disabled />
      <View style={styles.wrapper}>
        <View style={styles.noteWrapper}>
          <Text style={styles.noteTitle}>{i18n.t('one_note')}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(
              tab === 'Calendar' ? 'NoteCalendar' : 'Note',
              params
            );
          }}
          style={styles.noteInput}
        >
          <Text style={[styles.noteText]}>
            {note || i18n.t('one_note_desc')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapper: {
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  noteWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  noteInput: {
    marginTop: 20,
    backgroundColor: colors.superLight,
    borderRadius: 10,
    minHeight: 100,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  noteText: {
    color: colors.secondText,
    fontSize: 16,
  },
  changeBtn: {
    color: colors.active,
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 16,
  },
});
